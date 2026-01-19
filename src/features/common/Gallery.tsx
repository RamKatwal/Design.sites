'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Site } from '../types'
import { urlFor } from '@/sanity/image'
import { cn } from '@/lib/utils'

interface GalleryProps {
    site: Site
}

export function Gallery({ site }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    if (!site.sections || site.sections.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Screenshots</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {site.sections.map((section, index) => {
                    const imageUrl = section.image
                        ? urlFor(section.image).width(400).height(300).url()
                        : null

                    if (!imageUrl) return null

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                            className={cn(
                                "relative flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-foreground ring-2 ring-foreground/20"
                                    : "border-border hover:border-foreground/50"
                            )}
                            aria-label={`View screenshot ${index + 1}: ${section.sectionType?.name || 'Screenshot'}`}
                        >
                            <Image
                                src={imageUrl}
                                alt={section.sectionType?.name || `Screenshot ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="128px"
                            />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
