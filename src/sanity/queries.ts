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

export const searchDataQuery = `
{
  "categories": *[_type == "category"]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "website" && references(^._id)])
  },
  "fonts": *[_type == "font"]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "website" && references(^._id)])
  },
  "styles": *[_type == "style"]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "website" && references(^._id)])
  }
}
`

