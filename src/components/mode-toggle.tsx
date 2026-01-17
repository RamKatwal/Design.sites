"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    React.useEffect(() => {
        function handlekeyDown(event: KeyboardEvent) {
            // Don't trigger if user is typing in an input field
            const target = event.target as HTMLElement
            const isInput = target.tagName === "INPUT" || 
                            target.tagName === "TEXTAREA" || 
                            target.isContentEditable ||
                            target.closest("input") ||
                            target.closest("textarea")
            
            // Only trigger if not typing in input and key is 'd' without modifiers
            if (event.key.toLowerCase() === 'd' && !event.ctrlKey && !event.metaKey && !isInput) {
                event.preventDefault()
                setTheme(theme === "dark" ? "light" : "dark")
            }
        }
        document.addEventListener('keydown', handlekeyDown)

        return () => {
            document.removeEventListener('keydown', handlekeyDown)
        }

    }, [theme, setTheme])

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
