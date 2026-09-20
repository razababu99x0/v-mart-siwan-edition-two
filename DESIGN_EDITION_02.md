# V-Mart Siwan / Edition 02 — More you. More motion.

## Upgrade intent
Preserve the scarlet, cinema-black and warm-paper identity while making the storefront feel like an interactive fashion magazine. Add personality and depth, not gratuitous animation or noisy widgets. Keep the original section sequence and all working commerce flows.

## Visual system
- Cinema black #0C0C0E anchors the hero, 3D atelier and styling invitation.
- V-Mart red #E11D48 remains the single strong action accent; #F34467 is an illuminated highlight on black, not a replacement brand colour.
- Warm paper #F7F6F2 keeps catalogue browsing restful.
- Champagne #D9BE9A adds restrained editorial warmth to labels on dark backgrounds and the bag's handles.
- Silver #D4D4D8 provides metallic contrast in the configurable 3D scene.
- Readable secondary text uses #645A56 on light backgrounds and #C1B5BA on dark backgrounds. Never use tiny, low-contrast copy to simulate luxury.

Typography remains self-hosted Barlow Condensed for expressive uppercase display, DM Sans for navigation and shopping, and Noto Sans Devanagari for Hindi. Restrained Georgia italic provides editorial contrast. Increase hero presence, use 12–14px product metadata and 14–16px body copy, and maintain a sensible mobile hierarchy.

Spacing: 4/8/12/16/24/32/48/64/80/112px. Desktop gutters 64px, mobile 20px. Editorial cards 20–24px radii, tactile controls 8–12px, circular icon targets at least 44px. Hairlines and multi-layer soft shadows replace heavy boxes. Keep the 1440px content cap.

## Signature additions
1. A cinematic two-mood hero: visitor-controlled Everyday / Celebration campaigns, re-art-directed existing custom photography, detail crops, restrained pointer light and genuine 3D object. No autoplay slideshow, sounds, or false urgency.
2. The 3D atelier: scarlet, silver and champagne finishes; orbit gestures; keyboard rotation and reset; lighting preference. Fixed initial orientation ensures the brand mark is readable. Motion drives a short idle turn and respects reduced motion. Demand rendering, lazy loading, lower mobile DPR and WebGL fallback remain.
3. Style Studio: category, mood and budget choices produce transparent, deterministic recommendations from currently available catalogue variants. PostgreSQL stores preferences for the anonymous session. Saved picks can be revisited or deleted. Never pretend this is AI body analysis or a live store stock feed.
4. Build the look: switch between editorial looks; choose individual product variants; select or exclude pieces; see the exact running total; add all selected pieces in one atomic, server-validated operation. No fabricated bundle discount.
5. Better browsing: remembered recently viewed styles with a clear-history action, a mobile shopping dock, desktop keyboard search shortcuts and a contextual product purchase bar.

## Motion
All visual animation uses Motion: shared-layout campaign tabs, gentle 0.45s editorial crossfades, limited pointer-follow springs, card detail reveals, short progressive step transitions and drawer springs. Scene orbit gestures use Drei. No autoplay carousel and no scroll hijacking. Respect prefers-reduced-motion for parallax, magnetic buttons, entrance transforms and idle 3D movement. Avoid layout shifts when loading preferences, images or scene bundles.

## Accessibility and safety
Real buttons and labelled inputs, correct dialog focus restoration, semantic step progress, visible focus rings, aria-live success and error messages, 44px touch targets and safe-area bottom padding. Keep mobile controls out of checkout's way. All recommended products and bundle prices use canonical server data, and all cart quantities are validated as integers against stock. Preferences can be deleted. Browsing history is device-local and clearable. Payment remains explicitly a simulation, with no real credentials collected.

## Verification
Check new flows alongside the existing acceptance suite: save and reload style profile; budget/category correctness; clear a profile; whole-look transaction success and all-or-nothing failure; 3D material and keyboard controls; recently viewed persistence and clearing; mobile dock and product purchase bar; keyboard search; contrast and overflow at mobile and desktop sizes. Finish with route type generation, TypeScript, production compilation and the platform healthcheck.
