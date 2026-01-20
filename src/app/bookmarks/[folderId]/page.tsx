"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { createClient } from '@/lib/supabase/client';
import { getSitesByIds } from '@/features/lib/getSitesByIds';
import { SiteGrid } from '@/features/common/SiteGrid';
import { Site } from '@/features/types';
import { ArrowLeft, Loader2, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/features/common/Header';

export default function BookmarkFolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const resolvedParams = use(params);
    const folderId = resolvedParams.folderId;

    // We fetch folder name and bookmarks client-side for simplicity since we have RLS and client-side auth state
    // but typically one might do this server side with cookies. existing patterns here seem mixed or client-heavy for auth.
    // Given previous steps used client-side Supabase, we stick to that.

    const [sites, setSites] = useState<Site[]>([]);
    const [folderName, setFolderName] = useState<string>('Folder');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // router.push('/'); // Or show login
                setLoading(false);
                return;
            }

            // 1. Fetch folder details
            const { data: folder, error: folderError } = await supabase
                .from('bookmark_folders')
                .select('name')
                .eq('id', folderId)
                .single();

            if (folderError || !folder) {
                console.error('Folder not found', folderError);
                setLoading(false);
                return;
            }
            setFolderName(folder.name);

            // 2. Fetch bookmarks in this folder
            const { data: bookmarks, error: bookmarkError } = await supabase
                .from('bookmarks')
                .select('website_id')
                .eq('folder_id', folderId);

            if (bookmarkError) {
                console.error('Error fetching bookmarks', bookmarkError);
                setLoading(false);
                return;
            }

            // 3. Fetch Site data from Sanity for these IDs
            if (bookmarks && bookmarks.length > 0) {
                const ids = bookmarks.map(b => b.website_id);
                // We need a server action or API route or client-side sanity fetch.
                // Assuming `getSitesByIds` uses `sanityClient` which is configured for client use if token is public or uses API.
                // Usually Sanity client needs `useCdn: true`.
                try {
                    const siteData = await getSitesByIds(ids);
                    setSites(siteData);
                } catch (err) {
                    console.error("Sanity fetch error", err);
                }
            } else {
                setSites([]);
            }

            setLoading(false);
        };

        fetchData();
    }, [folderId, supabase, router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-14 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-14">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/bookmarks" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold">{folderName}</h1>
                    </div>
                    <span className="text-muted-foreground text-sm self-end mb-2">{sites.length} items</span>
                </div>

                {sites.length > 0 ? (
                    <SiteGrid sites={sites} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30">
                        <p className="text-lg text-muted-foreground mb-4">No websites in this folder.</p>
                        <Link href="/">
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                                Browse Gallery
                            </button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
