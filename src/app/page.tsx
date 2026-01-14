import { Suspense } from 'react';
import { Header } from '@/features/sites/components/Header';
import { SiteGrid } from '@/features/sites/components/SiteGrid';
import { getSites } from '@/features/sites/lib/getSites';

// This is a Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const sites = getSites(q);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />
      <main className="w-full px-[40px] pt-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Inspiration Gallery</h1>
          <p className="text-muted-foreground">Curated collection of the finest websites on the internet.</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteGrid sites={sites} />
        </Suspense>
      </main>
    </div>
  );
}
