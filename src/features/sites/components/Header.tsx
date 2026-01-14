import Link from 'next/link';
import { Suspense } from 'react';
import { SearchBox } from './SearchBox';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
    return (
        <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="w-full px-[40px] h-18 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-foreground hover:text-muted-foreground transition-colors"
                >
                    Design<span className="text-blue-600">.Sites</span>
                </Link>
                <div className="flex-1 max-w-md ml-8">
                    <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />}>
                        <SearchBox />
                    </Suspense>
                </div>
                <div className="ml-4">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
