export interface Site {
    _id: string
    name: string
    slug: string
    url?: string
    coverImage: any
    logo?: any
    featured?: boolean
    category?: {
        name: string
        slug: string
    }
}
