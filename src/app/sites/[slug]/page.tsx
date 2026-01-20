import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/features/common/Header'
import { getSiteBySlug, getSites } from '@/features/lib/getSites'
import { SiteInfo } from '@/features/common/SiteInfo'
import { MetadataTags } from '@/features/common/MetadataTags'
import { Gallery } from '@/features/common/Gallery'
import { IframePreview } from '@/features/common/IframePreview'
import type { Metadata } from 'next'
import type { Site } from '@/features/types'

import { BookmarkButton } from '@/components/bookmark/BookmarkButton'

// Generate static params for all sites
export async function generateStaticParams() {
    const sites = await getSites()
    return sites.map((site: Site) => ({
        slug: site.slug,
    }))
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const resolvedParams = await params
    const site = await getSiteBySlug(resolvedParams.slug)

    if (!site) {
        return {
            title: 'Site Not Found',
        }
    }

    return {
        title: `${site.name} | Design.Web`,
        description: `Explore ${site.name} - a curated website design showcase${site.category ? ` in the ${site.category.name} category` : ''}.`,
        openGraph: {
            title: `${site.name} | Design.Web`,
            description: `Explore ${site.name} - a curated website design showcase.`,
            type: 'website',
            ...(site.coverImage && {
                images: [
                    {
                        url: site.coverImage.asset?.url || '',
                        width: 1200,
                        height: 630,
                        alt: site.name,
                    },
                ],
            }),
        },
    }
}

export default async function SitePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const site = await getSiteBySlug(resolvedParams.slug)

    if (!site) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="h-[calc(100vh-3.5rem)] mt-10 flex flex-col lg:flex-row">
                {/* Left Panel - Fixed/Sticky Info */}
                <aside
                    className="w-full lg:w-[400px] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border bg-card"
                    aria-label="Site information"
                >
                    <div className="p-6 lg:p-8 space-y-8">
                        {/* Back Link */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                            aria-label="Back to gallery"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Gallery
                        </Link>

                        {/* Site Info */}
                        <SiteInfo site={site} />

                        {/* Metadata Tags */}
                        <div className="pt-4 border-t border-border">
                            <h2 className="text-sm font-semibold text-foreground mb-3">
                                Tags
                            </h2>
                            <MetadataTags site={site} />
                        </div>

                        {/* Gallery */}
                        {site.sections && site.sections.length > 0 && (
                            <div className="pt-4 border-t border-border">
                                <Gallery site={site} />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Panel - Iframe Preview */}
                <div className="flex-1 min-h-0 p-4 lg:p-8">
                    <div className="h-full">
                        {site.url ? (
                            <IframePreview url={site.url} siteName={site.name} />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-muted rounded-lg border border-border">
                                <p className="text-muted-foreground">
                                    No preview available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
