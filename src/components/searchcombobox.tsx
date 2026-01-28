"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { X } from "lucide-react"
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
  count?: number
}

type SearchData = {
  categories: item[]
  fonts: item[]
  styles: item[]
  sectionTypes: item[]
}

type FilterType = "category" | "font" | "style" | "section"

export function Searchcombobox() {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<FilterType>("category")
  const [categories, setCategories] = React.useState<item[]>([])
  const [fonts, setFonts] = React.useState<item[]>([])
  const [styles, setStyles] = React.useState<item[]>([])
  const [sectionTypes, setSectionTypes] = React.useState<item[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get selected filters from URL
  const selectedCategories = React.useMemo(
    () => searchParams.getAll("category"),
    [searchParams]
  )
  const selectedFonts = React.useMemo(
    () => searchParams.getAll("font"),
    [searchParams]
  )
  const selectedStyles = React.useMemo(
    () => searchParams.getAll("style"),
    [searchParams]
  )
  const selectedSections = React.useMemo(
    () => searchParams.getAll("section"),
    [searchParams]
  )

  // Get all selected items with their names
  const getSelectedItems = (type: FilterType): item[] => {
    const selected = type === "category" ? selectedCategories : type === "font" ? selectedFonts : type === "style" ? selectedStyles : selectedSections
    const items = type === "category" ? categories : type === "font" ? fonts : type === "style" ? styles : sectionTypes
    return items.filter((item) => selected.includes(item.slug))
  }

  const allSelectedItems = React.useMemo(() => {
    return [
      ...getSelectedItems("category"),
      ...getSelectedItems("font"),
      ...getSelectedItems("style"),
      ...getSelectedItems("section"),
    ]
  }, [selectedCategories, selectedFonts, selectedStyles, selectedSections, categories, fonts, styles, sectionTypes])

  // Toggle filter selection
  function toggleFilter(type: FilterType, slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(type)

    if (currentValues.includes(slug)) {
      // Remove if already selected
      params.delete(type)
      currentValues.filter((v) => v !== slug).forEach((v) => params.append(type, v))
    } else {
      // Add if not selected
      params.append(type, slug)
    }

    startTransition(() => {
      router.replace(`/?${params.toString()}`)
    })
  }

  // Remove a specific filter
  function removeFilter(type: FilterType, slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(type).filter((v) => v !== slug)

    params.delete(type)
    currentValues.forEach((v) => params.append(type, v))

    startTransition(() => {
      router.replace(`/?${params.toString()}`)
    })
  }

  // Reset all filters
  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("font")
    params.delete("style")
    params.delete("section")

    startTransition(() => {
      router.replace(`/?${params.toString()}`)
    })
  }

  // Check if item is selected
  function isSelected(type: FilterType, slug: string): boolean {
    const selected = type === "category" ? selectedCategories : type === "font" ? selectedFonts : type === "style" ? selectedStyles : selectedSections
    return selected.includes(slug)
  }

  // Keyboard shortcut: S
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("input") ||
        target.closest("textarea")

      if (open) return

      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  // Fetch categories, fonts, and styles from API route
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/search-data")

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const data: SearchData = await response.json()
        setCategories(data.categories || [])
        setFonts(data.fonts || [])
        setStyles(data.styles || [])
        setSectionTypes(data.sectionTypes || [])
      } catch (err) {
        console.error("Error fetching search data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
        setCategories([])
        setFonts([])
        setStyles([])
        setSectionTypes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getItemsForTab = (): item[] => {
    switch (activeTab) {
      case "category":
        return categories
      case "font":
        return fonts
      case "style":
        return styles
      case "section":
        return sectionTypes
    }
  }

  const getTabLabel = (tab: FilterType): string => {
    switch (tab) {
      case "category":
        return "Types"
      case "font":
        return "Fonts"
      case "style":
        return "Styles"
      case "section":
        return "Sections"
    }
  }

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

      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[600px]">
        <CommandInput placeholder="Minimal, Inter, etc." />

        {/* Selected Filters as Tags */}
        {allSelectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 py-2 border-b">
            {allSelectedItems.map((item) => {
              const type = selectedCategories.includes(item.slug)
                ? "category"
                : selectedFonts.includes(item.slug)
                  ? "font"
                  : selectedStyles.includes(item.slug)
                    ? "style"
                    : "section"
              return (
                <div
                  key={`${type}-${item.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm"
                >
                  <span>{item.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFilter(type, item.slug)
                    }}
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="flex h-10 items-center gap-2 border-b px-3">
          {(["category", "font", "style", "section"] as FilterType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-sm px-3 py-1.5 text-sm transition-colors capitalize flex items-center gap-1.5",
                activeTab === tab
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        <CommandList>
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive">{error}</div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading={getTabLabel(activeTab)}>
                {getItemsForTab().length > 0 ? (
                  getItemsForTab().map((item) => {
                    const selected = isSelected(activeTab, item.slug)
                    return (
                      <CommandItem
                        key={item._id}
                        onSelect={() => toggleFilter(activeTab, item.slug)}
                        className={cn(
                          "flex items-center justify-between cursor-pointer",
                          selected && "bg-muted"
                        )}
                      >
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2">
                          {item.count !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              {item.count > 0 ? item.count : "-"}
                            </span>
                          )}
                          {selected && (
                            <span className="text-xs text-primary">✓</span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No {getTabLabel(activeTab).toLowerCase()} found
                  </div>
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>

        {/* Footer with Reset and Done buttons */}
        <div className="flex items-center justify-between border-t px-3 py-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            disabled={allSelectedItems.length === 0}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180"
            >
              <path
                d="M8 3V1M8 3L6 1M8 3L10 1M3 8C3 5.79086 4.79086 4 7 4H13M13 4L11 2M13 4L11 6M13 8C13 10.2091 11.2091 12 9 12H3M3 12L5 10M3 12L5 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset
          </button>
          <Button onClick={() => setOpen(false)} size="sm">
            Done
          </Button>
        </div>
      </CommandDialog>
    </>
  )
}
