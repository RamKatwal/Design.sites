import Link from 'next/link';
import { Suspense } from 'react';
import { SearchBox } from './SearchBox';

export function Header() {
    return (
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
                >
                    Design<span className="text-blue-600">.Sites</span>
                </Link>
                <div className="flex-1 max-w-md ml-8">
                    <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />}>
                        <SearchBox />
                    </Suspense>
                </div>
                <div className="hidden sm:block w-8"></div>
            </div>
        </header>
    );
}
