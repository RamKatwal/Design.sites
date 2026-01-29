"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const isSectionsPage = pathname === "/sections"

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
    if (type === "section") {
      // Section URL param can be slug or _id
      return items.filter((item) => {
        const v = (item.slug != null && String(item.slug).trim() !== "") ? item.slug : item._id
        return selected.includes(v)
      })
    }
    return items.filter((item) => selected.includes(item.slug))
  }

  const allSelectedItems = React.useMemo(() => {
    if (isSectionsPage) {
      return getSelectedItems("section")
    }
    return [
      ...getSelectedItems("category"),
      ...getSelectedItems("font"),
      ...getSelectedItems("style"),
    ]
  }, [isSectionsPage, selectedCategories, selectedFonts, selectedStyles, selectedSections, categories, fonts, styles, sectionTypes])

  const basePath = isSectionsPage ? "/sections" : "/"

  // Toggle filter selection
  function toggleFilter(type: FilterType, slug: string) {
    // Never set section (or any filter) to null/undefined/empty - would break filtering
    const validSlug = slug != null && String(slug).trim() !== "" ? String(slug) : null
    if (validSlug == null && type === "section") {
      // Clear section filter if slug is invalid
      const params = new URLSearchParams(searchParams.toString())
      params.delete("section")
      const query = params.toString()
      startTransition(() => router.replace(query ? `${basePath}?${query}` : basePath))
      return
    }
    const safeSlug = validSlug ?? ""

    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(type)

    if (currentValues.includes(safeSlug)) {
      // Remove if already selected
      params.delete(type)
      currentValues.filter((v) => v !== safeSlug).forEach((v) => params.append(type, v))
    } else {
      // On sections page, section filter is single-select; otherwise append
      if (isSectionsPage && type === "section") {
        params.set("section", safeSlug)
      } else {
        params.append(type, safeSlug)
      }
    }

    const query = params.toString()
    startTransition(() => {
      router.replace(query ? `${basePath}?${query}` : basePath)
    })
  }

  // Remove a specific filter
  function removeFilter(type: FilterType, slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(type).filter((v) => v !== slug)

    params.delete(type)
    currentValues.forEach((v) => params.append(type, v))

    const query = params.toString()
    startTransition(() => {
      router.replace(query ? `${basePath}?${query}` : basePath)
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
      router.replace(params.toString() ? `${basePath}?${params.toString()}` : basePath)
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

  // Clean section=null from sections page URL (treat as no filter)
  React.useEffect(() => {
    if (isSectionsPage && searchParams.get("section") === "null") {
      startTransition(() => router.replace("/sections"))
    }
  }, [isSectionsPage, searchParams, router])

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

  const getItemsForTab = (tab?: FilterType): item[] => {
    const t = tab ?? activeTab
    switch (t) {
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

  const tabsToShow: FilterType[] = isSectionsPage
    ? ["section"]
    : (["category", "font", "style"] as FilterType[])

  const effectiveActiveTab =
    isSectionsPage ? "section" : tabsToShow.includes(activeTab) ? activeTab : "category"

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full md:w-[400px] justify-between"
      >
        <span className="text-sm">{isSectionsPage ? "Sections" : "Search"}</span>
        <Kbd className="opacity-50">S</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[600px]">
        <CommandInput placeholder={isSectionsPage ? "Search sections..." : "Minimal, Inter, etc."} />

        {/* Selected Filters as Tags */}
        {allSelectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 py-2 border-b">
            {allSelectedItems.map((item) => {
              const type = isSectionsPage
                ? "section"
                : selectedCategories.includes(item.slug)
                  ? "category"
                  : selectedFonts.includes(item.slug)
                    ? "font"
                    : selectedStyles.includes(item.slug)
                      ? "style"
                      : "section"
              const filterValue = type === "section" ? (item.slug ?? item._id) : item.slug
              return (
                <div
                  key={`${type}-${filterValue}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm"
                >
                  <span>{item.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFilter(type, filterValue)
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

        {/* Tabs - only show when not on sections page */}
        {!isSectionsPage && (
          <div className="flex h-10 items-center gap-2 border-b px-3">
            {tabsToShow.map((tab) => (
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
        )}

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

              <CommandGroup heading={isSectionsPage ? "Sections" : getTabLabel(effectiveActiveTab)}>
                {getItemsForTab(effectiveActiveTab).length > 0 ? (
                  getItemsForTab(effectiveActiveTab).map((item) => {
                    // Use slug for URL when set, else _id so filtering still works
                    const value = (item.slug != null && String(item.slug).trim() !== "")
                      ? String(item.slug)
                      : item._id
                    const selected = isSelected(effectiveActiveTab, value)
                    return (
                      <CommandItem
                        key={item._id}
                        value={value || item.name}
                        onSelect={() => toggleFilter(effectiveActiveTab, value)}
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
                    {isSectionsPage ? "No sections found" : `No ${getTabLabel(effectiveActiveTab).toLowerCase()} found`}
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
