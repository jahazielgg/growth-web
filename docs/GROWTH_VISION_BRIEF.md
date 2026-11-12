# Growth — Connected Life / Creative & Product Brief
_Status: self-authored from the owner's explicit direction and conversations. Working concept; not a product release spec._

## Visitor and proposition
- **Who:** People whose financial life spans personal expenses, recurring commitments, shared households, trips, and their favorite productivity tools.
- **Existing tension:** Financial data is scattered, expensive to maintain manually, and difficult to connect to real decisions.
- **Belief to install:** "Growth could give my money one connected home, without asking me to become an accountant."
- **Next action:** Explore the vision, then follow the development on GitHub. Do not invent an email waitlist or download link.
- **Assets:** Preserve Growth green/forest identity, brand icon, real iPhone and Mac screenshots. Build illustrative product UIs as DOM, not static text baked into pictures.
- **Art direction:** Editorial, tactile digital-product realism, elegant spacing, high contrast; dark forest plus lime, light-paper interludes.
- **Platform:** Static HTML/CSS/JS already in the repository, GSAP ScrollTrigger and Lenis already vendored. No new runtime dependencies.
- **Limits:** The user wants future-looking concepts, not a landing confined to current functions. Always label visionary functionality accurately; no invented connection to real accounts.

## Design read (Frontend Atlas)
Direction: editorial product storytelling, cinematic but grounded.
Motion personality: restrained / confident, a purposeful progression.
Signature moment: the *authorized financial context* scene, where a visitor asks a question and sees exactly which financial context an assistant could use.
Supporting layer: layered hero, resolved fragments, workspace tabs, simple section entrances, focus/hover feedback.
Stack: semantic HTML + CSS + GSAP/ScrollTrigger/Lenis for progressive motion, because the existing project already uses it.

## Emotional curve / customer journey

| Beat | Visitor's emotion | How the interface creates it | Device family |
|---|---|---|---|
| Hero | Recognition | "Tu vida no cabe en una hoja de gastos" contrasted against a connected personal-finance object | Layered editorial hero |
| Fragmented expenses | Frustration, then relief | Four scattered expenses and an organized review surface | Animated collection / reconciliation |
| Workspaces | Belonging and control | Switch Personal, Casa, Viaje to reveal distinct data and scopes | Interactive workspace |
| Authorized context | Surprise and agency (the peak) | Three human questions, permission scopes and structured answers | Conversational interactive prototype |
| Privacy | Trust | Example visibility boundaries make permissions concrete | Permission interface |
| Devices | Continuity | Real iPhone/Mac screens, future platforms explicitly labeled | Device composition |
| Roadmap / close | Credibility and motivation | Current vs future is explicit; strong manifesto and a genuine GitHub CTA | Editorial split / typographic finale |

### Engineered peak
The visitor says: **"Es la web donde un asistente puede entender mis finanzas con mi permiso, sin que tenga que explicárselo todo otra vez."**
Peak lives in the interactive context scene, not the hero. All demos use fake data. There is no real MCP client/server call.

### Fingerprint / originality
Three distinct interactive families (story collection, workspace state, consent-scoped chat), an asymmetric editorial hero and a high-contrast green context act. Distinct from repeated scrollytelling scenes or a bento feature catalogue. No scroll cue, no section numbering, no invented usage metrics.

## Scope and non-goals
- This branch only redesigns the **landing**, not the iOS, Mac or backend products.
- Current baseline advertised by earlier Growth landing: movement tracking, next income, budgets, fixed payments, Apple Pay via configured Shortcuts, iCloud shared accounts, encrypted Growth Sync.
- Future **concepts**: automated import/reconciliation, granular workspaces, finance MCP, financial scenarios, Android, Windows, Web.
- Security promise is bounded: real current privacy policy remains authoritative; conceptual access-control screens are examples only.
- No unattended payment, bank action, sync, or access to personal data is implemented.

## Accessibility and verification goals
- Semantic headings and landmarks; meaningful image alt text; visible keyboard focus.
- Accessible tablist with arrow/Home/End keys; pressed-state prompt buttons and explanatory demo labels.
- All content readable with JS/GSAP disabled; reduced motion disables decorative animation and smooth scrolling.
- Responsive desktop/tablet/mobile composition. Avoid hardcoded generated fake reviews and conversion widgets.
- Inspect at 1440x900, 768x1024, 390x844, at top/mid/end scroll; check reduced motion, tab navigation and demo state changes before shipping.
