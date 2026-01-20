"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/features/common/Header';
import { useRouter } from 'next/navigation';
import { useBookmarkStore } from '@/stores/useBookmarkStore'; // Use the store
import { Folder, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { CreateFolderInput } from '@/components/bookmark/CreateFolderInput';

export default function BookmarksPage() {
    const { user, folders, fetchFolders, isLoading, setUser } = useBookmarkStore();
    const router = useRouter();
    const supabase = createClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false); // To toggle inline creation

    useEffect(() => {
        // Hydrate user if not available (store might lose state on refresh if not persisted, though we handle it in global components usually)
        // But here we need to force it or rely on AuthWrapper etc.
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchFolders();
            } else {
                // Redirect or show login? Prompt implies "Logged-in users".
                // router.push('/'); 
            }
        };
        init();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchFolders();
            } else {
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();

    }, [fetchFolders, router, setUser, supabase]);

    if (isLoading && folders.length === 0) { // Show skeleton
        return (
            <div className="container mx-auto px-4 py-8 mt-14">
                <h1 className="text-3xl font-bold mb-8">Bookmarks</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 mt-14">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Bookmarks</h1>
                    <Button onClick={() => setIsCreateOpen(!isCreateOpen)}>
                        {isCreateOpen ? 'Cancel' : '+ Create New Board'}
                    </Button>
                </div>

                {isCreateOpen && (
                    <div className="mb-8 max-w-sm p-4 bg-muted/30 border rounded-xl">
                        <p className="text-sm font-medium mb-2">New Board Name</p>
                        <CreateFolderInput />
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {folders.map((folder) => (
                        <Link href={`/bookmarks/${folder.id}`} key={folder.id} className="group block relative">
                            <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                {/* Folder Actions (Delete) */}
                                <button
                                    className="absolute top-2 right-2 z-20 p-2 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm("Are you sure you want to delete this folder? All bookmarks inside will be deleted.")) {
                                            // TODO: Call store delete
                                            // deleteFolder(folder.id);
                                        }
                                    }}
                                    title="Delete folder"
                                >
                                    <span className="sr-only">Delete</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>

                                {/* Preview Area */}
                                <div className="aspect-[4/3] bg-muted/50 p-4 relative group-hover:bg-muted/70 transition-colors">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 bg-background shadow-sm rounded-md rotate-[-6deg] absolute transition-transform group-hover:rotate-[-8deg] z-10" />
                                        <div className="w-1/2 h-1/2 bg-background shadow-sm rounded-md rotate-[3deg] absolute transition-transform group-hover:rotate-[6deg] z-20" />
                                        <div className="w-1/2 h-1/2 bg-background shadow-sm rounded-md absolute z-30 flex items-center justify-center">
                                            <Folder className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{folder.name}</h3>
                                    <p className="text-sm text-muted-foreground">{folder.count || 0} Screens</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {folders.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-muted-foreground">No bookmark boards yet.</h3>
                        <p className="text-sm text-muted-foreground/60 mt-2">Create one to start collecting websites.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
