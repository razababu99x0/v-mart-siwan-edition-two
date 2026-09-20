# V-Mart Siwan — Style in Motion

## Creative direction
Cinematic Indian fashion editorial meets an approachable neighbourhood department store. The visual signature is oversized condensed headlines, warm-white retail surfaces, carefully art-directed photography, scarlet action accents, and one polished interactive chrome-red shopping bag. Luxury comes from composition, restraint, and typography—not visual clutter. Campaign images are concept imagery; the storefront is explicitly a commerce prototype, not an assertion of affiliation or live inventory.

## Palette and reasoning
- V-Mart rose / #E11D48: the locked brand accent. Use on primary actions, headline punctuation, active filters, and small signals. White-on-rose satisfies AA for normal labels. Do not fill every card with red.
- Cinema black / #0C0C0E: hero, navigation, footer. Subtle #42111C radial light creates depth without purple gradients.
- Ink / #18181B: light-surface copy and headlines.
- Warm paper / #F7F6F2: shopping backdrop. More tactile and editorial than cold white.
- Pure white / #FFFFFF: product surfaces and inverse text.
- Muted ink / #64646B: secondary copy on paper; use #B6B3B5 on black.
- Silver / #D4D4D8: hairline borders, metallic 3D detail, secondary dark-surface accents.
- Champagne / #CCB28B: tiny editorial accents and festive highlights, never body text on white.

## Typography
Barlow Condensed 600/700/800 for expressive uppercase campaign headlines. DM Sans 400/500/600/700 for navigation, body, product names and prices. Georgia italic as a sparing editorial contrast in lookbook statements. Hero: clamp(64px, 7.5vw, 112px), line-height .94, tracking -.01em. Section headlines: 40–56px, line-height 1.02. Body: 14–16px, line-height 1.6. Utility overlines: 10–12px, weight 600, tracking .16em. Prices: tabular numerals.

## Layout and spacing
4px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 80, 112. Maximum content width 1440px. Desktop gutters 64px; tablet 32px; mobile 20px. Desktop: four-column products/categories, 12-column editorial grids. Mobile: two-column products, two-column categories, stacked story panels. Section padding 80–104px desktop / 48–64px mobile. Card radii 16–24px, pills fully rounded, action buttons 8px. Deliberate asymmetry in the hero and lookbook.

## Elevation
Level 0: paper + thin #E5E3DF border. Level 1: 0 4px 20px rgba(18,18,20,.04). Level 2: 0 12px 40px rgba(18,18,20,.10). Level 3: 0 24px 80px rgba(0,0,0,.24). Dark glass: rgba(20,20,24,.62), backdrop blur 20px, white 12% border. Hover glows restricted to the hero and category cards. Small clay-like floating labels use soft inner highlights, not cartoon bevels.

## Motion system
Motion is the sole animation engine. Micro interactions: spring stiffness 350, damping 28; drawers: stiffness 300, damping 32. Entrance reveals: y 20, opacity 0 to 1, 0.5 seconds with 60ms stagger. Hover lift maximum 4px and image scale maximum 1.04. Hero 3D is lazy, visibility-aware, device-pixel-ratio capped, demand-rendered, drag-orbitable and optional. Motion values drive scroll-linked parallax; no scroll hijacking. All use reduced-motion checks; decorative motion stops with prefers-reduced-motion. No CSS keyframe bounce or infinite attention traps.

## Components
Sticky dark glass navigation, scarlet brand mark, branch badge, location pill, expandable search, accessible Radix/shadcn-style dialogs, tactile primary buttons, outlined secondary actions, quiet pill filters, cinematic photograph category cards, clean quick-add product cards, full-height cart sheet, generous guest checkout steps. Product and variant data is canonical on the server. Cart and wishlist persist by anonymous cookie in PostgreSQL. Prices and stock are rechecked at checkout.

## Accessibility
WCAG AA contrast or better; visible 3px focus outlines; 44px touch targets; semantic headings and landmarks; meaningful image alt text; real buttons and links; full keyboard navigation; Radix dialog focus trap and restoration; named icon buttons; aria-live cart and form feedback; no colour-only state; labelled form fields; input autocomplete; no autoplay sound. Progressive hero fallback appears before WebGL. Product information remains usable without 3D. Form errors are readable and checkout is always labelled prototype.

## Avoid
Purple/blue gradients, fake scarcity, countdowns, autoplay audio, CSS-only bounce, hidden navigation, generic dashboard cards, stock-photo walls, unreadable glass text, endless page loaders, blocky Bootstrap layouts, fake trust metrics, unsupported delivery promises, payment credential collection in a prototype, and invented official store photographs.

## Commerce scope
Demonstration catalogue with stock by size and colour. Persistent cart/wishlist, product detail routes, filters/search, PIN validation, delivery/pickup preference, variant-aware cart, multi-step guest checkout and explicitly simulated UPI/card/netbanking. Never request real financial credentials. The supplied Siwan address, hours and telephone are displayed as supplied; directions use Google Maps. Catalogue and campaign photography is illustrative. Newsletter opt-ins and prototype orders are stored with Drizzle/PostgreSQL.
