import { useRef, useEffect } from 'react';
import { Folder, Loader2, Check } from 'lucide-react';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FolderList() {
    const { folders, isLoading, addBookmark } = useBookmarkStore();
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll to top when new folder is added (if we wanted to, but new folders usually go to top/bottom)
    // The store adds new folder to the top.

    const handleSelect = (folderId: string) => {
        addBookmark(folderId);
    };

    if (isLoading && folders.length === 0) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!isLoading && folders.length === 0) {
        return (
            <div className="text-center p-4 text-sm text-muted-foreground">
                No folders yet. Create one below!
            </div>
        );
    }

    return (
        <div ref={listRef} className="max-h-[200px] overflow-y-auto space-y-1 py-1 pr-1">
            {folders.map((folder) => (
                <button
                    key={folder.id}
                    onClick={() => handleSelect(folder.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                >
                    <Folder className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-sm font-medium truncate flex-1">{folder.name}</span>
                    {/* Could add a 'selected' indicator if we were just selecting, but clicking saves immediately according to flow */}
                </button>
            ))}
        </div>
    );
}
