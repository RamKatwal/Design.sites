You are working on the frontend of “Design.sites” (Next.js App Router + TypeScript + Tailwind + shadcn/ui).

## Context
We already have:
- A Home page that shows a grid of websites.
- A shared Search/Filter component (Searchcombobox) used to filter websites by query params (e.g. category/font/style).
- Data comes from Sanity.
- Website documents include a field `sections` (array) where each item has:
  - sectionType (reference -> sectionType { name, slug })
  - image (Sanity image)
  - label (optional string)

We also have Sanity `sectionType` documents:
- name
- slug

## Goal
Add a new navigation/filter experience for Sections:
1) In the Header, add a new nav item/button: “Sections”.
2) Clicking it navigates to `/sections`.
3) `/sections` shows by default “All” sections (all websites’ section images).
4) On `/sections`, show a list of section types (All, Hero, FAQs, Footer, Products, etc.) as filter tabs or sidebar list.
5) When a section type is selected:
   - filter is applied (via URL query param, e.g. `?section=hero`)
   - only show images for that selected section type across all websites
6) When “Hero” is clicked, show only hero section images across websites.
7) Use the SAME search filter component pattern already used in the app:
   - integrate section filter into Searchcombobox
   - in the filter dropdown, show the list of section types
   - selection updates URL query params and triggers server fetch (no client-side full filtering)

## UI Requirements
- Use shadcn/ui components.
- Layout:
  - Header stays consistent with the existing site.
  - `/sections` page: top area includes Searchcombobox
  - left sidebar or horizontal tabs for section type list (All + types)
  - main area shows grid of section images (like the current websites grid)
- Each grid item should show:
  - section image
  - website name (overlay on hover)
  - section type name (small badge)
  - optional: click opens the website detail page or external URL (choose one and implement)

## Data + Fetching Requirements
- Create a server-side function `getSections({ q?, sectionSlug? })` that fetches from Sanity:
  - website name, slug, url
  - sections[] with sectionType { name, slug } and section image
- If `sectionSlug` is present:
  - only return websites’ sections matching that slug
- If `sectionSlug` is not present or equals "all":
  - return all sections
- Also fetch all `sectionType` documents for the filter list.

## Routing + Query Param Rules
- `/sections` -> default (all)
- `/sections?section=hero` -> filtered
- Preserve existing `q` param behavior if already used.
- Implement using Next.js server components:
  - `app/sections/page.tsx` is a Server Component
  - read `searchParams`
  - pass data to client components only if needed

## Components to implement
- `Header` update: add “Sections” nav item (active state).
- `SectionsPage` (server): fetch section types + filtered section images.
- `SectionTypeList` (client or server): list of section types, updates query param.
- Update `Searchcombobox`:
  - add a new filter group “Sections”
  - items loaded from section types
  - selecting one sets `section=<slug>`

## Deliverables
Output the full code for:
1) `lib/getSections.ts` (Sanity GROQ query + types)
2) `app/sections/page.tsx`
3) UI components under `features/sections/`:
   - `SectionTypeList.tsx`
   - `SectionGrid.tsx`
4) Update to existing `Searchcombobox` to include section types
5) Update to `Header` nav

## Notes
- Keep code consistent with existing project patterns (features folder, shadcn components, `cn` utility).
- Use `next/navigation` for query param updates.
- Make sure filtering works through URL (shareable links).
- Use Suspense if needed.
