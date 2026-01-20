
import { sanityClient } from "@/sanity/client";
import { Site } from "../types";

export async function getSitesByIds(ids: string[]) {
    if (ids.length === 0) return [];

    // Sanity query where ID is in the list
    const query = `
      *[_type == "website" && _id in $ids]
      | order(publishedAt desc) {
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
    `;

    return sanityClient.fetch(query, { ids });
}
