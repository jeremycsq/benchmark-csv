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

    // Récupère la première valeur définie parmi plusieurs alias de colonnes
    const pick = (row: Record<string, unknown>, keys: string[]): unknown => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
          return row[key]
        }
      }
      return undefined
    }

    const toNumber = (val: unknown): number => {
      if (val === undefined || val === null || val === '') return NaN
      const n = parseFloat(String(val).replace('%', '').trim())
      return isNaN(n) ? NaN : n
    }

    // Normalise une ligne du CSV en clés attendues par TrafficData
    const normalizeRow = (row: Record<string, unknown>) => {
      const analysis_month = pick(row, ['analysis_month', 'ANALYSIS_MONTH'])
      const country = pick(row, ['country', 'COUNTRY', 'COUNTRY_CODE'])
      const industry = pick(row, ['industry', 'INDUSTRY'])
      const device = pick(row, ['device', 'DEVICE', 'DEVICE_ID'])

      // Valeurs numériques avec équivalences
      const avg_daily_traffic =
        pick(row, ['avg_daily_traffic', 'AVG_DAILY_TRAFFIC', 'OVERALL_AVG_DAILY_TRAFFIC']) ?? ''
      const yoy_change = pick(row, ['yoy_change', 'OVERALL_YOY_CHANGE', 'TRAFFIC_YOY_CHANGE'])
      const mom_change = pick(row, ['mom_change', 'OVERALL_MOM_CHANGE'])

      let new_visitor_rate = pick(row, ['new_visitor_rate', 'NEW_VISITOR_RATE'])
      let returning_visitor_rate = pick(row, ['returning_visitor_rate', 'RETURNING_VISITOR_RATE'])
      let mobile_share = pick(row, ['mobile_share', 'MOBILE_SHARE'])
      let paid_traffic_share = pick(row, ['paid_traffic_share', 'PAID_TRAFFIC_SHARE'])

      const new_visitor_yoy_change = pick(row, ['new_visitor_yoy_change', 'NEW_VISITOR_YOY_CHANGE'])
      const new_visitor_mom_change = pick(row, ['new_visitor_mom_change', 'NEW_VISITOR_MOM_CHANGE'])
      const mobile_yoy_change = pick(row, ['mobile_yoy_change', 'MOBILE_YOY_CHANGE'])
      const mobile_mom_change = pick(row, ['mobile_mom_change', 'MOBILE_MOM_CHANGE'])
      const paid_traffic_yoy_change = pick(row, [
        'paid_traffic_yoy_change',
        'PAID_TRAFFIC_YOY_CHANGE',
      ])
      const paid_traffic_mom_change = pick(row, [
        'paid_traffic_mom_change',
        'PAID_SHARE_MOM_CHANGE',
      ])

      // JSON
      const traffic_share_by_channel =
        pick(row, [
          'traffic_share_by_channel',
          'TRAFFIC_SHARE_BY_CHANNEL',
          'TRAFFIC_SHARE_BY_CHANNEL_JSON',
        ]) ?? ''
      const bounce_rate_by_channel =
        pick(row, ['bounce_rate_by_channel', 'BOUNCE_RATE_BY_CHANNEL']) ?? ''
      const channel_yoy_changes =
        pick(row, ['channel_yoy_changes', 'TRAFFIC_YOY_CHANGE_BY_CHANNEL_JSON']) ?? ''
      const device_distribution = pick(row, ['device_distribution', 'DEVICE_DISTRIBUTION']) ?? ''

      // Rangs et projets
      const percentile_rank = pick(row, ['percentile_rank', 'PERCENTILE_RANK']) ?? 0
      const project_count = pick(row, ['project_count', 'PROJECT_COUNT']) ?? 0

      // Normalisation pourcentages (si >1 alors convertir en ratio)
      const asRatio = (v: unknown): number => {
        const n = toNumber(v)
        if (isNaN(n)) return NaN
        return n > 1 ? n / 100 : n
      }

      new_visitor_rate = asRatio(new_visitor_rate)
      returning_visitor_rate = asRatio(returning_visitor_rate)
      mobile_share = asRatio(mobile_share)
      paid_traffic_share = asRatio(paid_traffic_share)

      return {
        analysis_month,
        country,
        industry,
        device,
        avg_daily_traffic,
        yoy_change,
        mom_change,
        new_visitor_rate,
        returning_visitor_rate,
        new_visitor_yoy_change,
        new_visitor_mom_change,
        mobile_share,
        mobile_yoy_change,
        mobile_mom_change,
        paid_traffic_share,
        paid_traffic_yoy_change,
        paid_traffic_mom_change,
        traffic_share_by_channel,
        bounce_rate_by_channel,
        channel_yoy_changes,
        device_distribution,
        percentile_rank,
        project_count,
        id: pick(row, ['id', 'ID']),
      }
    }

    csvData.forEach((row, index) => {
      try {
        // Debug: afficher les données reçues (seulement les 3 premières lignes)
        if (index < 3) {
          console.log(`Ligne ${index + 2}:`, row)
          console.log(`Clés disponibles:`, Object.keys(row))
        }

        // Normaliser la ligne pour accepter différents schémas (MAJUSCULES, alias)
        const normalized = normalizeRow(row)

        // Validation des champs requis (strict minimum)
        // Beaucoup de datasets n'ont pas les colonnes de variations YoY/MoM → on les rend optionnelles
        const requiredFields = [
          'analysis_month',
          'avg_daily_traffic',
          'new_visitor_rate',
          'mobile_share',
          'paid_traffic_share',
          'percentile_rank',
          'project_count',
        ]

        // Note: Les champs country, industry, device, et les champs JSONB sont optionnels
        const missingFields = requiredFields.filter((field) => {
          const value = normalized[field as keyof typeof normalized]
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
          analysis_month: String(normalized.analysis_month).trim(),
          country: normalized.country ? String(normalized.country).trim() : '',
          industry: normalized.industry ? String(normalized.industry).trim() : '',
          device: normalized.device ? String(normalized.device).trim() : '',
          avg_daily_traffic: toNumber(normalized.avg_daily_traffic),
          yoy_change: isNaN(toNumber(normalized.yoy_change)) ? 0 : toNumber(normalized.yoy_change),
          mom_change:
            normalized.mom_change !== undefined && String(normalized.mom_change).trim() !== ''
              ? String(normalized.mom_change).trim()
              : '0%',
          new_visitor_rate: Number(normalized.new_visitor_rate),
          returning_visitor_rate: Number(normalized.returning_visitor_rate),
          new_visitor_yoy_change: isNaN(toNumber(normalized.new_visitor_yoy_change))
            ? 0
            : toNumber(normalized.new_visitor_yoy_change),
          new_visitor_mom_change:
            normalized.new_visitor_mom_change !== undefined &&
            String(normalized.new_visitor_mom_change).trim() !== ''
              ? String(normalized.new_visitor_mom_change).trim()
              : '0%',
          mobile_share: Number(normalized.mobile_share),
          mobile_yoy_change: isNaN(toNumber(normalized.mobile_yoy_change))
            ? 0
            : toNumber(normalized.mobile_yoy_change),
          mobile_mom_change:
            normalized.mobile_mom_change !== undefined &&
            String(normalized.mobile_mom_change).trim() !== ''
              ? String(normalized.mobile_mom_change).trim()
              : '0%',
          paid_traffic_share: Number(normalized.paid_traffic_share),
          paid_traffic_yoy_change: isNaN(toNumber(normalized.paid_traffic_yoy_change))
            ? 0
            : toNumber(normalized.paid_traffic_yoy_change),
          paid_traffic_mom_change:
            normalized.paid_traffic_mom_change !== undefined &&
            String(normalized.paid_traffic_mom_change).trim() !== ''
              ? String(normalized.paid_traffic_mom_change).trim()
              : '0%',
          traffic_share_by_channel:
            normalized.traffic_share_by_channel &&
            String(normalized.traffic_share_by_channel).trim() !== ''
              ? JSON.parse(String(normalized.traffic_share_by_channel))
              : {},
          bounce_rate_by_channel:
            normalized.bounce_rate_by_channel &&
            String(normalized.bounce_rate_by_channel).trim() !== ''
              ? JSON.parse(String(normalized.bounce_rate_by_channel))
              : {},
          channel_yoy_changes:
            normalized.channel_yoy_changes && String(normalized.channel_yoy_changes).trim() !== ''
              ? JSON.parse(String(normalized.channel_yoy_changes))
              : {},
          device_distribution:
            normalized.device_distribution && String(normalized.device_distribution).trim() !== ''
              ? JSON.parse(String(normalized.device_distribution))
              : {},
          percentile_rank: parseInt(String(normalized.percentile_rank)),
          project_count: parseInt(String(normalized.project_count)),
          id: normalized.id ? parseInt(String(normalized.id as string)) : 0,
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
