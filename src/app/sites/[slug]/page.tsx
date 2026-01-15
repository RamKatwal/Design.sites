import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/features/common/Header';
import { getSiteBySlug } from '@/features/lib/getSites';
import { sites } from '@/data/sites';

// Generate static params for all known sites to optimize build
export function generateStaticParams() {
    return sites.map((site) => ({
        slug: site.slug,
    }));
}

export default async function SitePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const site = getSiteBySlug(resolvedParams.slug);

    if (!site) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 md:p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{site.name}</h1>
                            <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-lg"
                            >
                                {site.url}
                            </a>
                        </div>

                        <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Visit Website
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                    {/* Large Preview */}
                    <div className="relative aspect-[16/10] w-full bg-gray-100">
                        <Image
                            src={site.image}
                            alt={`Preview of ${site.name}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8">
                    <Link href="/" className="text-gray-500 hover:text-gray-800 font-medium inline-flex items-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Gallery
                    </Link>
                </div>
            </main>
        </div>
    );
}
