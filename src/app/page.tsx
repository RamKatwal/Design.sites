import { Suspense } from "react"
import { Header } from "@/features/common/Header"
import { SiteGrid } from "@/features/common/SiteGrid"
import { getSites } from "@/features/lib/getSites"

// Force dynamic rendering to ensure searchParams are always fresh
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string | string[]
    font?: string | string[]
    style?: string | string[]
  }>
}) {
  // Await the searchParams Promise
  const params = await searchParams
  
  // Debug: Log searchParams
  console.log('📄 Page searchParams:', params)
  
  // Normalize arrays - Next.js can return single values or arrays
  const categoryArray: string[] = Array.isArray(params.category) 
    ? params.category 
    : params.category 
    ? [params.category] 
    : []
  const fontArray: string[] = Array.isArray(params.font)
    ? params.font
    : params.font
    ? [params.font]
    : []
  const styleArray: string[] = Array.isArray(params.style)
    ? params.style
    : params.style
    ? [params.style]
    : []
  
  const sites = await getSites({
    q: params.q,
    category: categoryArray.length > 0 ? categoryArray : undefined,
    font: fontArray.length > 0 ? fontArray : undefined,
    style: styleArray.length > 0 ? styleArray : undefined,
  })

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />
      <main className="w-full px-4 pt-18">
        <Suspense fallback={<div>Loading...</div>}>
          <SiteGrid sites={sites} />
        </Suspense>
      </main>
    </div>
  )
}
