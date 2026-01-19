export interface Site {
    _id: string
    name: string
    slug: string
    url?: string
    coverImage: any
    logo?: any
    featured?: boolean
    addedDate?: string
    category?: {
        name: string
        slug: string
    }
    styles?: Array<{
        name: string
        slug: string
    }>
    fonts?: Array<{
        name: string
        slug?: string
    }>
    sections?: Array<{
        sectionType: {
            name: string
        }
        image: any
    }>
}
