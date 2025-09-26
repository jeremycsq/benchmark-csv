import { onMounted } from 'vue'
import ScrollReveal from 'scrollreveal'

interface ScrollRevealOptions {
  delay?: number
  distance?: string
  duration?: number
  easing?: string
  interval?: number
  opacity?: number
  origin?: 'top' | 'bottom' | 'left' | 'right'
  scale?: number
}

export function useScrollReveal(selector: string, options: ScrollRevealOptions = {}) {
  onMounted(() => {
    const defaultOptions: ScrollRevealOptions = {
      delay: 200,
      distance: '30px',
      duration: 500,
      easing: 'ease-in-out',
      opacity: 0,
      origin: 'bottom',
      scale: 1,
    }

    ScrollReveal().reveal(selector, { ...defaultOptions, ...options })
  })
}
