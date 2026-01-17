"use client"

import * as React from "react"
import { sanityClient } from "@/sanity/client"
import { searchDataQuery } from "@/sanity/queries"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"   
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type item = {
  _id: string
  name: string
  slug: string
}

export function Searchcombobox() {

 
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"category" | "font" | "style">("category")
  const [categories, setCategories] = React.useState<item[]>([])
  const [fonts, setFonts] = React.useState<item[]>([])
  const [styles, setStyles] = React.useState<item[]>([])


  // 🔑 Keyboard shortcut: S
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || 
                      target.tagName === "TEXTAREA" || 
                      target.isContentEditable ||
                      target.closest("input") ||
                      target.closest("textarea")
      
      // Don't trigger if dialog is already open
      if (open) return
      
      // Only trigger if not typing in input and key is 's' without modifiers
      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  // 📦 Fetch categories from Sanity
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await sanityClient.fetch(searchDataQuery)
      setCategories(data.categories)
      setFonts(data.fonts)
      setStyles(data.styles)
    }

    fetchData()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full md:w-[400px] justify-between"
      >
        <span className="text-sm">Search</span>
        <Kbd className="opacity-50">S</Kbd>
      </Button>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        className="max-w-[600px]"
      >
        <CommandInput placeholder="Type a keyword or search..." />

        {/* Tabs (Category only for now) */}
        <div className="flex h-10 items-center gap-2 border-b px-3">
            {["category", "font", "style"].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                    "rounded-sm px-3 py-1.5 text-sm transition-colors capitalize",
                    activeTab === tab
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                >
                {tab}
                </button>
            ))}
            </div>

            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {activeTab === "category" && (
                    <CommandGroup heading="Categories">
                    {categories.map((item) => (
                        <CommandItem key={item._id}>
                        {item.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                )}

                {activeTab === "font" && (
                    <CommandGroup heading="Fonts">
                    {fonts.map((item) => (
                        <CommandItem key={item._id}>
                        {item.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                )}

                {activeTab === "style" && (
                    <CommandGroup heading="Styles">
                    {styles.map((item) => (
                        <CommandItem key={item._id}>
                        {item.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                )}
                </CommandList>

      </CommandDialog>
    </>
  )
}
