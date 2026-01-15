import { sanityClient } from '@/sanity/client'

export async function getSites(q?: string) {
  const query = `
    *[_type == "website" &&
      (!defined($q) || name match $q || category->name match $q)
    ] | order(addedDate desc) {
      _id,
      name,
      "slug": slug.current,
      url,
      coverImage,
      logo,
      featured,
      category->{
        name,
        "slug": slug.current
      },
      styles[]->{
        name,
        "slug": slug.current
      },
      fonts[]->{
        name
      }
    }
  `

  return sanityClient.fetch(query, {
    q: q ? `*${q}*` : null
  })
}

export async function getSiteBySlug(slug: string) {
  const query = `
    *[_type == "website" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      url,
      "image": coverImage.asset->url,
      logo,
      featured
    }
  `

  return sanityClient.fetch(query, { slug })
}
