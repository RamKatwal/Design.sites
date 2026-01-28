"use client"

import { SectionItem } from "@/features/lib/getSections"
import { urlFor } from "@/sanity/image"
import Image from "next/image"
import { useState } from "react"
import { ExternalLink } from "lucide-react"

type SectionGridProps = {
    sections: SectionItem[]
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((section) => (
                <SectionCard key={section._key} section={section} />
            ))}
        </div>
    )
}

function SectionCard({ section }: { section: SectionItem }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group relative overflow-hidden rounded-xl bg-muted/30 border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-border"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="aspect-[4/3] w-full relative">
                <Image
                    src={urlFor(section.image).url()}
                    alt={section.label || `${section.website.name} - ${section.sectionType.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center ${isHovered ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                        <h3 className="font-bold text-white mb-1">{section.website.name}</h3>
                        {section.label && (
                            <p className="text-white/80 text-sm mb-2">{section.label}</p>
                        )}

                        <a
                            href={section.website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 backdrop-blur-sm transition-colors mt-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Visit Site <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-card border-t flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                    {section.sectionType.name}
                </span>
            </div>
        </div>
    )
}
