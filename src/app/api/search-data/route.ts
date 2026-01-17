import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/client'
import { searchDataQuery } from '@/sanity/queries'

export async function GET() {
  try {
    const data = await sanityClient.fetch(searchDataQuery)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching search data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search data' },
      { status: 500 }
    )
  }
}
