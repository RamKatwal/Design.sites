import { sites } from '@/data/sites';
import { Site } from '../types';

export function getSites(query?: string): Site[] {
    if (!query) {
        return sites;
    }

    const lowerQuery = query.toLowerCase();

    return sites.filter((site) => {
        return (
            site.name.toLowerCase().includes(lowerQuery) ||
            site.url.toLowerCase().includes(lowerQuery)
        );
    });
}

export function getSiteBySlug(slug: string): Site | undefined {
    return sites.find((site) => site.slug === slug);
}
