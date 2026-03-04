import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/tasks/', '/insights'],
      },
    ],
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}
