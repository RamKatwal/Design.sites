import { Header } from "@/features/common/Header"
import { getSections } from "@/features/lib/getSections"
import { SectionGrid } from "@/features/sections/SectionGrid"
import { sanityClient } from "@/sanity/client"
import { searchDataQuery } from "@/sanity/queries"

// Always use fresh searchParams so section filter from search bar works
export const dynamic = "force-dynamic"

type SearchParams = {
    q?: string
    section?: string
}

export default async function SectionsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const q = params.q
    // Section filter from search bar: ?section=faqs etc.
    const rawSection = params.section
    const sectionSlug =
        rawSection && rawSection !== "null" && rawSection !== "all"
            ? rawSection
            : undefined

    // Fetch section types for page title only (filter is in header search bar)
    const searchData = await sanityClient.fetch(searchDataQuery)
    const sectionTypes = searchData.sectionTypes || []

    // Fetch sections; when sectionSlug is set, only sections of that type
    const sections = await getSections({
        q,
        sectionSlug,
    })

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Header />

            <main className="w-full px-4 pt-20 max-w-[2000px] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {sectionSlug
                            ? `${sectionTypes.find((t: { slug: string; name: string }) => t.slug === sectionSlug)?.name ?? "Section"}s`
                            : "All Sections"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {sections.length} result{sections.length === 1 ? "" : "s"}
                    </p>
                </div>

                <SectionGrid sections={sections} />
            </main>
        </div>
    )
}
