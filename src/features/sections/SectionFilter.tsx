"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

type SectionType = {
    _id: string
    name: string
    slug: string
    count?: number
}

interface SectionFilterProps {
    sectionTypes: SectionType[]
}

export function SectionFilter({ sectionTypes }: SectionFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentSection = searchParams.get("section")


    React.useEffect(() => {
        if (currentSection && currentSection !== 'all') {
            setValue(currentSection)
        } else {
            setValue("")
        }
    }, [currentSection])


    const onSelect = (currentValue: string) => {
        // If clicking the same value, clear it (toggle off) - though typically select implies set.
        // Let's stick to set new value.
        if (currentValue === value) {
            // Optional: clear if same? Let's say no for now, or maybe yes like a toggle.
            // Let's allow clearing by selecting "All" explicitely in the list if we add it, or just keep as is.
            // Actually, let's treat it as a selector.

            // If they click the same one, maybe ensure it's set.
        }

        setValue(currentValue === value ? "" : currentValue)
        setOpen(false)

        const params = new URLSearchParams(searchParams.toString())
        if (currentValue === value) {
            params.delete("section")
        } else {
            params.set("section", currentValue)
        }
        router.push(`/sections?${params.toString()}`)
    }

    const clearFilter = () => {
        setValue("")
        setOpen(false)
        const params = new URLSearchParams(searchParams.toString())
        params.delete("section")
        router.push(`/sections?${params.toString()}`)
    }

    const selectedType = sectionTypes.find((type) => type.slug === value)

    return (
        <div className="flex items-center space-x-4 w-full max-w-sm">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? selectedType?.name || "Select section..." // fallback if slug matches but data missing (rare)
                            : "Search sections..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search sections..." />
                        <CommandList>
                            <CommandEmpty>No section found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value="all"
                                    onSelect={clearFilter}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === "" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    All Sections
                                </CommandItem>
                                {sectionTypes.map((type) => (
                                    <CommandItem
                                        key={type.slug}
                                        value={type.slug}
                                        onSelect={(val) => onSelect(type.slug)} // passing slug as value to match state
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === type.slug ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {type.name}
                                        {type.count !== undefined && (
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                {type.count}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
