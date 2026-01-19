'use client'

import Link from 'next/link'
import { Site } from '../types'
import { Badge } from '@/components/ui/badge'

interface MetadataTagsProps {
    site: Site
}

export function MetadataTags({ site }: MetadataTagsProps) {
    const tags: Array<{ label: string; type: 'category' | 'style' | 'font'; slug?: string }> = []

    // Add category
    if (site.category) {
        tags.push({
            label: site.category.name,
            type: 'category',
            slug: site.category.slug
        })
    }

    // Add styles
    if (site.styles && site.styles.length > 0) {
        site.styles.forEach(style => {
            tags.push({
                label: style.name,
                type: 'style',
                slug: style.slug
            })
        })
    }

    // Add fonts
    if (site.fonts && site.fonts.length > 0) {
        site.fonts.forEach(font => {
            tags.push({
                label: font.name,
                type: 'font',
                slug: font.slug
            })
        })
    }

    if (tags.length === 0) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
                if (!tag.slug) {
                    return (
                        <Badge
                            key={`${tag.type}-${index}`}
                            variant="outline"
                             className="cursor-default px-4 py-2 text-sm font-medium"
                        >
                            {tag.label}
                        </Badge>
                    )
                }

                return (
                    <Badge
                        key={`${tag.type}-${index}`}
                        variant="outline"
                         className="cursor-default px-4 py-2 text-sm font-medium"
                        asChild
                    >
                        <Link
                            href={`/?${tag.type}=${tag.slug}`}
                            data-type={tag.type}
                            data-slug={tag.slug}
                            className="cursor-pointer"
                        >
                            {tag.label}
                        </Link>
                    </Badge>
                )
            })}
        </div>
    )
}
