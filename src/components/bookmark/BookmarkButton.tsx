"use client";

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface BookmarkButtonProps {
    websiteId: string;
    className?: string;
}

export function BookmarkButton({ websiteId, className }: BookmarkButtonProps) {
    const { isBookmarked, setOpen, user } = useBookmarkStore();
    const isSaved = isBookmarked(websiteId);
    const supabase = createClient();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        e.stopPropagation();

        if (!user) {
            // Handle login trigger
            // For now, we'll try to trigger the same login flow or use a toast
            // Since we don't have a global "openLoginModal", we might redirect or show alert.
            // Prompt said: "If user is not logged in: Open login modal"
            // Assuming the AuthButton handles login, we might not have a direct imperative handle for it.
            // We can check if there is a 'sign-in' trigger available or just redirect.

            // Simplest approach per existing AuthButton:
            supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            return;
        }

        if (isSaved) {
            // Already bookmarked - maybe remove? Or open modal to change folder?
            // "Bookmark icon should toggle immediately" -> implied toggle behavior or open modal.
            // Prompt says: "User clicks bookmark icon... If logged in: Open bottom-right modal"
            // It doesn't explicitly say "Remove".
            // However, usually clicking a filled bookmark opens edit/remove. 
            // We'll open the modal regardless for now, so they can add to another folder or we could implement remove there.
            // But let's stick to the prompt flow: "Open bottom-right ... modal"
            setOpen(true, websiteId);
        } else {
            setOpen(true, websiteId);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-full", className)}
            onClick={handleClick}
        >
            <Bookmark
                className={cn(
                    "h-4 w-4 transition-all",
                    isSaved ? "fill-primary text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            />
            <span className="sr-only">{isSaved ? "Saved" : "Save to bookmarks"}</span>
        </Button>
    );
}
