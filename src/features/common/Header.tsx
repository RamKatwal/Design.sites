"use client";

import Link from 'next/link';
import { Suspense, useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Searchcombobox } from '@/components/searchcombobox';
import { cn } from '@/lib/utils';
import { AuthButton } from '@/components/auth-button';
import { Menu } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from '@/components/ui/drawer';

const navLinks = [
    { href: '/sections', label: 'Sections' },
    { href: '/blogs', label: 'Blogs' },
] as const;

export function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [navOpen, setNavOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const lastScrollY = useRef(0);
    const supabase = createClient();

    useEffect(() => {
        const getInitial = async () => {
            const { data: { user: u } } = await supabase.auth.getUser();
            setUser(u ?? null);
        };
        getInitial();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

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
            <div className="w-full px-3 sm:px-4 h-14 flex items-center justify-between gap-2 min-w-0">
                {/* Left: logo + desktop nav */}
                <div className="flex items-center gap-4 md:gap-6 shrink-0 min-w-0">
                    <Link
                        href="/"
                        className="text-md font-bold tracking-tight text-foreground hover:text-muted-foreground transition-colors shrink-0"
                    >
                        Design.Web
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Center: search - allowed to shrink on mobile */}
                <div className="flex flex-1 justify-center px-1 sm:px-2 md:px-4 max-w-md mx-auto min-w-0">
                    <Suspense>
                        <Searchcombobox />
                    </Suspense>
                </div>

                {/* Right: actions + mobile menu trigger */}
                <div className="shrink-0 flex items-center gap-1 sm:gap-2">
                    {user && (
                        <Link href="/bookmarks">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground size-8 sm:size-9">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                            </Button>
                        </Link>
                    )}
                    <ModeToggle />
                    <AuthButton />

                    {/* Mobile nav drawer */}
                    <Drawer open={navOpen} onOpenChange={setNavOpen} direction="left">
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground size-8 sm:size-9">
                                <Menu className="size-5" aria-label="Open menu" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-full max-h-full w-[280px] rounded-none border-r data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:right-auto data-[vaul-drawer-direction=left]:mt-0">
                            <DrawerHeader className="border-b">
                                <DrawerTitle className="text-left">Menu</DrawerTitle>
                            </DrawerHeader>
                            <nav className="flex flex-col p-4 gap-1">
                                {navLinks.map(({ href, label }) => (
                                    <DrawerClose asChild key={href}>
                                        <Link
                                            href={href}
                                            className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
                                        >
                                            {label}
                                        </Link>
                                    </DrawerClose>
                                ))}
                            </nav>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
