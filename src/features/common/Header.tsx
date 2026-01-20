"use client";

import Link from 'next/link';
import { Suspense, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Searchcombobox } from '@/components/searchcombobox';
import { cn } from '@/lib/utils';
import { AuthButton } from '@/components/auth-button';

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
                <div className="flex items-center gap-6 shrink-0">
                    <Link
                        href="/"
                        className="text-md font-bold tracking-tight text-foreground hover:text-muted-foreground transition-colors"
                    >
                        Design.Web
                    </Link>
                </div>
                <div className="flex flex-1 justify-center px-2 md:px-4 max-w-md mx-auto">
                    <Suspense>
                        <Searchcombobox />
                    </Suspense>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                    <Link href="/bookmarks">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                        </Button>
                    </Link>
                    <ModeToggle />
                    <AuthButton />
                </div>
            </div>
        </header>
    );
}
