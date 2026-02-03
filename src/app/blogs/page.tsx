import { Header } from "@/features/common/Header"
import { getBlogs } from "@/features/lib/getBlogs"
import { BlogGrid } from "@/features/blogs/BlogGrid"

export const dynamic = "force-dynamic"

export default async function BlogsPage() {
    const blogs = await getBlogs()

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Header />

            <main className="w-full px-4 pt-18 max-w-[2000px] mx-auto">
                {/* <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
                    <p className="text-muted-foreground mt-1">
                        {blogs.length} result{blogs.length === 1 ? "" : "s"}
                    </p>
                </div> */}

                <BlogGrid blogs={blogs} />
            </main>
        </div>
    )
}
