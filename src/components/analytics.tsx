'use client'

import { useEffect } from 'react'

const GA_ID = 'G-26W8C6S0L6'
const PIXEL_ID = '2376244492879795'

export function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      function gtag(...args: any[]) { (window as any).dataLayer.push(args) }
      ;(window as any).gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_ID)
    }

    // Meta Pixel
    ;(function(f: any, b: any, e: any, v: any) {
      if (f.fbq) return
      const n: any = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
      const t = b.createElement(e)
      t.async = true
      t.src = v
      const s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    ;(window as any).fbq('init', PIXEL_ID)
    ;(window as any).fbq('track', 'PageView')
  }, [])

  return null
}
