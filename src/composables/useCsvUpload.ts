import { ref, computed } from 'vue'
import Papa from 'papaparse'
import { useSupabaseData, type TrafficData } from './useSupabaseData'
import { supabase } from '../lib/supabase'

type GenericData = Record<string, unknown>

export interface CsvUploadResult {
  success: boolean
  message: string
  inserted: number
  errors: string[]
}

export function useCsvUpload(tableName: string = 'traffic') {
  console.log(`🎲 useCsvUpload initialisé avec tableName: "${tableName}"`)
  const uploading = ref(false)
  const progress = ref(0)
  const { insertData } = useSupabaseData()

  // Forcer la revalidation si le tableName change
  const dynamicTableName = ref(tableName)

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

  // Valider et transformer les données CSV selon la table
  const validateAndTransformData = (
    csvData: Record<string, unknown>[],
  ): { valid: GenericData[]; errors: string[] } => {
    const currentTableName = dynamicTableName.value
    console.log(`🎯 Validation appelée avec tableName="${currentTableName}"`)
    if (currentTableName === 'frustration') {
      console.log('✅ Utilisant validateAndTransformFrustrationData')
      return validateAndTransformFrustrationData(csvData)
    } else {
      console.log('⚠️ Fallback sur validateAndTransformTrafficData')
      return validateAndTransformTrafficData(csvData)
    }
  }

  // Validation spécifique pour la table traffic (logique existante)
  const validateAndTransformTrafficData = (
    csvData: Record<string, unknown>[],
  ): { valid: GenericData[]; errors: string[] } => {
    const valid: GenericData[] = []
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

        // Validation des champs requis (strict minimum) - SEULEMENT pour traffic
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

        valid.push(transformedData)
      } catch (error) {
        errors.push(`Ligne ${index + 2}: Erreur de transformation - ${error}`)
      }
    })

    return { valid, errors }
  }

  // Validation spécifique pour la table frustration
  const validateAndTransformFrustrationData = (
    csvData: Record<string, unknown>[],
  ): { valid: GenericData[]; errors: string[] } => {
    console.log('😤 validateAndTransformFrustrationData appelée')
    const valid: GenericData[] = []
    const errors: string[] = []

    csvData.forEach((row, index) => {
      try {
        // Debug: afficher les premières lignes brutes pour identifier le problème
        if (index < 2) {
          console.log(`🔍 LIGNE BRUTE ${index + 2}:`, {
            bounce_rate: row.bounce_rate,
            js_error_rate: row.js_error_rate,
            load_time_frustration_rate: row.load_time_frustration_rate,
            frustration_score: row.frustration_score,
          })
        }

        // Validation minimale pour frustration - seulement les champs obligatoires
        const requiredFields = ['id', 'analysis_month', 'country', 'industry', 'device']
        const missingFields = requiredFields.filter((field) => {
          const value = row[field]
          return value === undefined || value === null || String(value).trim() === ''
        })

        if (missingFields.length > 0) {
          errors.push(`Ligne ${index + 2}: Champs manquants: ${missingFields.join(', ')}`)
          return
        }

        console.log(`✅ Ligne ${index + 2} validée pour frustration`)

        // Préparer les données pour insertion (conversion des types)
        const transformedData: GenericData = { ...row }

        // Convertir les champs JSONB si présents
        const jsonFields = [
          'frustration_score_percentiles',
          'load_time_frustration_percentiles',
          'js_error_rate_percentiles',
          'bounce_rate_percentiles',
        ]

        jsonFields.forEach((field) => {
          if (transformedData[field] && typeof transformedData[field] === 'string') {
            try {
              transformedData[field] = JSON.parse(transformedData[field] as string)
            } catch {
              console.warn(`Invalid JSON in ${field}:`, transformedData[field])
            }
          }
        })

        // Corriger les valeurs DECIMAL qui peuvent overflow - TOUS les champs décimaux
        const decimalFields = [
          'frustration_score',
          'load_time_frustration_rate',
          'js_error_rate',
          'bounce_rate',
          'avg_lcp',
          'avg_cls',
          'avg_inp',
          'percentile_rank',
          // Ajouter TOUS les autres champs décimaux pour être sûr
          'frustration_score_yoy_change',
          'load_time_frustration_yoy_change',
          'js_error_rate_yoy_change',
          'bounce_rate_yoy_change',
          'lcp_yoy_change',
          'cls_yoy_change',
          'inp_yoy_change',
          'frustration_score_mom_change',
          'load_time_frustration_mom_change',
          'js_error_rate_mom_change',
          'bounce_rate_mom_change',
          'lcp_mom_change',
          'cls_mom_change',
          'inp_mom_change',
          'frustration_score_p25',
          'load_time_frustration_p25',
          'js_error_rate_p25',
          'bounce_rate_p25',
          'lcp_p25',
          'cls_p25',
          'inp_p25',
          'frustration_score_p75',
          'load_time_frustration_p75',
          'js_error_rate_p75',
          'bounce_rate_p75',
          'lcp_p75',
          'cls_p75',
          'inp_p75',
          // Toutes les variations percentiles aussi
          ...Object.keys(transformedData).filter(
            (key) => key.includes('_p25_') || key.includes('_p75_'),
          ),
        ]

        decimalFields.forEach((field) => {
          if (transformedData[field] !== null && transformedData[field] !== undefined) {
            const value = parseFloat(String(transformedData[field]))
            if (!isNaN(value)) {
              // Limiter les valeurs décimales selon le type de champ
              if (['load_time_frustration_rate', 'js_error_rate', 'bounce_rate'].includes(field)) {
                // Champs DECIMAL(5,4) - peuvent aller jusqu'à 9.9999
                if (value > 1 && value <= 100) {
                  transformedData[field] = Math.min(value / 100, 0.9999) // Convertir en ratio et limiter
                } else if (value > 100) {
                  transformedData[field] = 0.9999 // Limiter à 99.99%
                } else {
                  transformedData[field] = Math.min(value, 0.9999)
                }
              } else if (field === 'avg_lcp') {
                // DECIMAL(6,3) - peut aller jusqu'à 999.999
                transformedData[field] = Math.min(value, 99.999)
              } else if (field === 'avg_cls') {
                // DECIMAL(6,6) - valeurs très petites
                transformedData[field] = Math.min(value, 0.999999)
              } else if (field === 'avg_inp') {
                // DECIMAL(6,3) - peut aller jusqu'à 999.999
                transformedData[field] = Math.min(value, 99.999)
              } else if (field === 'frustration_score') {
                // DECIMAL(5,2) - peut aller jusqu'à 999.99
                transformedData[field] = Math.min(value, 99.99)
              } else if (field === 'percentile_rank') {
                // Pour percentile_rank, convertir en entier
                transformedData[field] = Math.round(Math.min(value, 100))
              } else {
                // Règle catch-all pour tous les autres champs numériques
                // S'assurer qu'ils ne dépassent pas 9.9999 (limite DECIMAL(5,4))
                if (Math.abs(value) > 9.9999) {
                  transformedData[field] = value > 0 ? 9.9999 : -9.9999
                }
              }

              // Log pour debug les premières lignes - TOUS les champs problématiques
              if (index < 2) {
                console.log(`🔧 ${field}: ${String(row[field])} → ${transformedData[field]}`)
              }
            }
          }
        })

        // Vérification finale des limites DECIMAL avant insertion
        const problematicFields: string[] = []
        Object.entries(transformedData).forEach(([key, value]) => {
          if (typeof value === 'number') {
            // Vérifier les limites DECIMAL
            if (
              ['load_time_frustration_rate', 'js_error_rate', 'bounce_rate'].includes(key) &&
              value > 0.9999
            ) {
              problematicFields.push(`${key}=${value} > 0.9999`)
            }
            if (['frustration_score'].includes(key) && value > 99.99) {
              problematicFields.push(`${key}=${value} > 99.99`)
            }
            if (['avg_lcp', 'avg_inp'].includes(key) && value > 99.999) {
              problematicFields.push(`${key}=${value} > 99.999`)
            }
            if (['avg_cls'].includes(key) && value > 0.999999) {
              problematicFields.push(`${key}=${value} > 0.999999`)
            }
          }
        })

        if (problematicFields.length > 0) {
          console.error(`❌ Ligne ${index + 2} a encore des problèmes:`, problematicFields)
        }

        if (index < 3) {
          console.log(`🔍 Ligne ${index + 2} transformée:`, {
            frustration_score: transformedData.frustration_score,
            bounce_rate: transformedData.bounce_rate,
            avg_lcp: transformedData.avg_lcp,
          })
        }

        valid.push(transformedData)
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
    const currentTableName = dynamicTableName.value
    const { data: existingData } = await supabase
      .from(currentTableName)
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
      console.log(`🚀 Début upload CSV pour table "${tableName}"`)
      uploading.value = true
      progress.value = 0

      // Étape 1: Parsing le CSV
      progress.value = 20
      console.log('📄 Parsing CSV...')
      const csvData = await parseCsvFile(file)
      console.log(`📊 CSV parsé: ${csvData.length} lignes`)

      // Étape 2: Résoudre les conflits d'ID
      progress.value = 40
      console.log('🔍 Résolution conflits ID...')
      const resolvedData = await resolveIdConflicts(csvData)
      console.log(`✅ Conflits résolus: ${resolvedData.length} lignes`)

      // Étape 3: Valider et transformer
      progress.value = 60
      console.log('✓ Validation et transformation...')
      const { valid, errors } = validateAndTransformData(resolvedData)

      console.log(
        `🔍 Validation pour table "${tableName}": ${valid.length} valides, ${errors.length} erreurs`,
      )

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

      console.log(`💾 Insertion en base: ${valid.length} enregistrements`)

      const currentTableName = dynamicTableName.value
      if (currentTableName === 'frustration') {
        // Insertion directe pour frustration
        console.log('🎯 Mode frustration: insertion directe')
        for (let i = 0; i < valid.length; i += batchSize) {
          const batch = valid.slice(i, i + batchSize)
          console.log(`📦 Lot ${Math.floor(i / batchSize) + 1}: ${batch.length} items`)
          const { error } = await supabase.from(currentTableName).insert(batch)
          if (error) {
            console.error('❌ Erreur insertion batch:', error)
            throw error
          }
          totalInserted += batch.length
          progress.value = 75 + (i / valid.length) * 25
        }
      } else {
        // Insertion via insertData pour traffic
        for (let i = 0; i < valid.length; i += batchSize) {
          const batch = valid.slice(i, i + batchSize)
          await insertData(batch as unknown as TrafficData[])
          totalInserted += batch.length
          progress.value = 75 + (i / valid.length) * 25
        }
      }

      progress.value = 100

      return {
        success: true,
        message: `${totalInserted} enregistrement(s) inséré(s) avec succès`,
        inserted: totalInserted,
        errors: [],
      }
    } catch (error) {
      console.error('🚨 Erreur détaillée upload:', error)
      console.error('🚨 Stack trace:', error instanceof Error ? error.stack : 'No stack')
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
          id: 1,
          analysis_month: '2024-05',
          country: 'Global',
          industry: 'all_industry',
          device: 'all_device',
          frustration_score: 39.45,
          load_time_frustration_rate: 14.91,
          js_error_rate: 18.06,
          bounce_rate: 51.82,
          avg_lcp: 2.29,
          avg_cls: 0.14,
          avg_inp: 1.63,
          frustrating_score_yoy_change: 0.9,
          load_time_frustration_yoy_change: -10.21,
          js_error_rate_yoy_change: 15.74,
          bounce_rate_yoy_change: 3.79,
          lcp_yoy_change: -8.52,
          cls_yoy_change: -9.58,
          inp_yoy_change: 288.87,
          percentile_rank: 50,
          project_count: 1331,
          calculation_timestamp: '2024-06-22T17:11:09.556Z',
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

    const template = [getTemplateForTable(dynamicTableName.value)]

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

  const updateTableName = (newTableName: string) => {
    console.log(`🔄 updateTableName: "${dynamicTableName.value}" → "${newTableName}"`)
    dynamicTableName.value = newTableName
  }

  return {
    uploading: computed(() => uploading.value),
    progress: computed(() => progress.value),
    uploadCsvFile,
    downloadTemplate,
    updateTableName,
  }
}
