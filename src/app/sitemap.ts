import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://withpoise.net'
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/register`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
