import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Configuration des composants par page
const PAGE_COMPONENTS = {
  '/traffic': [
    { label: 'Data Overview Traffic', value: 'DataOverviewTraffic' },
    { label: 'Traffic Overview', value: 'TrafficOverview' },
    { label: 'Traffic Splits', value: 'TrafficShareByTypes' },
    { label: 'Traffic Change by Type', value: 'TrafficChangeByType' },
    { label: 'Traffic Share by Acquisition Channel', value: 'TrafficTopAcquisitionChannels' },
    { label: 'Paid vs Unpaid Traffic', value: 'TrafficShareByAcquisitionMoM' },
  ],
  '/engagement': [
    { label: 'Data Overview Engagement', value: 'DataOverviewEngagement' },
    { label: 'Engagement Overview', value: 'EngagementOverview' },
    { label: 'Engagement Benchmark', value: 'EngagementBenchmark' },
    { label: 'Time Spent per Session', value: 'EngagementTimeSpent' },
    { label: 'Scroll Rate Benchmark', value: 'EngagementScrollRate' },
    { label: 'Activity Rate Benchmark', value: 'EngagementActivityRate' },
    { label: 'Page Level Benchmark', value: 'EngagementPageLevel' },
  ],
  '/frustration': [
    { label: 'Data Overview Frustration', value: 'DataOverviewFrustration' },
    { label: 'Frustration Change Over Time', value: 'FrustrationChangeOverTime' },
    { label: 'Frustration Metrics Benchmarks', value: 'FrustrationMetricsBenchmarks' },
    { label: 'Core Web Vitals', value: 'FrustrationCoreWebVitals' },
  ],
  '/conversion': [
    { label: 'Data Overview Conversion', value: 'DataOverviewConversion' },
    { label: 'Conversion Overview', value: 'ConversionOverview' },
    { label: 'E-Commerce Conversion Metrics', value: 'ConversionEcommerceMetrics' },
    { label: 'E-commerce Change by Acquisition', value: 'ConversionPaidUnpaid' },
    {
      label: 'E-commerce Conversion Rate by Acquisition Channel',
      value: 'ConversionByAcquisition',
    },
    { label: 'E-commerce Conversion Metrics Variant', value: 'ConversionMetricsVariant' },
  ],
}

export function usePageComponents() {
  const route = useRoute()

  const currentPageComponents = computed(() => {
    const currentPath = route.path
    const components = PAGE_COMPONENTS[currentPath as keyof typeof PAGE_COMPONENTS]

    if (!components) {
      console.warn(`No components defined for path: ${currentPath}`)
      return []
    }

    console.log(`📋 Components found for ${currentPath}:`, components)
    return components
  })

  const currentPageTitle = computed(() => {
    const path = route.path
    switch (path) {
      case '/traffic':
        return 'Traffic Analytics'
      case '/engagement':
        return 'Engagement Analytics'
      case '/frustration':
        return 'Frustration Analytics'
      case '/conversion':
        return 'Conversion Analytics'
      default:
        return 'Analytics Dashboard'
    }
  })

  const currentPageTheme = computed(() => {
    const path = route.path
    switch (path) {
      case '/traffic':
        return 'traffic'
      case '/engagement':
        return 'engagement'
      case '/frustration':
        return 'frustration'
      case '/conversion':
        return 'conversion'
      default:
        return 'traffic'
    }
  })

  return {
    currentPageComponents,
    currentPageTitle,
    currentPageTheme,
  }
}
