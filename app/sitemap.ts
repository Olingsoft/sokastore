import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soccastore.co.ke'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Static routes
    const staticRoutes = [
        '',
        '/shop',
        '/blogs',
        '/faq',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-and-conditions',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes
    let productRoutes: any[] = []
    let categoryRoutes: any[] = []
    let blogRoutes: any[] = []

    if (apiUrl) {
        try {
            // Fetch Products
            const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } })
            const data = await res.json()
            const products = Array.isArray(data?.data) ? data.data : []

            productRoutes = products.map((product: any) => ({
                url: `${baseUrl}/shop/${product.id}`,
                lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }))

            // Categories
            const categories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))
            categoryRoutes = categories.map((category: any) => ({
                url: `${baseUrl}/shop?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))

            // Fetch Blogs
            const blogRes = await fetch(`${apiUrl}/blogs`, { next: { revalidate: 3600 } })
            const blogData = await blogRes.json()
            const blogs = Array.isArray(blogData?.data) ? blogData.data : []

            blogRoutes = blogs.map((blog: any) => ({
                url: `${baseUrl}/blogs/${blog.slug}`,
                lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        } catch (error) {
            console.error('Sitemap: Error fetching dynamic data', error)
        }
    }

    return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes]
}
