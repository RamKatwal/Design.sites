"use client";

import { useEffect } from 'react';
import { BookmarkButton } from '@/components/bookmark/BookmarkButton';
import { useBookmarkStore } from '@/stores/useBookmarkStore'; // Assuming this store exposes openModal action
// But wait, BookmarkButton itself handles opening the modal on click.
// We just need to trigger the click or call `setOpen`.

interface DetailBookmarkButtonProps {
    websiteId: string;
}

export function DetailBookmarkButton({ websiteId }: DetailBookmarkButtonProps) {
    const { setOpen, isBookmarked } = useBookmarkStore();
    const isSaved = isBookmarked(websiteId);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if active element is an input to avoid interfering with typing
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) return;

            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                setOpen(true, websiteId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setOpen, websiteId]);

    // Reusing the BookmarkButton style? No, prompt says: "Add a bookmark pprimary button in detail page"
    // Usually means a big button like "Visit Site".
    // I can reuse standard Button and call store.

    return (
        <div onClick={() => setOpen(true, websiteId)} className="w-full">
            <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8">
                {isSaved ? "Saved to Bookmarks" : "Bookmark (S)"}
            </button>
        </div>
    );
}
