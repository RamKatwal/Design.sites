import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export type BookmarkFolder = {
    id: string; // uuid
    user_id: string; // uuid
    name: string;
    created_at: string;
    count?: number; // Optimistic or fetched count
};

export type Bookmark = {
    id: string; // uuid
    user_id: string; // uuid
    folder_id: string; // uuid
    type: 'website';
    website_id: string;
    created_at: string;
};

interface BookmarkState {
    // State
    user: User | null;
    folders: BookmarkFolder[];
    bookmarks: Bookmark[]; // loading all bookmarks might be heavy if many, but useful for "isBookmarked" checks
    bookmarkedWebsiteIds: Set<string>; // Optimization for quick lookup
    isLoading: boolean;
    isOpen: boolean;
    activeWebsiteId: string | null; // The website we are currently trying to bookmark

    // Actions
    setUser: (user: User | null) => void;
    setOpen: (isOpen: boolean, websiteId?: string | null) => void;
    fetchFolders: () => Promise<void>;
    fetchBookmarks: () => Promise<void>;
    addFolder: (name: string) => Promise<BookmarkFolder | null>;
    addBookmark: (folderId: string) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;

    // Helpers
    isBookmarked: (websiteId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
    user: null,
    folders: [],
    bookmarks: [],
    bookmarkedWebsiteIds: new Set(),
    isLoading: false,
    isOpen: false,
    activeWebsiteId: null,

    setUser: (user) => set({ user }),

    setOpen: (isOpen, websiteId = null) => {
        set({ isOpen, activeWebsiteId: websiteId });
        if (isOpen && get().user) {
            // Refresh data when opening
            get().fetchFolders();
        }
    },

    fetchFolders: async () => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        const supabase = createClient();

        // Fetch folders
        const { data: foldersData, error: foldersError } = await supabase
            .from('bookmark_folders')
            .select('*, bookmarks(count)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (foldersError) {
            console.error('Error fetching folders:', foldersError);
            // Fallback if relation not clear (though it should be)
            set({ isLoading: false });
            return;
        }

        // Process counts if returned as [{..., bookmarks: [{count: 5}]}] or similar depending on Supabase setup
        // Usually select('*, bookmarks(count)') returns { bookmarks: [{ count: 5 }] }
        // We map it to a flatter structure
        const foldersWithCounts = foldersData.map((f: any) => ({
            ...f,
            count: f.bookmarks ? f.bookmarks[0]?.count : 0
        }));

        set({ folders: foldersWithCounts || [], isLoading: false });
    },

    fetchBookmarks: async () => {
        const { user } = get();
        if (!user) return;

        const supabase = createClient();
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching bookmarks:', error);
        } else {
            const bookmarks = data || [];
            const ids = new Set(bookmarks.map(b => b.website_id));
            set({ bookmarks, bookmarkedWebsiteIds: ids });
        }
    },

    addFolder: async (name: string) => {
        const { user } = get();
        if (!user) return null;

        const supabase = createClient();
        const { data, error } = await supabase
            .from('bookmark_folders')
            .insert({
                user_id: user.id,
                name: name,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating folder:', error);
            toast.error('Failed to create folder');
            return null;
        }

        if (data) {
            set((state) => ({ folders: [{ ...data, count: 0 }, ...state.folders] }));
            return data;
        }
        return null;
    },

    addBookmark: async (folderId: string) => {
        const { user, activeWebsiteId, bookmarkedWebsiteIds, folders } = get();
        if (!user || !activeWebsiteId) return;

        // Check if already bookmarked
        if (bookmarkedWebsiteIds.has(activeWebsiteId)) {
            console.log('Already bookmarked');
            return;
        }

        // Optimistic update
        const previousIds = new Set(bookmarkedWebsiteIds);
        set((state) => {
            const newIds = new Set(state.bookmarkedWebsiteIds);
            newIds.add(activeWebsiteId);

            // Optimistically update folder count
            const newFolders = state.folders.map(f =>
                f.id === folderId ? { ...f, count: (f.count || 0) + 1 } : f
            );

            return {
                bookmarkedWebsiteIds: newIds,
                isOpen: false,
                folders: newFolders
            };
        });

        const supabase = createClient();
        const { data, error } = await supabase
            .from('bookmarks')
            .insert({
                user_id: user.id,
                folder_id: folderId,
                type: 'website',
                website_id: activeWebsiteId,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding bookmark:', error);
            // Rollback
            set({ bookmarkedWebsiteIds: previousIds, isOpen: true, folders: folders });
            toast.error('Failed to add bookmark');
        } else {
            if (data) {
                set((state) => ({ bookmarks: [...state.bookmarks, data] }));
                toast.success('Bookmark added', {
                    action: {
                        label: 'Undo',
                        onClick: async () => {
                            // Undo logic: delete the bookmark
                            const { error: undoError } = await supabase
                                .from('bookmarks')
                                .delete()
                                .eq('id', data.id);

                            if (!undoError) {
                                // Revert state
                                set((state) => {
                                    const newIds = new Set(state.bookmarkedWebsiteIds);
                                    newIds.delete(activeWebsiteId);
                                    const newFolders = state.folders.map(f =>
                                        f.id === folderId ? { ...f, count: (f.count || 0) - 1 } : f
                                    );
                                    return { bookmarkedWebsiteIds: newIds, folders: newFolders };
                                });
                                toast.success('Bookmark removed');
                            }
                        }
                    }
                });
            }
        }
    },

    deleteFolder: async (folderId: string) => {
        const { user, folders } = get();
        if (!user) return;

        const previousFolders = [...folders];

        // Optimistic delete
        set((state) => ({ folders: state.folders.filter(f => f.id !== folderId) }));

        const supabase = createClient();
        const { error } = await supabase
            .from('bookmark_folders')
            .delete()
            .eq('id', folderId);

        if (error) {
            console.error('Error deleting folder:', error);
            set({ folders: previousFolders });
            toast.error('Failed to delete folder');
        } else {
            toast.success('Folder deleted');
        }
    },

    isBookmarked: (websiteId) => {
        return get().bookmarkedWebsiteIds.has(websiteId);
    }
}));
