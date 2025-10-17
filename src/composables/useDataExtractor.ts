import { useSupabaseData } from './useSupabaseData'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

export interface ComponentData {
  componentName: string
  data: Record<string, unknown>[]
  columns: string[]
  metadata: {
    pageType: string
    timestamp: string
    filters: {
      country?: string
      industry?: string
      month?: string
      device?: string
    }
  }
}

export function useDataExtractor() {
  const { getFilteredData } = useSupabaseData()
  const globalFilters = useGlobalFiltersStore()

  // Utiliser la même logique que les composants pour récupérer les données filtrées
  const getComponentFilteredData = (pageType: string) => {
    // Construire les filtres comme dans useTrafficMetrics
    const filters: {
      country?: string
      industry?: string
      device?: string
      analysis_month?: string
    } = {}

    // Ajouter seulement les filtres actifs (pas "All")
    if (globalFilters.selectedCountry !== 'All countries') {
      filters.country = globalFilters.selectedCountry
    }
    if (globalFilters.selectedIndustry !== 'All industries') {
      filters.industry = globalFilters.selectedIndustry
    }
    if (globalFilters.selectedDevice !== 'All devices') {
      // Mapper le label UI vers la valeur DB (codes)
      const mapDevice = (label: string): string => {
        const l = label.toLowerCase()
        if (l === 'desktop') return '1'
        if (l === 'mobile') return '2'
        return label
      }
      filters.device = mapDevice(globalFilters.selectedDevice)
    } else {
      // All Devices sélectionné → cibler explicitement les lignes 'all_devices'
      filters.device = 'all_devices'
    }
    if (globalFilters.selectedMonth !== 'All months') {
      filters.analysis_month = globalFilters.selectedMonth
    }

    console.log(`🔍 useDataExtractor - Filtres globaux pour ${pageType}:`, {
      selectedCountry: globalFilters.selectedCountry,
      selectedIndustry: globalFilters.selectedIndustry,
      selectedDevice: globalFilters.selectedDevice,
      selectedMonth: globalFilters.selectedMonth,
    })
    console.log(`🔍 useDataExtractor - Filtres actifs appliqués:`, filters)

    let filtered = getFilteredData(filters)
    console.log(`🔍 useDataExtractor - Données filtrées:`, filtered.value.length, 'éléments')

    // Fallback: si "All Devices" (all_devices) ne retourne rien pour une industrie/pays donnée,
    // on enlève le filtre device pour garder des données.
    if (
      filters.device === 'all_devices' &&
      (filtered.value === undefined || filtered.value.length === 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { device, ...rest } = filters
      console.log(
        `🔍 useDataExtractor - Fallback all_devices → suppression du filtre device (0 résultat avec all_devices)`,
      )
      filtered = getFilteredData(rest)
    }

    return filtered.value
  }

  const extractComponentData = (componentName: string, pageType: string): ComponentData => {
    const timestamp = new Date().toISOString()

    // Utiliser la même logique que les composants pour récupérer les données filtrées
    const dataArray = getComponentFilteredData(pageType)

    console.log(`🔍 useDataExtractor - Final data array length:`, dataArray.length)
    if (dataArray.length > 0) {
      console.log(`🔍 useDataExtractor - First item:`, dataArray[0])
      console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(dataArray[0]))
    }

    // Déterminer les colonnes et données selon le composant
    const { data, columns } = getComponentSpecificData(componentName, dataArray)

    return {
      componentName,
      data,
      columns,
      metadata: {
        pageType,
        timestamp,
        filters: {
          country: globalFilters.selectedCountry,
          industry: globalFilters.selectedIndustry,
          month: globalFilters.selectedMonth,
          device: globalFilters.selectedDevice,
        },
      },
    }
  }

  const getComponentSpecificData = (componentName: string, data: Record<string, unknown>[]) => {
    // Vérifier que data est bien un tableau
    if (!Array.isArray(data)) {
      console.warn(`⚠️ useDataExtractor - Data is not an array for ${componentName}:`, data)
      return {
        data: [],
        columns: ['error', 'message'],
      }
    }

    console.log(`🔍 useDataExtractor - Processing ${componentName} with ${data.length} items`)
    if (data.length > 0) {
      console.log(`🔍 useDataExtractor - First data item for ${componentName}:`, data[0])
    }

    // Fonction pour adapter les colonnes aux données réelles
    const adaptColumnsToData = (
      preferredColumns: string[],
      actualData: Record<string, unknown>[],
    ) => {
      if (actualData.length === 0) return preferredColumns

      const availableColumns = Object.keys(actualData[0])
      const adaptedColumns = preferredColumns.filter((col) => availableColumns.includes(col))

      // Ajouter des colonnes supplémentaires si on n'a pas assez de colonnes
      const missingColumns = availableColumns.filter((col) => !preferredColumns.includes(col))
      const finalColumns = [
        ...adaptedColumns,
        ...missingColumns.slice(0, 10 - adaptedColumns.length),
      ]

      console.log(`🔍 useDataExtractor - Adapted columns for ${componentName}:`, finalColumns)
      console.log(`🔍 useDataExtractor - Available columns:`, availableColumns)
      console.log(`🔍 useDataExtractor - Preferred columns:`, preferredColumns)

      return finalColumns
    }

    switch (componentName) {
      // COMPOSANTS TRAFFIC
      case 'DataOverviewTraffic':
        const dataOverviewColumns = [
          'country',
          'industry',
          'analysis_month',
          'device',
          'traffic',
          'yoy_change',
          'mom_change',
        ]
        return {
          data: data, // Toutes les lignes au lieu de data.slice(0, 10)
          columns: adaptColumnsToData(dataOverviewColumns, data),
        }

      case 'TrafficOverview':
        console.log(
          `🔍 useDataExtractor - Processing TrafficOverview. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for TrafficOverview:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const trafficOverviewColumns = [
          'device',
          'traffic',
          'mobile_share',
          'desktop_share',
          'yoy_change',
          'mom_change',
        ]
        const filteredTrafficData = data.filter(
          (item) => item.device && item.device !== 'all_devices',
        )
        console.log(
          `🔍 useDataExtractor - Filtered traffic data length: ${filteredTrafficData.length}`,
        )

        // Si pas de données avec device spécifique, utiliser toutes les données
        const finalTrafficData = filteredTrafficData.length > 0 ? filteredTrafficData : data
        console.log(`🔍 useDataExtractor - Final traffic data length: ${finalTrafficData.length}`)

        return {
          data: finalTrafficData,
          columns: adaptColumnsToData(trafficOverviewColumns, finalTrafficData),
        }

      case 'TrafficShareByTypes':
        console.log(
          `🔍 useDataExtractor - Processing TrafficShareByTypes. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for TrafficShareByTypes:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const trafficShareColumns = [
          'traffic_type',
          'traffic',
          'share_percentage',
          'yoy_change',
          'mom_change',
        ]
        const filteredShareData = data.filter((item) => item.traffic_type)
        console.log(`🔍 useDataExtractor - Filtered share data length: ${filteredShareData.length}`)

        // Si pas de données avec traffic_type, utiliser toutes les données
        const finalShareData = filteredShareData.length > 0 ? filteredShareData : data
        console.log(`🔍 useDataExtractor - Final share data length: ${finalShareData.length}`)

        return {
          data: finalShareData,
          columns: adaptColumnsToData(trafficShareColumns, finalShareData),
        }

      case 'TrafficChangeByType':
        console.log(
          `🔍 useDataExtractor - Processing TrafficChangeByType. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for TrafficChangeByType:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const changeColumns = [
          'traffic_type',
          'yoy_change',
          'mom_change',
          'previous_period',
          'current_period',
        ]
        const filteredChangeData = data.filter((item) => item.traffic_type)
        console.log(
          `🔍 useDataExtractor - Filtered change data length: ${filteredChangeData.length}`,
        )

        // Si pas de données avec traffic_type, utiliser toutes les données
        const finalChangeData = filteredChangeData.length > 0 ? filteredChangeData : data
        console.log(`🔍 useDataExtractor - Final change data length: ${finalChangeData.length}`)

        return {
          data: finalChangeData,
          columns: adaptColumnsToData(changeColumns, finalChangeData),
        }

      case 'TrafficTopAcquisitionChannels':
        console.log(
          `🔍 useDataExtractor - Processing TrafficTopAcquisitionChannels. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(
            `🔍 useDataExtractor - First item for TrafficTopAcquisitionChannels:`,
            data[0],
          )
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const acquisitionColumns = [
          'acquisition_channel',
          'traffic',
          'share_percentage',
          'yoy_change',
          'mom_change',
        ]
        const filteredAcquisitionData = data.filter((item) => item.acquisition_channel)
        console.log(
          `🔍 useDataExtractor - Filtered acquisition data length: ${filteredAcquisitionData.length}`,
        )

        // Si pas de données avec acquisition_channel, utiliser toutes les données
        const finalAcquisitionData =
          filteredAcquisitionData.length > 0 ? filteredAcquisitionData : data
        console.log(
          `🔍 useDataExtractor - Final acquisition data length: ${finalAcquisitionData.length}`,
        )

        return {
          data: finalAcquisitionData,
          columns: adaptColumnsToData(acquisitionColumns, finalAcquisitionData),
        }

      case 'TrafficShareByAcquisitionMoM':
        console.log(
          `🔍 useDataExtractor - Processing TrafficShareByAcquisitionMoM. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for TrafficShareByAcquisitionMoM:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const acquisitionMoMColumns = [
          'acquisition_type',
          'paid_traffic',
          'unpaid_traffic',
          'paid_share',
          'unpaid_share',
        ]
        const filteredAcquisitionMoMData = data.filter((item) => item.acquisition_type)
        console.log(
          `🔍 useDataExtractor - Filtered acquisition MoM data length: ${filteredAcquisitionMoMData.length}`,
        )

        // Si pas de données avec acquisition_type, utiliser toutes les données
        const finalAcquisitionMoMData =
          filteredAcquisitionMoMData.length > 0 ? filteredAcquisitionMoMData : data
        console.log(
          `🔍 useDataExtractor - Final acquisition MoM data length: ${finalAcquisitionMoMData.length}`,
        )

        return {
          data: finalAcquisitionMoMData,
          columns: adaptColumnsToData(acquisitionMoMColumns, finalAcquisitionMoMData),
        }

      // COMPOSANTS ENGAGEMENT
      case 'DataOverviewEngagement':
        return {
          data: data, // Toutes les lignes
          columns: [
            'country',
            'industry',
            'analysis_month',
            'engagement_score',
            'session_duration',
            'pages_per_session',
          ],
        }

      case 'EngagementOverview':
        console.log(
          `🔍 useDataExtractor - Processing EngagementOverview. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementOverview:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementOverviewColumns = [
          'engagement_metric',
          'value',
          'benchmark',
          'percentile',
          'yoy_change',
        ]
        const filteredEngagementOverviewData = data.filter((item) => item.engagement_metric)
        console.log(
          `🔍 useDataExtractor - Filtered engagement overview data length: ${filteredEngagementOverviewData.length}`,
        )

        // Si pas de données avec engagement_metric, utiliser toutes les données
        const finalEngagementOverviewData =
          filteredEngagementOverviewData.length > 0 ? filteredEngagementOverviewData : data
        console.log(
          `🔍 useDataExtractor - Final engagement overview data length: ${finalEngagementOverviewData.length}`,
        )

        return {
          data: finalEngagementOverviewData,
          columns: adaptColumnsToData(engagementOverviewColumns, finalEngagementOverviewData),
        }

      case 'EngagementBenchmark':
        console.log(
          `🔍 useDataExtractor - Processing EngagementBenchmark. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementBenchmark:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementBenchmarkColumns = [
          'benchmark_category',
          'your_value',
          'industry_avg',
          'top_percentile',
          'performance_score',
        ]
        const filteredEngagementBenchmarkData = data.filter((item) => item.benchmark_category)
        console.log(
          `🔍 useDataExtractor - Filtered engagement benchmark data length: ${filteredEngagementBenchmarkData.length}`,
        )

        // Si pas de données avec benchmark_category, utiliser toutes les données
        const finalEngagementBenchmarkData =
          filteredEngagementBenchmarkData.length > 0 ? filteredEngagementBenchmarkData : data
        console.log(
          `🔍 useDataExtractor - Final engagement benchmark data length: ${finalEngagementBenchmarkData.length}`,
        )

        return {
          data: finalEngagementBenchmarkData,
          columns: adaptColumnsToData(engagementBenchmarkColumns, finalEngagementBenchmarkData),
        }

      case 'EngagementTimeSpent':
        console.log(
          `🔍 useDataExtractor - Processing EngagementTimeSpent. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementTimeSpent:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementTimeSpentColumns = [
          'time_spent',
          'session_count',
          'avg_duration',
          'yoy_change',
          'mom_change',
        ]
        const filteredEngagementTimeSpentData = data.filter((item) => item.time_spent)
        console.log(
          `🔍 useDataExtractor - Filtered engagement time spent data length: ${filteredEngagementTimeSpentData.length}`,
        )

        // Si pas de données avec time_spent, utiliser toutes les données
        const finalEngagementTimeSpentData =
          filteredEngagementTimeSpentData.length > 0 ? filteredEngagementTimeSpentData : data
        console.log(
          `🔍 useDataExtractor - Final engagement time spent data length: ${finalEngagementTimeSpentData.length}`,
        )

        return {
          data: finalEngagementTimeSpentData,
          columns: adaptColumnsToData(engagementTimeSpentColumns, finalEngagementTimeSpentData),
        }

      case 'EngagementScrollRate':
        console.log(
          `🔍 useDataExtractor - Processing EngagementScrollRate. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementScrollRate:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementScrollRateColumns = [
          'scroll_rate',
          'page_views',
          'scroll_depth',
          'yoy_change',
          'mom_change',
        ]
        const filteredEngagementScrollRateData = data.filter((item) => item.scroll_rate)
        console.log(
          `🔍 useDataExtractor - Filtered engagement scroll rate data length: ${filteredEngagementScrollRateData.length}`,
        )

        // Si pas de données avec scroll_rate, utiliser toutes les données
        const finalEngagementScrollRateData =
          filteredEngagementScrollRateData.length > 0 ? filteredEngagementScrollRateData : data
        console.log(
          `🔍 useDataExtractor - Final engagement scroll rate data length: ${finalEngagementScrollRateData.length}`,
        )

        return {
          data: finalEngagementScrollRateData,
          columns: adaptColumnsToData(engagementScrollRateColumns, finalEngagementScrollRateData),
        }

      case 'EngagementActivityRate':
        console.log(
          `🔍 useDataExtractor - Processing EngagementActivityRate. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementActivityRate:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementActivityRateColumns = [
          'activity_rate',
          'interactions',
          'engagement_score',
          'yoy_change',
          'mom_change',
        ]
        const filteredEngagementActivityRateData = data.filter((item) => item.activity_rate)
        console.log(
          `🔍 useDataExtractor - Filtered engagement activity rate data length: ${filteredEngagementActivityRateData.length}`,
        )

        // Si pas de données avec activity_rate, utiliser toutes les données
        const finalEngagementActivityRateData =
          filteredEngagementActivityRateData.length > 0 ? filteredEngagementActivityRateData : data
        console.log(
          `🔍 useDataExtractor - Final engagement activity rate data length: ${finalEngagementActivityRateData.length}`,
        )

        return {
          data: finalEngagementActivityRateData,
          columns: adaptColumnsToData(
            engagementActivityRateColumns,
            finalEngagementActivityRateData,
          ),
        }

      case 'EngagementPageLevel':
        console.log(
          `🔍 useDataExtractor - Processing EngagementPageLevel. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for EngagementPageLevel:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const engagementPageLevelColumns = [
          'page_type',
          'engagement_score',
          'bounce_rate',
          'time_on_page',
          'conversion_rate',
        ]
        const filteredEngagementPageLevelData = data.filter((item) => item.page_type)
        console.log(
          `🔍 useDataExtractor - Filtered engagement page level data length: ${filteredEngagementPageLevelData.length}`,
        )

        // Si pas de données avec page_type, utiliser toutes les données
        const finalEngagementPageLevelData =
          filteredEngagementPageLevelData.length > 0 ? filteredEngagementPageLevelData : data
        console.log(
          `🔍 useDataExtractor - Final engagement page level data length: ${finalEngagementPageLevelData.length}`,
        )

        return {
          data: finalEngagementPageLevelData,
          columns: adaptColumnsToData(engagementPageLevelColumns, finalEngagementPageLevelData),
        }

      // COMPOSANTS FRUSTRATION
      case 'DataOverviewFrustration':
        return {
          data: data, // Toutes les lignes
          columns: [
            'country',
            'industry',
            'analysis_month',
            'frustration_score',
            'load_time',
            'bounce_rate',
          ],
        }

      case 'FrustrationChangeOverTime':
        console.log(
          `🔍 useDataExtractor - Processing FrustrationChangeOverTime. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for FrustrationChangeOverTime:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const frustrationChangeOverTimeColumns = [
          'frustration_metric',
          'current_value',
          'previous_value',
          'change_percentage',
          'trend',
        ]
        const filteredFrustrationChangeOverTimeData = data.filter((item) => item.frustration_metric)
        console.log(
          `🔍 useDataExtractor - Filtered frustration change over time data length: ${filteredFrustrationChangeOverTimeData.length}`,
        )

        // Si pas de données avec frustration_metric, utiliser toutes les données
        const finalFrustrationChangeOverTimeData =
          filteredFrustrationChangeOverTimeData.length > 0
            ? filteredFrustrationChangeOverTimeData
            : data
        console.log(
          `🔍 useDataExtractor - Final frustration change over time data length: ${finalFrustrationChangeOverTimeData.length}`,
        )

        return {
          data: finalFrustrationChangeOverTimeData,
          columns: adaptColumnsToData(
            frustrationChangeOverTimeColumns,
            finalFrustrationChangeOverTimeData,
          ),
        }

      case 'FrustrationMetricsBenchmarks':
        console.log(
          `🔍 useDataExtractor - Processing FrustrationMetricsBenchmarks. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for FrustrationMetricsBenchmarks:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const frustrationMetricsBenchmarksColumns = [
          'benchmark_metric',
          'your_value',
          'industry_avg',
          'top_percentile',
          'performance_score',
        ]
        const filteredFrustrationMetricsBenchmarksData = data.filter(
          (item) => item.benchmark_metric,
        )
        console.log(
          `🔍 useDataExtractor - Filtered frustration metrics benchmarks data length: ${filteredFrustrationMetricsBenchmarksData.length}`,
        )

        // Si pas de données avec benchmark_metric, utiliser toutes les données
        const finalFrustrationMetricsBenchmarksData =
          filteredFrustrationMetricsBenchmarksData.length > 0
            ? filteredFrustrationMetricsBenchmarksData
            : data
        console.log(
          `🔍 useDataExtractor - Final frustration metrics benchmarks data length: ${finalFrustrationMetricsBenchmarksData.length}`,
        )

        return {
          data: finalFrustrationMetricsBenchmarksData,
          columns: adaptColumnsToData(
            frustrationMetricsBenchmarksColumns,
            finalFrustrationMetricsBenchmarksData,
          ),
        }

      case 'FrustrationCoreWebVitals':
        console.log(
          `🔍 useDataExtractor - Processing FrustrationCoreWebVitals. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for FrustrationCoreWebVitals:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const frustrationCoreWebVitalsColumns = [
          'core_web_vital',
          'lcp',
          'cls',
          'inp',
          'score',
          'status',
        ]
        const filteredFrustrationCoreWebVitalsData = data.filter((item) => item.core_web_vital)
        console.log(
          `🔍 useDataExtractor - Filtered frustration core web vitals data length: ${filteredFrustrationCoreWebVitalsData.length}`,
        )

        // Si pas de données avec core_web_vital, utiliser toutes les données
        const finalFrustrationCoreWebVitalsData =
          filteredFrustrationCoreWebVitalsData.length > 0
            ? filteredFrustrationCoreWebVitalsData
            : data
        console.log(
          `🔍 useDataExtractor - Final frustration core web vitals data length: ${finalFrustrationCoreWebVitalsData.length}`,
        )

        return {
          data: finalFrustrationCoreWebVitalsData,
          columns: adaptColumnsToData(
            frustrationCoreWebVitalsColumns,
            finalFrustrationCoreWebVitalsData,
          ),
        }

      // COMPOSANTS CONVERSION
      case 'DataOverviewConversion':
        return {
          data: data, // Toutes les lignes
          columns: [
            'country',
            'industry',
            'analysis_month',
            'conversion_rate',
            'revenue',
            'transactions',
          ],
        }

      case 'ConversionOverview':
        console.log(
          `🔍 useDataExtractor - Processing ConversionOverview. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for ConversionOverview:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const conversionOverviewColumns = [
          'conversion_metric',
          'value',
          'yoy_change',
          'mom_change',
          'trend',
        ]
        const filteredConversionOverviewData = data.filter((item) => item.conversion_metric)
        console.log(
          `🔍 useDataExtractor - Filtered conversion overview data length: ${filteredConversionOverviewData.length}`,
        )

        // Si pas de données avec conversion_metric, utiliser toutes les données
        const finalConversionOverviewData =
          filteredConversionOverviewData.length > 0 ? filteredConversionOverviewData : data
        console.log(
          `🔍 useDataExtractor - Final conversion overview data length: ${finalConversionOverviewData.length}`,
        )

        return {
          data: finalConversionOverviewData,
          columns: adaptColumnsToData(conversionOverviewColumns, finalConversionOverviewData),
        }

      case 'ConversionEcommerceMetrics':
        console.log(
          `🔍 useDataExtractor - Processing ConversionEcommerceMetrics. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for ConversionEcommerceMetrics:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const conversionEcommerceMetricsColumns = [
          'ecommerce_metric',
          'value',
          'revenue',
          'transactions',
          'avg_order_value',
        ]
        const filteredConversionEcommerceMetricsData = data.filter((item) => item.ecommerce_metric)
        console.log(
          `🔍 useDataExtractor - Filtered conversion ecommerce metrics data length: ${filteredConversionEcommerceMetricsData.length}`,
        )

        // Si pas de données avec ecommerce_metric, utiliser toutes les données
        const finalConversionEcommerceMetricsData =
          filteredConversionEcommerceMetricsData.length > 0
            ? filteredConversionEcommerceMetricsData
            : data
        console.log(
          `🔍 useDataExtractor - Final conversion ecommerce metrics data length: ${finalConversionEcommerceMetricsData.length}`,
        )

        return {
          data: finalConversionEcommerceMetricsData,
          columns: adaptColumnsToData(
            conversionEcommerceMetricsColumns,
            finalConversionEcommerceMetricsData,
          ),
        }

      case 'ConversionPaidUnpaid':
        console.log(
          `🔍 useDataExtractor - Processing ConversionPaidUnpaid. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for ConversionPaidUnpaid:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const conversionPaidUnpaidColumns = [
          'acquisition_type',
          'conversion_rate',
          'revenue',
          'transactions',
          'cost_per_acquisition',
        ]
        const filteredConversionPaidUnpaidData = data.filter((item) => item.acquisition_type)
        console.log(
          `🔍 useDataExtractor - Filtered conversion paid unpaid data length: ${filteredConversionPaidUnpaidData.length}`,
        )

        // Si pas de données avec acquisition_type, utiliser toutes les données
        const finalConversionPaidUnpaidData =
          filteredConversionPaidUnpaidData.length > 0 ? filteredConversionPaidUnpaidData : data
        console.log(
          `🔍 useDataExtractor - Final conversion paid unpaid data length: ${finalConversionPaidUnpaidData.length}`,
        )

        return {
          data: finalConversionPaidUnpaidData,
          columns: adaptColumnsToData(conversionPaidUnpaidColumns, finalConversionPaidUnpaidData),
        }

      case 'ConversionByAcquisition':
        console.log(
          `🔍 useDataExtractor - Processing ConversionByAcquisition. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for ConversionByAcquisition:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const conversionByAcquisitionColumns = [
          'acquisition_channel',
          'conversion_rate',
          'revenue',
          'transactions',
          'roi',
        ]
        const filteredConversionByAcquisitionData = data.filter((item) => item.acquisition_channel)
        console.log(
          `🔍 useDataExtractor - Filtered conversion by acquisition data length: ${filteredConversionByAcquisitionData.length}`,
        )

        // Si pas de données avec acquisition_channel, utiliser toutes les données
        const finalConversionByAcquisitionData =
          filteredConversionByAcquisitionData.length > 0
            ? filteredConversionByAcquisitionData
            : data
        console.log(
          `🔍 useDataExtractor - Final conversion by acquisition data length: ${finalConversionByAcquisitionData.length}`,
        )

        return {
          data: finalConversionByAcquisitionData,
          columns: adaptColumnsToData(
            conversionByAcquisitionColumns,
            finalConversionByAcquisitionData,
          ),
        }

      case 'ConversionMetricsVariant':
        console.log(
          `🔍 useDataExtractor - Processing ConversionMetricsVariant. Input data length: ${data.length}`,
        )
        if (data.length > 0) {
          console.log(`🔍 useDataExtractor - First item for ConversionMetricsVariant:`, data[0])
          console.log(`🔍 useDataExtractor - Available columns:`, Object.keys(data[0]))
        }
        const conversionMetricsVariantColumns = [
          'metric_variant',
          'value',
          'benchmark',
          'performance',
          'optimization_potential',
        ]
        const filteredConversionMetricsVariantData = data.filter((item) => item.metric_variant)
        console.log(
          `🔍 useDataExtractor - Filtered conversion metrics variant data length: ${filteredConversionMetricsVariantData.length}`,
        )

        // Si pas de données avec metric_variant, utiliser toutes les données
        const finalConversionMetricsVariantData =
          filteredConversionMetricsVariantData.length > 0
            ? filteredConversionMetricsVariantData
            : data
        console.log(
          `🔍 useDataExtractor - Final conversion metrics variant data length: ${finalConversionMetricsVariantData.length}`,
        )

        return {
          data: finalConversionMetricsVariantData,
          columns: adaptColumnsToData(
            conversionMetricsVariantColumns,
            finalConversionMetricsVariantData,
          ),
        }

      // Par défaut - utiliser toutes les colonnes disponibles
      default:
        const defaultColumns = data.length > 0 ? Object.keys(data[0]).slice(0, 10) : ['no_data']
        console.log(
          `🔍 useDataExtractor - Using default columns for ${componentName}:`,
          defaultColumns,
        )
        return {
          data: data, // Toutes les lignes au lieu de data.slice(0, 10)
          columns: defaultColumns,
        }
    }
  }

  const generateCSVContent = (componentData: ComponentData): string => {
    const { data, columns, metadata } = componentData

    // En-têtes avec métadonnées
    const headerRows = [
      [`# ${componentData.componentName} Data Export`],
      [`# Generated: ${metadata.timestamp}`],
      [`# Page: ${metadata.pageType}`],
      [
        `# Filters: Country=${metadata.filters.country || 'All'}, Industry=${metadata.filters.industry || 'All'}, Month=${metadata.filters.month || 'All'}, Device=${metadata.filters.device || 'All'}`,
      ],
      [''], // Ligne vide
    ]

    // En-têtes des colonnes
    const columnHeaders = [columns]

    // Données
    const dataRows = data.map((row) =>
      columns.map((col) => {
        const value = row[col]
        // Échapper les virgules et guillemets dans les valeurs CSV
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }),
    )

    // Combiner tout
    const allRows = [...headerRows, columnHeaders, ...dataRows]
    return allRows.map((row) => row.join(',')).join('\n')
  }

  return {
    extractComponentData,
    generateCSVContent,
  }
}
