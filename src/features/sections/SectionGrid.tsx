"use client"

import { SectionItem } from "@/features/lib/getSections"
import { SiteCard } from "@/features/common/SiteCard"
import { Site } from "@/features/types"
import { urlFor } from "@/sanity/image"

type SectionGridProps = {
    sections: SectionItem[]
}

/** Map a section to a minimal Site shape so we can reuse SiteCard (no bookmark). */
function sectionToSiteLike(section: SectionItem): Site {
    return {
        _id: section._key,
        name: section.website.name,
        slug: section.website.slug,
        url: section.website.url,
        coverImage: section.image,
    }
}

export function SectionGrid({ sections }: SectionGridProps) {
    if (sections.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                No sections found
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-2">
            {sections.map((section) => (
                <SiteCard
                    key={section._key}
                    site={sectionToSiteLike(section)}
                    showBookmark={false}
                    badge={section.label || section.sectionType.name}
                    imagePopupUrl={urlFor(section.image).width(1200).url()}
                />
            ))}
        </div>
    )
}
