import { sanityClient } from "@/sanity/client"

export type BlogItem = {
    _id: string
    title: string
    authorName: string
    addedOn?: string
    siteLink?: string
    notes?: Array<{ _key?: string; highlight?: string }>
}

export async function getBlogs(): Promise<BlogItem[]> {
    const query = `
        *[_type == "blog"] | order(addedOn desc) {
            _id,
            title,
            authorName,
            addedOn,
            siteLink,
            notes[] {
                _key,
                highlight
            }
        }
    `
    const blogs = await sanityClient.fetch<BlogItem[]>(query)
    return blogs ?? []
}
