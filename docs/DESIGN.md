# Growth / Connected Life — Design & Implementation Notes

## Brand floor
- Core background: `#0d1711` / `#14221b`
- Primary brand accent: `#b9f26b`
- Light editorial surface: `#f2f1e9`
- Text and borders: derived from existing Growth graphite/forest palette.
- Typography: native system sans for display and UI; SF Mono/Menlo for small technical labels.
- Tone: direct, human, confident. Show problems in a recognisable scene, not a long feature list.

## Page architecture
1. Problem-first editorial hero and layered connected-life interface.
2. Disorganised financial traces resolving into a review state.
3. Personal, Casa and Viaje workspaces; keyboard-accessible tabs.
4. MCP-ready future vision shown as deterministic authorized-context demo.
5. Explicit individual/shared permissions and privacy.
6. Real iPhone/Mac captures, platforms clearly marked current versus vision.
7. Roadmap disclosure + real GitHub development CTA.

## Motion rules
- Four visual devices across the visitor journey: dimensional hero, consolidation, interactive workspace, authorized chat.
- One showcase peak at the MCP-context scene. No cursor hijack, no autoplaying sound or endless preloader.
- Animations use transforms/opacity, single Lenis instance with GSAP ticker, ScrollTrigger refresh on load/fonts.
- Native scroll on touch and reduced motion. Source content must remain visible without animation libraries.
- No pinned scroll sections that inject large blank areas or layout shifts.

## Runtime
Files introduced: `assets/styles/vision.css`, `assets/scripts/vision.js`.
The `index.html` points to them and the pre-existing vendored GSAP/ScrollTrigger/Lenis.
Other repository contents, including `privacy/` and the prior CSS/JS, remain unchanged.
No dependencies, build step, analytics, external fonts or data requests.

## Editorial and product truth
The site is a **product-vision prototype**.
The workspaces, financial contextual assistant, granular permissions, financial account imports and new client platforms are future concepts.
All amounts and participant avatars are fictional examples.
No AI model, MCP server, bank sync, account reconciliation or live financial calculation runs in the landing. The CTA does not collect emails or pretend to download unavailable apps.

## Developer check
- `index.html`: new narrative & semantic landmarks.
- `vision.css`: responsiveness and focus-visible/reduced-motion styling.
- `vision.js`: no network calls, deterministic demo state, optional animations.
- Verify on browser widths 390, 768 and 1440; keyboard Tab and arrows; reduced motion; CTA URL.
