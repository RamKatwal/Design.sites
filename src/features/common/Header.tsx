"use client";

import Link from 'next/link';
import { Suspense, useEffect, useState, useRef } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Searchcombobox } from '@/components/searchcombobox';
import { cn } from '@/lib/utils';

export function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header if scrolling up or at the top
            // Hide header if scrolling down and not at the top
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border transition-transform duration-300",
                isVisible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className="w-full px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-md font-bold tracking-tight text-foreground hover:text-muted-foreground transition-colors shrink-0"
                >
                    Design.Web
                </Link>
                <div className="flex flex-1 justify-center px-2 md:px-4 max-w-md mx-auto">
                    <Suspense>
                        <Searchcombobox />
                    </Suspense>
                </div>
                <div className="shrink-0">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
