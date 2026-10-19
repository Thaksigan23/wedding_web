# திருமண அழைப்பிதழ் — Tamil Wedding Invitation

A single-page animated wedding invitation for a Hindu Sri Lankan (Eelam / Jaffna) Tamil wedding.

**Stack:** React + Vite + Tailwind CSS + Framer Motion  
**Default language:** தமிழ் (toggle to English)

---

## Quick start

```bash
npm install
npm run dev
```

Open the local URL (usually `http://localhost:5173`).

```bash
npm run build     # production → dist/
npm run preview   # preview production build
```

---

## Edit content

All guest-facing copy lives in **`src/data/wedding.js`**.

| Field | Notes |
|-------|--------|
| Couple / parents / hometowns | Tamil + English |
| `muhurtham.datetime` | ISO with Sri Lanka offset, e.g. `2026-12-15T09:30:00+05:30` |
| `venues[]` | Ceremony & reception; `enabled: false` to hide |
| `timeline[]` | Ceremony events; toggle with `enabled` |
| `gallery[]` | `{ src, alt: { ta, en } }` |
| `rsvp.endpoint` | Formspree URL, or `''` for mailto/WhatsApp fallback |
| `meta.siteUrl` | Live domain (also update OG URLs in `index.html`) |
| `meta.ogImage` | Defaults to `/og-image.jpg` |
| `audio.src` | `/audio/nadaswaram-thavil.mp3` |

**Google Maps embed:** Maps → Share → Embed a map → paste `src` into `mapsEmbedUrl`.

---

## Assets to add

| Path | Spec |
|------|------|
| `public/og-image.jpg` | **1200×630**, under **300KB** (placeholder included — replace with your couple photo) |
| `public/images/bride.jpg` / `groom.jpg` | Prefer **WebP** (`bride.webp`) for mobile; keep JPG fallback if needed |
| `public/images/gallery-*.jpg` | Pre-wedding; WebP recommended (e.g. quality 75–80) |
| `public/audio/nadaswaram-thavil.mp3` | Soft loop; toggle hides itself if missing |

### Image tips (WebP)

```bash
# Example with cwebp / sharp / Squoosh
# Export 1200px-wide WebP at ~75 quality, keep aspect ratio
# Then point wedding.js paths to .webp (or dual <picture> later)
```

Add `width` / `height` in components when you know final pixel sizes (already set on gallery & arch frames).

---

## Open Graph / WhatsApp

Static tags live in **`index.html`** (crawlers do not run React). After deploy:

1. Set `meta.siteUrl` in `wedding.js` to your live URL  
2. Mirror the same absolute URLs in `index.html` for `og:url`, `og:image`, `twitter:image`  
3. Replace `public/og-image.jpg` with your final 1200×630 art  
4. Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or WhatsApp

---

## Deploy

### Vercel

1. Push the repo to GitHub  
2. Import at [vercel.com/new](https://vercel.com/new)  
3. Framework: **Vite** — Build `npm run build`, Output `dist`  
4. Deploy  
5. Update `meta.siteUrl` + `index.html` OG URLs to the `*.vercel.app` (or custom) domain  

`vercel.json` includes an SPA rewrite so deep links fall back to `index.html`.

### Netlify

1. Push to GitHub, or connect the repo in Netlify  
2. Build command: `npm run build` · Publish: `dist`  
3. Or CLI: `npx netlify deploy --prod --dir=dist`  

`netlify.toml` and `public/_redirects` handle SPA routing. `public/404.html` is a styled fallback page.

---

## Project structure

```
src/
  data/wedding.js
  context/LanguageContext.jsx   ← sets <html lang="ta|en">
  components/                   ← Hero, Timeline, Countdown, Venue, Gallery, RSVP…
  App.jsx                       ← door + lazy below-the-fold sections
public/
  og-image.jpg
  favicon.svg
  404.html
  audio/
  images/
```

---

## Accessibility & motion

- Language toggle updates `document.documentElement.lang`  
- Lightbox: dialog role, Escape / arrows / swipe, focusable controls  
- Visible `:focus-visible` rings  
- Gold body text on cream uses darker `gold-ink` (`#8A6410`) for contrast  
- `prefers-reduced-motion: reduce` disables petals, sparks, flip digits, glow pulse  

---

## Audio

- `preload="none"` — file loads only after the door opens / music toggle  
- Default muted; fade in/out; pauses when the tab is hidden  
- Missing MP3 → toggle is hidden (no console noise)
