import { Site } from '../types';
import { SiteCard } from './SiteCard';

interface SiteGridProps {
    sites: Site[];
}

export function SiteGrid({ sites }: SiteGridProps) {
    if (sites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-muted-foreground">No websites found matching your search.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
            ))}
        </div>
    );
}
