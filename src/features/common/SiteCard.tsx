'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Site } from '../types';

interface SiteCardProps {
    site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
    return (
        <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5">
            {/* Main Image Link */}
            <Link href={`/sites/${site.slug}`} className="block h-full w-full">
                <div className="relative h-full w-full">
                    <Image
                        src={site.image}
                        alt={site.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </Link>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-wide">{site.name}</h3>
                        <p className="text-xs text-gray-300 truncate max-w-[150px]">{site.url.replace(/^https?:\/\//, '')}</p>
                    </div>
                    <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-colors"
                        title="Open website"
                        onClick={(e) => e.stopPropagation()} // Prevent navigation to detail page when clicking external link
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
