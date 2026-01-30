"use client"

import { BlogItem } from "@/features/lib/getBlogs"
import { BlogCard } from "./BlogCard"

type BlogGridProps = {
    blogs: BlogItem[]
}

export function BlogGrid({ blogs }: BlogGridProps) {
    if (blogs.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                No blogs found
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
            {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>
    )
}
