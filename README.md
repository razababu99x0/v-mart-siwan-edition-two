# V-Mart Siwan — Style in Motion

A complete, responsive fashion-commerce concept for the supplied Siwan branch. Built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, Motion, React Three Fiber / Drei / Three.js, Radix primitives with shadcn-style components, Lucide, Embla, PostgreSQL and Drizzle.

## Design system
See `DESIGN_SYSTEM.md` for the art direction, exact palette, typography, spacing, elevation, motion, accessibility rules and anti-patterns. Fonts and campaign imagery are self-hosted in `public/`. Hindi is supported with a local Devanagari font. Reduced-motion preferences are respected across Motion and the 3D scene.

## Features
- Sticky glass navigation, persistent language preference, expandable search and mobile menu.
- Cinematic campaign hero, genuinely draggable 3D shopping bag, static fallback and magnetic actions.
- Photo collections, server-backed catalogue, price / category / size filtering and sorting.
- Product pages with two views, image zoom, size guides, colour and size stock, fabric / care, related styles and PIN-code delivery checks.
- PostgreSQL-backed anonymous cart and wishlist; variant-aware quantities and server stock checks.
- Shoppable lookbook hotspots, festive campaign, catalogue-driven budget cards and a local store map, directions and click-to-call.
- Three-step guest checkout with delivery / illustrative pickup, mock UPI, card and netbanking methods, failure simulation, transactional demo inventory updates and reloadable session-private order confirmations.
- Persisted newsletter opt-ins, support dialogs, bilingual content and keyboard focus restoration.

## Edition 02 upgrade
The upgraded design system is documented in `DESIGN_EDITION_02.md`; its presentation layer is `src/app/edition-two.css`.
- Visitor-controlled Everyday / Celebration hero campaigns and a genuine 3D atelier with three metallic finishes, studio / after-dark lighting, keyboard orbit controls and reset.
- The Style Studio curates in-stock catalogue products by category, mood and a strict per-piece price ceiling. Anonymous preferences persist in the `style_profiles` table and can be deleted. The `/api/style` endpoint never uses AI profiling.
- Two shoppable editorial looks open a variant-aware outfit builder. `/api/shop` action `addMany` is atomic: an invalid piece leaves the entire cart unchanged.
- Shareable category, price, size and sorting parameters; recent browsing history stored only in the browser with a clear-history control.
- ⌘/Ctrl-K and `/` open search; a mobile shopping dock and contextual product purchase bar improve one-handed browsing.

## Configuration
- `DATABASE_URL` is required for PostgreSQL and is read in `src/db/index.ts`.
- Optionally set `NEXT_PUBLIC_SITE_URL` to the deployed origin for canonical social-image URL resolution.
- No payment credentials, API keys, or financial data are required or collected.

The platform-managed runtime bootstraps the database. Once it is ready, apply tables using `npx drizzle-kit push`. The catalogue seeds on first database-backed catalogue access.

## Content editing
- Catalogue, prices, variants, category images and store details: `src/lib/catalog.ts` (initial seed).
- Persisted catalogue: `products.data` JSONB, accessed only via Drizzle.
- Home campaigns and lookbook composition: `src/components/home-page.tsx`.
- Policy and support copy: `src/components/footer.tsx`.
- Core visual styling: `src/app/globals.css`, `commerce.css`, and `refinements.css`.

Changing seed data does not overwrite existing product rows or placed orders. Apply intended catalogue updates through a Drizzle-backed script or an authenticated administration system before a live deployment.

## Validation
Run the following from the project root:
1. `npx next typegen`
2. `npm exec tsc -- --noEmit --pretty false`
3. `npm run build`
4. Use the platform's `build_and_start` tool for the managed server and `/api/health` check.

Browser scripts, with the managed preview running:
- `node scripts/visual-check.cjs` — desktop/mobile snapshots and JavaScript diagnostics.
- `node scripts/commerce-check.cjs` — search, filters, wishlist/cart persistence, guest checkout, simulated payment failure and recovery, private order receipts, product views, mobile navigation and language selection.
- `node scripts/accessibility-check.cjs` — WCAG A/AA audits of the storefront, product page, checkout, search and cart.
- `node scripts/upgrade-check.cjs` — Edition 02 campaign, 3D, style-profile, outfit, URL-filter, history and mobile acceptance tests.
- `node scripts/upgrade-a11y.cjs` — accessibility audits of every added styling and discovery experience.

Browser checks require Playwright Chromium and its system dependencies. Reports and screenshots are written to `artifacts/`. Tests use fictional example.test email addresses and anonymous sessions.

## Prototype boundary
This is a design and commerce prototype, not an assertion of official affiliation or operational integration with V-Mart Retail. Catalogue photography, products, pricing, stock, online promotions, delivery estimates and pickup are illustrative. The payment flow is clearly simulated, does not contact Razorpay, does not collect real financial credentials, and never charges money. No real order is sent to the store. The gallery is explicitly labelled illustrative campaign imagery, not verified branch photography. Real store contact details are displayed as supplied and corroborated by public listings.

Before any real commercial launch, integrate an authorised live catalogue, payment gateway, inventory and fulfilment service; provide verified branch assets; and have store policies, legal notices and affiliation approved.
