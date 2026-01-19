'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IframePreviewProps {
    url: string
    siteName: string
}

export function IframePreview({ url, siteName }: IframePreviewProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Handle iframe load
    const handleLoad = () => {
        setIsLoading(false)
    }

    // Handle iframe error
    const handleError = () => {
        setIsLoading(false)
        setHasError(true)
    }

    return (
        <div className="relative w-full h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            {/* Browser Chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 truncate max-w-xs">
                        {url.replace(/^https?:\/\//, '')}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="h-7 w-7"
                >
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${siteName} in new tab`}
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </Button>
            </div>

            {/* Iframe Container */}
            <div className="relative flex-1 min-h-0">
                {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="text-center p-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Unable to load preview
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open in New Tab
                                    <ExternalLink className="h-3.5 w-3.5 ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                                <div className="text-sm text-muted-foreground">Loading preview...</div>
                            </div>
                        )}
                        <iframe
                            src={url}
                            title={`Preview of ${siteName}`}
                            className="w-full h-full border-0"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
                            loading="lazy"
                            onLoad={handleLoad}
                            onError={handleError}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </>
                )}
            </div>
        </div>
    )
}
