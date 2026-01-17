import { sanityClient } from "@/sanity/client"

export type SiteFilters = {
  q?: string
  category?: string[]
  font?: string[]
  style?: string[]
}

export async function getSites(filters: SiteFilters) {
  const { q, category = [], font = [], style = [] } = filters

  // Get document IDs for font and style filters
  const fontIds: string[] = []
  const styleIds: string[] = []

  console.log('🔎 Looking up fonts:', font)
  for (const fontSlug of font) {
    const fontId = await sanityClient.fetch(
      `*[_type == "font" && slug.current == $font][0]._id`,
      { font: fontSlug }
    )
    console.log(`  Font "${fontSlug}": ${fontId || 'NOT FOUND'}`)
    if (fontId) fontIds.push(fontId)
  }

  console.log('🔎 Looking up styles:', style)
  for (const styleSlug of style) {
    const styleId = await sanityClient.fetch(
      `*[_type == "style" && slug.current == $style][0]._id`,
      { style: styleSlug }
    )
    console.log(`  Style "${styleSlug}": ${styleId || 'NOT FOUND'}`)
    if (styleId) styleIds.push(styleId)
  }

  console.log('📊 Resolved IDs - Fonts:', fontIds, 'Styles:', styleIds, 'Categories:', category)

  // Only apply filters that have valid matches
  // If a filter is selected but has no matches, skip that filter condition
  // This allows other filters to still work

  const conditions: string[] = ['_type == "website"']

  if (q) {
    conditions.push(`(name match $q || category->name match $q)`)
  }

  // Handle multiple categories (OR logic - website matches any of the selected categories)
  if (category.length > 0) {
    conditions.push(`defined(category) && category->slug.current in $categories`)
  }

  // Handle multiple fonts (OR logic - website has any of the selected fonts)
  if (fontIds.length > 0) {
    // Check if any font reference matches any of the selected font IDs
    conditions.push(`count(fonts[@._ref in $fontIds]) > 0`)
  }

  // Handle multiple styles (OR logic - website has any of the selected styles)
  if (styleIds.length > 0) {
    // Check if any style reference matches any of the selected style IDs
    conditions.push(`count(styles[@._ref in $styleIds]) > 0`)
  }

  const query = `
    *[${conditions.join(" && ")}] | order(addedDate desc) {
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

  const params: Record<string, any> = {}
  if (q) params.q = `*${q}*`
  if (category.length > 0) params.categories = category
  if (fontIds.length > 0) params.fontIds = fontIds
  if (styleIds.length > 0) params.styleIds = styleIds

  // Debug logging
  console.log('🔍 Filter params:', params)
  console.log('📝 Query conditions:', conditions.join(' && '))

  const result = await sanityClient.fetch(query, params)
  console.log('✅ Results count:', result?.length || 0)
  
  return result
}
