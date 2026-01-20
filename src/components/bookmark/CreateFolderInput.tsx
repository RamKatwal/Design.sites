import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookmarkStore } from '@/stores/useBookmarkStore';

export function CreateFolderInput() {
    const [name, setName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const addFolder = useBookmarkStore((state) => state.addFolder);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsCreating(true);
        try {
            await addFolder(name.trim());
            setName('');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New folder name..."
                className="h-9"
                disabled={isCreating}
            />
            <Button
                type="submit"
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                disabled={!name.trim() || isCreating}
            >
                {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
                <span className="sr-only">Create folder</span>
            </Button>
        </form>
    );
}
