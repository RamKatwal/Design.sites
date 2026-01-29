'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Download, X } from 'lucide-react'
import { Site } from '../types'
import { urlFor } from '@/sanity/image'
import { BookmarkButton } from '@/components/bookmark/BookmarkButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogClose,
} from '@/components/ui/dialog'

interface SiteCardProps {
    site: Site
    /** Show bookmark button; set to false for section page. Default true. */
    showBookmark?: boolean
    /** Optional badge label (e.g. section title). Shown top-left on card. */
    badge?: string
    /** When set, card click opens a popup with this image and a download option. */
    imagePopupUrl?: string
}

export function SiteCard({ site, showBookmark = true, badge, imagePopupUrl }: SiteCardProps) {
    const [popupOpen, setPopupOpen] = useState(false)
    const imageUrl = site.coverImage
        ? urlFor(site.coverImage).width(800).height(500).url()
        : '/placeholder.png'
    const popupImageUrl = imagePopupUrl ?? imageUrl

    async function handleDownload() {
        try {
            const res = await fetch(popupImageUrl, { mode: 'cors' })
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${site.name}-section.png`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            window.open(popupImageUrl, '_blank')
        }
    }

    const imageContent = (
        <div className="relative h-full w-full">
            <Image
                src={imageUrl}
                alt={site.name}
                fill
                className="object-cover transition-transform duration-500 scale-105 lg:scale-100 lg:group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    )

    return (
        <div className="group relative aspect-[16/10] overflow-hidden rounded-sm bg-muted transition-all duration-300 shadow-xl shadow-blue-900/5 lg:shadow-xs lg:hover:shadow-xl lg:hover:shadow-blue-900/5">
            {badge && (
                <Badge variant="secondary" className="absolute top-2 left-2 z-10 pointer-events-none">
                    {badge}
                </Badge>
            )}

            {/* Card → Detail page or popup */}
            {imagePopupUrl ? (
                <button
                    type="button"
                    className="block h-full w-full cursor-pointer border-0 p-0 bg-transparent text-left"
                    onClick={() => setPopupOpen(true)}
                >
                    {imageContent}
                </button>
            ) : (
                <Link href={`/sites/${site.slug}`} className="block h-full w-full">
                    {imageContent}
                </Link>
            )}

            {imagePopupUrl && (
                <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
                    <DialogContent
                        showCloseButton={false}
                        className="!fixed !inset-0 !top-0 !left-0 !right-0 !bottom-0 !w-full !h-full !max-w-none !translate-x-0 !translate-y-0 rounded-none border-0 p-0 bg-black/95 !flex flex-col overflow-hidden"
                    >
                        <div className="flex-1 min-h-0 flex items-center justify-center p-4 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={popupImageUrl}
                                alt={site.name}
                                className="max-w-full max-h-full w-auto h-auto object-contain mx-auto"
                            />
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full bg-white/20 text-white hover:bg-white/30 border-0"
                                onClick={handleDownload}
                                title="Download image"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            <DialogClose className="rounded-full bg-white/20 text-white hover:bg-white/30 p-2 opacity-70 hover:opacity-100 transition-opacity border-0">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Hover Overlay - visible by default on mobile/tablet, hover only on desktop */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 lg:opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100">
                <div
                    className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        {imagePopupUrl ? (
                            <Link href={`/sites/${site.slug}`} className="hover:underline">
                                <h3 className="text-xs font-semibold text-white tracking-wide">
                                    {site.name}
                                </h3>
                            </Link>
                        ) : (
                            <h3 className="text-xs font-semibold text-white tracking-wide">
                                {site.name}
                            </h3>
                        )}
                        <p className="text-xs text-gray-300 truncate max-w-[150px]">
                            {site.url?.replace(/^https?:\/\//, '')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {showBookmark && (
                            <BookmarkButton websiteId={site._id} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-colors" />
                        )}

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
