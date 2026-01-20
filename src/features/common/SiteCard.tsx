'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Site } from '../types'
import { urlFor } from '@/sanity/image'
import { BookmarkButton } from '@/components/bookmark/BookmarkButton'

interface SiteCardProps {
    site: Site
}

export function SiteCard({ site }: SiteCardProps) {
    const imageUrl = site.coverImage
        ? urlFor(site.coverImage).width(800).height(500).url()
        : '/placeholder.png'

    return (
        <div className="group relative aspect-[16/10] overflow-hidden rounded-sm bg-muted transition-all duration-300 shadow-xl shadow-blue-900/5 lg:shadow-xs lg:hover:shadow-xl lg:hover:shadow-blue-900/5">

            {/* Card → Detail page */}
            <Link href={`/sites/${site.slug}`} className="block h-full w-full">
                <div className="relative h-full w-full">
                    <Image
                        src={imageUrl}
                        alt={site.name}
                        fill
                        className="object-cover transition-transform duration-500 scale-105 lg:scale-100 lg:group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </Link>

            {/* Hover Overlay - visible by default on mobile/tablet, hover only on desktop */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 lg:opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between pointer-events-auto">
                    <div>
                        <h3 className="text-xs font-semibold text-white tracking-wide">
                            {site.name}
                        </h3>
                        <p className="text-xs text-gray-300 truncate max-w-[150px]">
                            {site.url?.replace(/^https?:\/\//, '')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <BookmarkButton websiteId={site._id} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-colors" />

                        {/* External link */}
                        <a
                            href={site.url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-colors"
                            title="Open website"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ArrowUpRight className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
