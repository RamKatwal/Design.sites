import { Header } from "@/features/common/Header"
import { SiteGrid } from "@/features/common/SiteGrid"
import { getSites } from "@/features/lib/getSites"

export const revalidate = 120

type SearchParams = {
  q?: string
  category?: string | string[]
  font?: string | string[]
  style?: string | string[]
}

function normalizeParam(param?: string | string[]) {
  if (!param) return []
  return Array.isArray(param) ? param : [param]
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // ✅ REQUIRED in modern Next.js
  const params = await searchParams

  const category = normalizeParam(params.category)
  const font = normalizeParam(params.font)
  const style = normalizeParam(params.style)

  const sites = await getSites({
    q: params.q,
    category: category.length ? category : undefined,
    font: font.length ? font : undefined,
    style: style.length ? style : undefined,
  })

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />

      <main className="w-full px-4 pt-18">
        <SiteGrid sites={sites} />
      </main>
    </div>
  )
}
