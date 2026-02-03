"use client"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Highlighter } from "@/components/ui/highlighter"
import { DotPattern } from "@/components/ui/dot-pattern"
import { BlogItem } from "@/features/lib/getBlogs"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

type BlogCardProps = {
    blog: BlogItem
}

export function BlogCard({ blog }: BlogCardProps) {
    const addedOnFormatted = blog.addedOn
        ? new Date(blog.addedOn).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : null

    const highlights = blog.notes?.filter((n) => n.highlight) ?? []

    return (
        <Drawer direction="bottom">
            <DrawerTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "group relative flex aspect-[20/8] w-full flex-col justify-end overflow-hidden",
                        "rounded-sm border border-muted-foreground/20 bg-background text-left shadow-xs",
                        "transition-all duration-300 cursor-pointer p-5"
                    )}
                >
                    <DotPattern
                        width={15}
                        height={15}
                        cx={1}
                        cy={1}
                        cr={1}
                        className={cn(
                            "text-muted-foreground/50",
                            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_2%,transparent_100%)]"
                        )}
                    />
                    <span className="relative text-xl font-bold tracking-tight text-foreground sm:text-sm">
                        {blog.title}
                    </span>
                    <span className="relative mt-1 text-xs font-normal italic text-muted-foreground">
                        {blog.authorName}
                    </span>
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-lg overflow-y-auto max-h-[80vh]">
                    <DrawerHeader>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <DrawerTitle className="text-lg text-foreground truncate">
                                    {blog.title}
                                </DrawerTitle>
                                {blog.siteLink && (
                                    <a
                                        href={blog.siteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition"
                                        aria-label="Visit site"
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-col items-start text-sm text-muted-foreground">
                                <p className="text-sm italic text-muted-foreground mt-0.5">
                                    {blog.authorName}
                                </p>
                                {addedOnFormatted && (
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Added on {addedOnFormatted}
                                    </p>
                                )}
                            </div>
                        </div>
                    </DrawerHeader>
                    <div className="px-4 pb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                            Notes (Highlights)
                        </h3>
                        {highlights.length > 0 ? (
                            <ul className="space-y-3 text-sm text-foreground list-none pl-0">
                                {highlights.map((item, i) => (
                                    <li key={item._key ?? i}>
                                        <Highlighter
                                            action="highlight"
                                            color="#87CEFA"
                                            isView={true}
                                        >
                                            {item.highlight}
                                        </Highlighter>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No notes or highlights.
                            </p>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
