export const websitesQuery = `
  *[_type == "website"] | order(addedDate desc) {
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
