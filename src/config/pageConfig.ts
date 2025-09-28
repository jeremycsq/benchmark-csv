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
        label: 'Traffic Change',
        description: 'The change in the number of visits to the website.',
      },
      {
        value: '-16,5%',
        label: 'Mobile Traffic',
        description: 'Shifts in mobile engagement metrics.',
        isRounded: true,
      },
      {
        value: '+13,5%',
        label: 'New Visitor',
        description: 'Users who are accessing the site for the first time.',
      },
      {
        value: '+18,5%',
        label: 'Paid Traffic',
        description: 'Users who arrived via paid marketing campaigns.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+0,5%',
        label: 'Traffic Change',
        description: 'The change in the number of visits to the website.',
      },
      {
        value: '+47,5%',
        label: 'Mobile Traffic',
        description: 'Shifts in mobile engagement metrics.',
        isRounded: true,
      },
      {
        value: '+23%',
        label: 'New Visitor',
        description: 'Users who are accessing the site for the first time.',
      },
      {
        value: '+11%',
        label: 'Paid Traffic',
        description: 'Users who arrived via paid marketing campaigns.',
        isRounded: true,
      },
    ],
  },
  engagement: {
    title: 'How is your engagement looking this month?',
    titleColor: '#A259D9',
    yoyMetrics: [
      {
        value: '-10,5%',
        label: 'PageViews Per Session',
        description: 'The number of pages viewed per session.',
      },
      {
        value: '+13.5%',
        label: 'New Visitor PageViews',
        description: 'The number of pages viewed by new visitors.',
        isRounded: true,
      },
      {
        value: '-8.2%',
        label: 'Time On Site',
        description: 'The average time spent on the site per session.',
      },
      {
        value: '+18,5%',
        label: 'Scroll Rate',
        description: 'The percentage of visitors who scroll the page.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+1.5%',
        label: 'PageViews Per Session',
        description: 'The number of pages viewed per session.',
      },
      {
        value: '+23.5%',
        label: 'New Visitor PageViews',
        description: 'The number of pages viewed by new visitors.',
        isRounded: true,
      },
      {
        value: '+4.2%',
        label: 'Time Per Session',
        description: 'The average time spent on the site per session.',
      },
      {
        value: '+11%',
        label: 'Scroll Rate',
        description: 'The percentage of visitors who scroll the page.',
        isRounded: true,
      },
    ],
  },
  frustration: {
    title: 'How is your frustration score looking this month?',
    titleColor: '#EB6909',
    yoyMetrics: [
      {
        value: '48',
        label: 'Frustration Score',
        description: 'Negative user experience indicator based on behavior.',
        isRounded: true,
      },
      {
        value: '01min25',
        label: 'Load Time Frustration',
        description: 'Frustration triggered by page load delays.',
      },
      {
        value: '+3,5%',
        label: 'JS error rate',
        description: 'Rate of errors caused by JavaScript on the site.',
        isRounded: true,
      },
      {
        value: '+10,5%',
        label: 'Bounce Rate',
        description: 'Frequency at which users leave the site without interacting.',
      },
    ],
    momMetrics: [
      {
        value: '39',
        label: 'Frustration Score',
        description: 'Negative user experience indicator based on behavior.',
        isRounded: true,
      },
      {
        value: '01min18',
        label: 'Load Time Frustration',
        description: 'Frustration triggered by page load delays.',
      },
      {
        value: '-9,5%',
        label: 'JS error rate',
        description: 'Rate of errors caused by JavaScript on the site.',
        isRounded: true,
      },
      {
        value: '-8,5%',
        label: 'Bounce Rate',
        description: 'Frequency at which users leave the site without interacting.',
      },
    ],
  },
  conversion: {
    title: 'How is your conversion rate looking this month?',
    titleColor: '#119DBC',
    yoyMetrics: [
      {
        value: '+12.5%',
        label: 'Conversion Rate',
        description: 'Percentage of visitors who complete a desired action.',
      },
      {
        value: '+8.2%',
        label: 'Lead Generation',
        description: 'Number of qualified leads generated.',
        isRounded: true,
      },
      {
        value: '+15.3%',
        label: 'Revenue Growth',
        description: 'Increase in revenue from conversions.',
      },
      {
        value: '+6.8%',
        label: 'Checkout Completion',
        description: 'Percentage of users who complete checkout.',
        isRounded: true,
      },
    ],
    momMetrics: [
      {
        value: '+2.1%',
        label: 'Conversion Rate',
        description: 'Percentage of visitors who complete a desired action.',
      },
      {
        value: '+3.5%',
        label: 'Lead Generation',
        description: 'Number of qualified leads generated.',
        isRounded: true,
      },
      {
        value: '+4.2%',
        label: 'Revenue Growth',
        description: 'Increase in revenue from conversions.',
      },
      {
        value: '+1.8%',
        label: 'Checkout Completion',
        description: 'Percentage of users who complete checkout.',
        isRounded: true,
      },
    ],
  },
}
