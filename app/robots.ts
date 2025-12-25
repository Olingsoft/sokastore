import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soccastore.co.ke'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin',
                '/cart',
                '/checkout',
                '/account',
                '/orders',
                '/login',
                '/register',
                '/payment',
                '/api',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
