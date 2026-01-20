"use client";

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { Button } from '@/components/ui/button';
import { FolderList } from './FolderList';
import { CreateFolderInput } from './CreateFolderInput';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export function BookmarkModal() {
    const { isOpen, setOpen, setUser, fetchBookmarks } = useBookmarkStore();
    const modalRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Listen for outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, setOpen]);

    // Initialize fetching user on mount
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Fetch bookmarks on load to populate the store for "isBookmarked" checks
                fetchBookmarks();
            }
        }
        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchBookmarks();
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [supabase, setUser, fetchBookmarks]);


    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={cn(
                "fixed bottom-4 right-4 z-50 w-[360px]",
                "bg-background border border-border rounded-xl shadow-2xl",
                "p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-2 fade-in-0 duration-200"
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Save to collection</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setOpen(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Folder</p>
                <FolderList />
            </div>

            <div className="pt-2 border-t border-border">
                <CreateFolderInput />
            </div>
        </div>
    );
}
