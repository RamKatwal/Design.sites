import Image from 'next/image'
import { ArrowUpRight, Calendar } from 'lucide-react'
import { Site } from '../types'
import { urlFor } from '@/sanity/image'
import { Button } from '@/components/ui/button'

interface SiteInfoProps {
    site: Site
}

export function SiteInfo({ site }: SiteInfoProps) {
    const logoUrl = site.logo
        ? urlFor(site.logo).width(120).height(120).url()
        : null

    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return null
        }
    }

    const formattedDate = formatDate(site.addedDate)

    return (
        <div className="flex flex-col gap-4">
            {/* Logo */}
            {logoUrl && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
                    <Image
                        src={logoUrl}
                        alt={`${site.name} logo`}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                    />
                </div>
            )}

            {/* Website Name */}
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {site.name}
            </h1>

            {/* Date Added */}
            {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Added {formattedDate}</span>
                </div>
            )}

            {/* Visit Site CTA */}
            {site.url && (
                <Button
                    asChild
                    size="lg"
                    className="w-full"
                >
                    <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Site
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                    </a>
                </Button>
            )}
        </div>
    )
}
