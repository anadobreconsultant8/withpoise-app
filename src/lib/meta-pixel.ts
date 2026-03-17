// Type-safe wrapper for Meta Pixel fbq calls
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function pixelTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params)
  }
}
