import { Suspense } from 'react';
import { Header } from '@/features/common/Header';
import { SiteGrid } from '@/features/common/SiteGrid';
import { getSites } from '@/features/lib/getSites';

// This is a Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const sites = await getSites(q);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />
      <main className="w-full px-4 pt-18">
        <Suspense fallback={<div>Loading...</div>}>
          <SiteGrid sites={sites} />
        </Suspense>
      </main>
    </div>
  );
}
