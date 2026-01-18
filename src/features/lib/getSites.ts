import { sanityClient } from "@/sanity/client"

export type SiteFilters = {
  q?: string
  category?: string[]
  font?: string[]
  style?: string[]
}

export async function getSites(filters: SiteFilters = {}) {
  const {
    q,
    category = [],
    font = [],
    style = [],
  } = filters

  const conditions: string[] = ['_type == "website"']

  if (q) {
    conditions.push(`
      (
        name match $q ||
        category->name match $q
      )
    `)
  }

  if (category.length > 0) {
    conditions.push(`
      defined(category) &&
      category->slug.current in $categories
    `)
  }

  if (font.length > 0) {
    conditions.push(`
      count(fonts[]->slug.current[@ in $fonts]) > 0
    `)
  }

  if (style.length > 0) {
    conditions.push(`
      count(styles[]->slug.current[@ in $styles]) > 0
    `)
  }

  const query = `
    *[${conditions.join(" && ")}]
      | order(addedDate desc) {
        _id,
        name,
        "slug": slug.current,
        url,
        coverImage,
        logo,
        featured,
        category->{ name, "slug": slug.current },
        styles[]->{ name, "slug": slug.current },
        fonts[]->{ name, "slug": slug.current }
      }
  `

  const params = {
    q: q ? `*${q}*` : undefined,
    categories: category,
    fonts: font,
    styles: style,
  }

  return sanityClient.fetch(query, params)
}
