import { sanityClient } from "@/sanity/client"

export type SectionFilters = {
    q?: string
    sectionSlug?: string
}

export type SectionItem = {
    _key: string
    image: any
    label?: string
    sectionType: {
        name: string
        slug: string
    }
    website: {
        name: string
        slug: string
        url: string
    }
}

export async function getSections(filters: SectionFilters = {}) {
    const { q, sectionSlug } = filters

    const conditions: string[] = ['_type == "website"', 'defined(sections)']

    if (q) {
        conditions.push(`name match $q`)
    }

    // We fetch websites, then project their sections
    // We'll filter the sections array in the projection or client-side?
    // GROQ can filter arrays in projection.

    // Let's refine the query to "flatten" the result if possible, or just return websites with filtered sections.
    // Returning objects representing single section instances is cleaner for the grid.

    // However, GROQ queries return documents. We can return an array of objects constructed from the document data.

    let sectionFilter = "true"
    if (sectionSlug && sectionSlug !== "all") {
        sectionFilter = `sectionType->slug.current == $sectionSlug`
    }

    const query = `
    *[${conditions.join(" && ")}] {
      name,
      "slug": slug.current,
      url,
      sections[${sectionFilter}] {
        _key,
        image,
        label,
        sectionType->{
          name,
          "slug": slug.current
        }
      }
    }
  `

    const params = {
        q: q ? `*${q}*` : undefined,
        sectionSlug
    }

    const websites = await sanityClient.fetch(query, params)

    // Post-process to flatten into a list of "section instances"
    const allSections: SectionItem[] = []

    if (Array.isArray(websites)) {
        websites.forEach((site: any) => {
            if (site.sections) {
                site.sections.forEach((section: any) => {
                    allSections.push({
                        ...section,
                        website: {
                            name: site.name,
                            slug: site.slug,
                            url: site.url
                        }
                    })
                })
            }
        })
    }

    return allSections
}
