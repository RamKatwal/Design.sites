"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type SectionType = {
    _id: string
    name: string
    slug: string
    count?: number
}

type SectionTypeListProps = {
    sectionTypes: SectionType[]
}

export function SectionTypeList({ sectionTypes }: SectionTypeListProps) {
    const searchParams = useSearchParams()
    const currentSection = searchParams.get("section")


    return (
        <div className="flex flex-col gap-1 pr-4">
            <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                Sections
            </h3>
            <div className="flex flex-col gap-1">
                <Link
                    href="/sections"
                    className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                        !currentSection || currentSection === "all"
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground"
                    )}
                >
                    All Sections
                </Link>
                {sectionTypes.map((type) => {
                    const isActive = currentSection === type.slug
                    return (
                        <Link
                            key={type._id}
                            href={`/sections?section=${type.slug}`}
                            className={cn(
                                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                                isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <span>{type.name}</span>
                            {type.count !== undefined && (
                                <span className="text-xs text-muted-foreground">
                                    {type.count}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
