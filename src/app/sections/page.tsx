import { Header } from "@/features/common/Header"
import { getSections } from "@/features/lib/getSections"
import { SectionGrid } from "@/features/sections/SectionGrid"
import { SectionTypeList } from "@/features/sections/SectionTypeList"
import { sanityClient } from "@/sanity/client"
import { searchDataQuery } from "@/sanity/queries"
import { Suspense } from "react"

export const revalidate = 120

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
    const sectionSlug = params.section

    // Fetch sections based on filters
    const sections = await getSections({
        q,
        sectionSlug,
    })

    // Fetch section types for the sidebar
    const searchData = await sanityClient.fetch(searchDataQuery)
    const sectionTypes = searchData.sectionTypes || []


    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Header />

            <main className="w-full px-4 pt-20 max-w-[2000px] mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filter List */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24">
                            <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                                <SectionTypeList sectionTypes={sectionTypes} />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {sectionSlug && sectionSlug !== 'all'
                                    ? `${sectionTypes.find((t: any) => t.slug === sectionSlug)?.name || 'Section'}s`
                                    : 'All Sections'}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {sections.length} result{sections.length === 1 ? '' : 's'}
                            </p>
                        </div>

                        <SectionGrid sections={sections} />
                    </div>
                </div>
            </main>
        </div>
    )
}
