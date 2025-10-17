// Configuration des thèmes par page
export interface PageTheme {
  primary: string
  secondary: string
  tertiary: string
  accent: string
  background: string
  text: string
  gradient: {
    from: string
    to: string
    hoverFrom: string
    hoverTo: string
  }
}

export const pageThemes: Record<string, PageTheme> = {
  traffic: {
    primary: '#7c0033',
    secondary: '#cd3246',
    tertiary: '#ffe3e3',
    accent: '#ffe3e3',
    background: '#ffbdbd',
    text: '#000000',
    gradient: {
      from: '#8D0A38',
      to: '#A31242',
      hoverFrom: '#72082C',
      hoverTo: '#8D0A38',
    },
  },
  engagement: {
    primary: '#004c3d',
    secondary: '#00844e',
    tertiary: '#d3ffb6',
    accent: '#a6ef7b',
    background: '#f2ffe6',
    text: '#000000',
    gradient: {
      from: '#2E614F',
      to: '#6D9A7A',
      hoverFrom: '#1F4A3A',
      hoverTo: '#2E614F',
    },
  },
  frustration: {
    primary: '#3737A2',
    secondary: '#AFAFF5',
    tertiary: '#D5D6FB',
    accent: '#D5D6FB',
    background: '#F7F8FF',
    text: '#000000',
    gradient: {
      from: '#3737A2',
      to: '#AFAFF5',
      hoverFrom: '#2A2A7A',
      hoverTo: '#8F8FE0',
    },
  },
  conversion: {
    primary: '#32373A',
    secondary: '#626B76',
    tertiary: '#32373A',
    accent: '#ECEDEF',
    background: '#EEEFF1',
    text: '#000000',
    gradient: {
      from: '#32373A',
      to: '#626B76',
      hoverFrom: '#2A2E31',
      hoverTo: '#4E5661',
    },
  },
}

// Configuration des couleurs de graphiques
export const chartColors: Record<
  string,
  {
    primary: string
    secondary: string
    tertiary: string
    background: string
  }
> = {
  traffic: {
    primary: '#7c0033',
    secondary: '#ff5c5c',
    tertiary: '#ffe3e3',
    background: '#F7F9F9',
  },
  engagement: {
    primary: '#004c3d',
    secondary: '#00844e',
    tertiary: '#d3ffb6',
    background: '#f2ffe6',
  },
  frustration: {
    primary: '#3737A2',
    secondary: '#AFAFF5',
    tertiary: '#D5D6FB',
    background: '#F7F8FF',
  },
  conversion: {
    primary: '#ECEDEF',
    secondary: '#626B76',
    tertiary: '#32373A',
    background: '#EEEFF1',
  },
}

// Configuration des icônes par type
export const iconConfig = {
  globe: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    ],
  },
  tag: {
    viewBox: '0 0 24 24',
    paths: [
      'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
    ],
  },
  calendar: {
    viewBox: '0 0 24 24',
    paths: [
      'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
    ],
  },
  devices: {
    viewBox: '0 0 24 24',
    paths: [
      'M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z',
    ],
  },
  users: {
    viewBox: '0 0 24 24',
    paths: [
      'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V15h-1.5v-3.74L9.01 9A2.5 2.5 0 0 0 7 8H5.46c-.8 0-1.54.37-2.01 1L.96 15.37A1.5 1.5 0 0 0 2.5 18H5v6h2v-6h1.5v6H11v-6h1.5v6H15v-6h1.5v6H19z',
    ],
  },
}

// Fonction utilitaire pour obtenir le thème d'une page
export const getPageTheme = (pageName: string): PageTheme => {
  return pageThemes[pageName] || pageThemes.traffic
}

// Fonction utilitaire pour obtenir les couleurs de graphique d'une page
export const getChartColors = (pageName: string) => {
  return chartColors[pageName] || chartColors.traffic
}

// Fonction utilitaire pour obtenir la classe CSS du gradient d'une page
export const getGradientClass = (pageName: string, isHover = false): string => {
  const theme = getPageTheme(pageName)
  const gradient = isHover ? theme.gradient.hoverFrom : theme.gradient.from
  const gradientTo = isHover ? theme.gradient.hoverTo : theme.gradient.to

  return `bg-gradient-to-r from-[${gradient}] to-[${gradientTo}]`
}
