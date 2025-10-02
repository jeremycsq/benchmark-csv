export interface MetricConfig {
  value: string
  label: string
  description: string
  isRounded?: boolean
}

export interface PageMetrics {
  title: string
  titleColor: string
  yoyMetrics: MetricConfig[]
  momMetrics: MetricConfig[]
}

export const pageConfigs: Record<string, PageMetrics> = {
  traffic: {
    title: 'How is your traffic looking this year?',
    titleColor: '#8D0A38',
    yoyMetrics: [
      {
        value: '-10,5%',
        label: 'Traffic change',
        description: 'The change in the number of visits to the website.',
      },
      {
        value: '-16,5%',
        label: 'Mobile traffic',
        description: 'Shifts in mobile engagement metrics.',
        isRounded: true,
      },
      {
        value: '+13,5%',
        label: 'New visitor',
        description: 'Users who are accessing the site for the first time.',
      },
      {
        value: '+18,5%',
        label: 'Paid traffic',
        description: 'Users who arrived via paid marketing campaigns.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+0,5%',
        label: 'Traffic change',
        description: 'The change in the number of visits to the website.',
      },
      {
        value: '+47,5%',
        label: 'Mobile traffic',
        description: 'Shifts in mobile engagement metrics.',
        isRounded: true,
      },
      {
        value: '+23%',
        label: 'New visitor',
        description: 'Users who are accessing the site for the first time.',
      },
      {
        value: '+11%',
        label: 'Paid traffic',
        description: 'Users who arrived via paid marketing campaigns.',
        isRounded: true,
      },
    ],
  },
  engagement: {
    title: 'How have trends changed since last year?',
    titleColor: '#2E614F',
    yoyMetrics: [
      {
        value: '-10,5%',
        label: 'Pageviews per session',
        description: 'The number of pages viewed per session.',
      },
      {
        value: '+13.5%',
        label: 'New visitor pageviews',
        description: 'The number of pages viewed by new visitors.',
        isRounded: true,
      },
      {
        value: '-8.2%',
        label: 'Time on site',
        description: 'The average time spent on the site per session.',
      },
      {
        value: '+18,5%',
        label: 'Scroll rate',
        description: 'The percentage of visitors who scroll the page.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+1.5%',
        label: 'Pageviews per session',
        description: 'The number of pages viewed per session.',
      },
      {
        value: '+23.5%',
        label: 'New visitor pageviews',
        description: 'The number of pages viewed by new visitors.',
        isRounded: true,
      },
      {
        value: '+4.2%',
        label: 'Time per session',
        description: 'The average time spent on the site per session.',
      },
      {
        value: '+11%',
        label: 'Scroll rate',
        description: 'The percentage of visitors who scroll the page.',
        isRounded: true,
      },
    ],
  },
  frustration: {
    title: 'How is your frustration score looking this month?',
    titleColor: '#3737A2',
    yoyMetrics: [
      {
        value: '48',
        label: 'Frustration score',
        description: 'Indicator of negative user experience based on behavior.',
      },
      {
        value: '01min25',
        label: 'Load time frustration',
        description: 'Frustration triggered by delays in page loading',
        isRounded: true,
      },
      {
        value: '+3,5%',
        label: 'Js error rate',
        description: 'Rate of errors caused by JavaScript on the site.',
      },
      {
        value: '+10,5%',
        label: 'Bounce rate',
        description: 'How often users exit the site without interacting.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '39',
        label: 'Frustration score',
        description: 'Indicator of negative user experience based on behavior.',
      },
      {
        value: '01min18',
        label: 'Load time frustration',
        description: 'Frustration triggered by delays in page loading',
        isRounded: true,
      },
      {
        value: '-9,5%',
        label: 'JS error rate',
        description: 'Rate of errors caused by JavaScript on the site.',
      },
      {
        value: '-8,5%',
        label: 'Bounce rate',
        description: 'How often users exit the site without interacting.',
        isRounded: true,
      },
    ],
  },
  conversion: {
    title: 'How is your conversion rate looking this month?',
    titleColor: '#41474D',
    yoyMetrics: [
      {
        value: '+12.5%',
        label: 'Conversion rate',
        description: 'Percentage of visitors who complete a desired action.',
      },
      {
        value: '+8.2%',
        label: 'Lead generation',
        description: 'Number of qualified leads generated.',
        isRounded: true,
      },
      {
        value: '+15.3%',
        label: 'Revenue growth',
        description: 'Increase in revenue from conversions.',
      },
      {
        value: '+6.8%',
        label: 'Checkout completion',
        description: 'Percentage of users who complete checkout.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+2.1%',
        label: 'Conversion rate',
        description: 'Percentage of visitors who complete a desired action.',
      },
      {
        value: '+3.5%',
        label: 'Lead generation',
        description: 'Number of qualified leads generated.',
        isRounded: true,
      },
      {
        value: '+4.2%',
        label: 'Revenue growth',
        description: 'Increase in revenue from conversions.',
      },
      {
        value: '+1.8%',
        label: 'Checkout completion',
        description: 'Percentage of users who complete checkout.',
        isRounded: true,
      },
    ],
  },
}
