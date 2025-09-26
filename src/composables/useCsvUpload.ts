import { ref, computed } from 'vue'
import Papa from 'papaparse'
import { useSupabaseData, type TrafficData } from './useSupabaseData'
import { supabase } from '../lib/supabase'

export interface CsvUploadResult {
  success: boolean
  message: string
  inserted: number
  errors: string[]
}

export function useCsvUpload(tableName: string = 'traffic') {
  const uploading = ref(false)
  const progress = ref(0)
  const { insertData } = useSupabaseData()

  // Parser le fichier CSV
  const parseCsvFile = (file: File): Promise<Record<string, unknown>[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
          if (results.errors.length > 0) {
            reject(
              new Error(`Erreurs de parsing: ${results.errors.map((e) => e.message).join(', ')}`),
            )
          } else {
            resolve(results.data)
          }
        },
        error: (error: Error) => {
          reject(error)
        },
      })
    })
  }

  // Valider et transformer les données CSV
  const validateAndTransformData = (
    csvData: Record<string, unknown>[],
  ): { valid: TrafficData[]; errors: string[] } => {
    const valid: TrafficData[] = []
    const errors: string[] = []

    csvData.forEach((row, index) => {
      try {
        // Debug: afficher les données reçues (seulement les 3 premières lignes)
        if (index < 3) {
          console.log(`Ligne ${index + 2}:`, row)
          console.log(`Clés disponibles:`, Object.keys(row))
        }

        // Validation des champs requis (seulement les champs vraiment obligatoires)
        const requiredFields = [
          'analysis_month',
          'avg_daily_traffic',
          'yoy_change',
          'mom_change',
          'new_visitor_rate',
          'returning_visitor_rate',
          'new_visitor_yoy_change',
          'new_visitor_mom_change',
          'mobile_share',
          'mobile_yoy_change',
          'mobile_mom_change',
          'paid_traffic_share',
          'paid_traffic_yoy_change',
          'paid_traffic_mom_change',
          'percentile_rank',
          'project_count',
        ]

        // Note: Les champs country, industry, device, et les champs JSONB sont optionnels
        const missingFields = requiredFields.filter((field) => {
          const value = row[field]
          const isMissing =
            value === undefined ||
            value === null ||
            value === '' ||
            (typeof value === 'string' && value.trim() === '')
          if (isMissing && index < 3) {
            console.log(`Champ manquant: ${field}, valeur:`, value)
          }
          return isMissing
        })

        if (missingFields.length > 0) {
          errors.push(`Ligne ${index + 2}: Champs manquants: ${missingFields.join(', ')}`)
          return
        }

        // Transformation des données
        const transformedData: Omit<TrafficData, 'calculation_timestamp'> = {
          analysis_month: String(row.analysis_month).trim(),
          country: row.country ? String(row.country).trim() : '',
          industry: row.industry ? String(row.industry).trim() : '',
          device: row.device ? String(row.device).trim() : '',
          avg_daily_traffic: parseFloat(String(row.avg_daily_traffic)),
          yoy_change: parseFloat(String(row.yoy_change)),
          mom_change: String(row.mom_change).trim(),
          new_visitor_rate: parseFloat(String(row.new_visitor_rate)),
          returning_visitor_rate: parseFloat(String(row.returning_visitor_rate)),
          new_visitor_yoy_change: parseFloat(String(row.new_visitor_yoy_change)),
          new_visitor_mom_change: String(row.new_visitor_mom_change).trim(),
          mobile_share: parseFloat(String(row.mobile_share)),
          mobile_yoy_change: parseFloat(String(row.mobile_yoy_change)),
          mobile_mom_change: String(row.mobile_mom_change).trim(),
          paid_traffic_share: parseFloat(String(row.paid_traffic_share)),
          paid_traffic_yoy_change: parseFloat(String(row.paid_traffic_yoy_change)),
          paid_traffic_mom_change: String(row.paid_traffic_mom_change).trim(),
          traffic_share_by_channel:
            row.traffic_share_by_channel && String(row.traffic_share_by_channel).trim() !== ''
              ? JSON.parse(String(row.traffic_share_by_channel))
              : {},
          bounce_rate_by_channel:
            row.bounce_rate_by_channel && String(row.bounce_rate_by_channel).trim() !== ''
              ? JSON.parse(String(row.bounce_rate_by_channel))
              : {},
          channel_yoy_changes:
            row.channel_yoy_changes && String(row.channel_yoy_changes).trim() !== ''
              ? JSON.parse(String(row.channel_yoy_changes))
              : {},
          device_distribution:
            row.device_distribution && String(row.device_distribution).trim() !== ''
              ? JSON.parse(String(row.device_distribution))
              : {},
          percentile_rank: parseInt(String(row.percentile_rank)),
          project_count: parseInt(String(row.project_count)),
          id: row.id ? parseInt(String(row.id)) : 0,
        }

        // Validation des types
        if (isNaN(transformedData.avg_daily_traffic)) {
          errors.push(
            `Ligne ${index + 2}: Trafic quotidien moyen invalide: ${row.avg_daily_traffic}`,
          )
          return
        }

        if (
          isNaN(transformedData.percentile_rank) ||
          transformedData.percentile_rank < 0 ||
          transformedData.percentile_rank > 100
        ) {
          errors.push(`Ligne ${index + 2}: Rang percentile invalide: ${row.percentile_rank}`)
          return
        }

        if (isNaN(transformedData.project_count) || transformedData.project_count < 0) {
          errors.push(`Ligne ${index + 2}: Nombre de projets invalide: ${row.project_count}`)
          return
        }

        valid.push(transformedData as TrafficData)
      } catch (error) {
        errors.push(`Ligne ${index + 2}: Erreur de transformation - ${error}`)
      }
    })

    return { valid, errors }
  }

  // Vérifier les ID existants et résoudre les conflits
  const resolveIdConflicts = async (
    csvData: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> => {
    console.log("🔍 Vérification des conflits d'ID...")

    // Récupérer tous les ID existants
    const { data: existingData } = await supabase
      .from(tableName)
      .select('id')
      .order('id', { ascending: false })
      .limit(1)

    let maxExistingId = 0
    if (existingData && existingData.length > 0) {
      maxExistingId = existingData[0].id || 0
    }

    console.log(`📊 ID maximum existant: ${maxExistingId}`)

    // Traiter chaque ligne pour résoudre les conflits d'ID
    const resolvedData = csvData.map((row, index) => {
      const csvId = row.id ? parseInt(String(row.id)) : null

      if (csvId && csvId <= maxExistingId) {
        // ID en conflit, on l'incrémente
        const newId = maxExistingId + index + 1
        console.log(`🔄 Ligne ${index + 2}: ID ${csvId} → ${newId} (conflit résolu)`)
        return { ...row, id: newId }
      } else if (csvId && csvId > maxExistingId) {
        // ID valide, on le garde
        console.log(`✅ Ligne ${index + 2}: ID ${csvId} (valide)`)
        return row
      } else {
        // Pas d'ID, on en génère un
        const newId = maxExistingId + index + 1
        console.log(`🆕 Ligne ${index + 2}: ID généré ${newId}`)
        return { ...row, id: newId }
      }
    })

    return resolvedData
  }

  // Upload du fichier CSV
  const uploadCsvFile = async (file: File): Promise<CsvUploadResult> => {
    try {
      uploading.value = true
      progress.value = 0

      // Étape 1: Parser le CSV
      progress.value = 20
      const csvData = await parseCsvFile(file)

      // Étape 2: Résoudre les conflits d'ID
      progress.value = 40
      const resolvedData = await resolveIdConflicts(csvData)

      // Étape 3: Valider et transformer
      progress.value = 60
      const { valid, errors } = validateAndTransformData(resolvedData)

      if (errors.length > 0) {
        return {
          success: false,
          message: `${errors.length} erreur(s) trouvée(s) dans le fichier CSV`,
          inserted: 0,
          errors,
        }
      }

      if (valid.length === 0) {
        return {
          success: false,
          message: 'Aucune donnée valide trouvée dans le fichier CSV',
          inserted: 0,
          errors: [],
        }
      }

      // Étape 4: Insérer en base par lots
      progress.value = 80
      const batchSize = 100
      let totalInserted = 0

      for (let i = 0; i < valid.length; i += batchSize) {
        const batch = valid.slice(i, i + batchSize)
        await insertData(batch)
        totalInserted += batch.length
        progress.value = 75 + (i / valid.length) * 25
      }

      progress.value = 100

      return {
        success: true,
        message: `${totalInserted} enregistrement(s) inséré(s) avec succès`,
        inserted: totalInserted,
        errors: [],
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erreur lors de l'upload",
        inserted: 0,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
      }
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  // Télécharger un template CSV
  const downloadTemplate = () => {
    const getTemplateForTable = (table: string) => {
      if (table === 'traffic') {
        return {
          analysis_month: '2024-01',
          country: 'France',
          industry: 'Technology',
          device: 'Desktop',
          avg_daily_traffic: 1000,
          yoy_change: 15.5,
          mom_change: '5.2%',
          new_visitor_rate: 0.65,
          returning_visitor_rate: 0.35,
          new_visitor_yoy_change: 12.3,
          new_visitor_mom_change: '3.1%',
          mobile_share: 0.45,
          mobile_yoy_change: 8.7,
          mobile_mom_change: '2.4%',
          paid_traffic_share: 0.25,
          paid_traffic_yoy_change: 20.1,
          paid_traffic_mom_change: '4.8%',
          traffic_share_by_channel: '{"organic": 0.4, "direct": 0.3, "social": 0.2, "paid": 0.1}',
          bounce_rate_by_channel: '{"organic": 0.35, "direct": 0.25, "social": 0.45, "paid": 0.30}',
          channel_yoy_changes: '{"organic": 10.5, "direct": 5.2, "social": 25.8, "paid": 20.1}',
          device_distribution: '{"desktop": 0.55, "mobile": 0.35, "tablet": 0.10}',
          percentile_rank: 75,
          project_count: 150,
        }
      } else if (table === 'engagement') {
        return {
          analysis_month: '2024-01',
          country: 'France',
          industry: 'Technology',
          device: 'Desktop',
          avg_session_duration: 180,
          pages_per_session: 3.2,
          bounce_rate: 0.45,
          // Ajoutez d'autres champs selon votre schéma
        }
      } else if (table === 'frustration') {
        return {
          analysis_month: '2024-01',
          country: 'France',
          industry: 'Technology',
          device: 'Desktop',
          error_rate: 0.02,
          slow_page_rate: 0.15,
          // Ajoutez d'autres champs selon votre schéma
        }
      } else if (table === 'conversion') {
        return {
          analysis_month: '2024-01',
          country: 'France',
          industry: 'Technology',
          device: 'Desktop',
          conversion_rate: 0.035,
          revenue: 1500,
          // Ajoutez d'autres champs selon votre schéma
        }
      }
      return {}
    }

    const template = [getTemplateForTable(tableName)]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `template_${tableName}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return {
    uploading: computed(() => uploading.value),
    progress: computed(() => progress.value),
    uploadCsvFile,
    downloadTemplate,
  }
}
