<div align="center">

# 🛍 UkiStore

**A modern, accessible, fully responsive e-commerce storefront — built with vanilla JavaScript, SCSS, and Bootstrap 5.**

Cart · Wishlist · Filters · Search · Sort · Quick view · 3‑step checkout · Mobile filter sheet · LocalStorage persistence

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=flat-square&logo=javascript&logoColor=000)](https://developer.mozilla.org/docs/Web/JavaScript)
[![No Framework](https://img.shields.io/badge/Frameworkless-FF653F?style=flat-square)](#)
[![Responsive](https://img.shields.io/badge/Mobile_First-1E104E?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFC85C?style=flat-square)](#-license)

[**Live demo →**](https://mustaphaukizuru.github.io/ukistore) &nbsp;·&nbsp; [Report a bug](https://github.com/mustaphaukizuru/ukistore/issues) &nbsp;·&nbsp; [Built by Mustapha Ukizuru](https://mustaphaukizuru.com)

</div>

---

## Table of contents

- [Why UkiStore](#-why-ukistore)
- [Features](#-features)
- [Design system](#-design-system)
- [Quick start](#-quick-start)
- [Project structure](#-project-structure)
- [Tech stack](#-tech-stack)
- [Responsive breakpoints](#-responsive-breakpoints)
- [Customization](#-customization)
- [Accessibility](#-accessibility)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌟 Why UkiStore

Most e‑commerce demos are either framework‑heavy React boilerplates or barely‑working static pages. UkiStore sits in the middle: a **production‑quality look** built with **zero runtime dependencies** beyond Bootstrap's CSS grid. Every feature is hand‑rolled in vanilla JS — no React, no Vue, no build step beyond Sass.

It's the project you want when you're learning, demoing front‑end fundamentals, or scaffolding a real store without commiting to a framework yet.

---

## ✨ Features

### Browse & discover
- **24 products** across 6 categories (Electronics, Fashion, Home, Sports, Beauty, Books)
- **Real‑time search** — filters as you type across name, category, and tags
- **Category pills** — horizontal scroll‑snap strip with live counts
- **Price range slider** — auto‑scales to the max price in your data
- **Rating filter** — minimum star rating (3 / 4 / 4.5)
- **In‑stock / on‑sale** toggles
- **Sort** — most popular, top‑rated, newest, price asc/desc, biggest discount
- **Grid / list view** toggle
- **Mobile filter sheet** — slide‑up bottom drawer with the full filter set for screens below 992 px

### Cart & checkout
- **Slide‑in cart drawer** with quantity controls, line subtotals, and free‑shipping threshold
- **Cart persists** across page refreshes via `localStorage`
- **3‑step checkout** flow — Shipping → Payment → Review → confirmation
- **Order summary** with live tax / shipping calculation

### Product detail
- **Quick view modal** — image, description, rating, tags, quantity selector, add‑to‑cart
- **Stock indicators** — green "In stock", gold "Only N left", red "Sold out"
- **Discount badge** computed from `oldPrice` vs `price`

### Wishlist
- Toggle ♡/♥ from any card with `aria-pressed` state
- Persists across sessions via `localStorage`

### UX polish
- **Skeleton loaders** while products fetch
- **Toast notifications** — success / error / info
- **Scroll‑reveal animations** via IntersectionObserver
- **Hover micro‑interactions** — card lift, glow intensify, emoji wobble
- **ESC closes** any open overlay (filter sheet → quick view → checkout → cart)

### Accessibility
- `aria-label` on every icon‑only button
- `role="dialog" aria-modal="true"` on the filter sheet
- `aria-pressed` reflects wishlist state
- WCAG AA color contrast on all buttons and badges
- Keyboard support on the quick‑view trigger (Enter / Space)
- `prefers-reduced-motion` respected via CSS transitions

---

## 🎨 Design system

A warm sunset palette: deep indigo grounds, plum surfaces, orange CTAs, gold highlights.

| Token | Hex | Usage |
|---|---|---|
| ![#1E104E](https://img.shields.io/badge/-1E104E-1E104E?style=flat-square) `$brand-indigo` | `#1E104E` | Card surfaces, dark text on bright backgrounds |
| ![#452E5A](https://img.shields.io/badge/-452E5A-452E5A?style=flat-square) `$brand-plum` | `#452E5A` | Elevated surfaces, pressed states |
| ![#FF653F](https://img.shields.io/badge/-FF653F-FF653F?style=flat-square) `$brand-orange` | `#FF653F` | Primary CTAs, sale badges, active pills |
| ![#FFC85C](https://img.shields.io/badge/-FFC85C-FFC85C?style=flat-square) `$brand-gold` | `#FFC85C` | Category labels, ratings, "hot" badges |
| ![#0a0518](https://img.shields.io/badge/-0a0518-0a0518?style=flat-square) page bg | `#0a0518` | Near‑black with indigo cast |

**Typography:** Plus Jakarta Sans (headings) · Inter (body) · JetBrains Mono (code). All loaded from Google Fonts.

**Contrast:** Every accent surface uses `$on-accent: #1E104E` for text, hitting **5.5:1 WCAG AA** — replacing the previous white‑on‑orange which failed at 2.7:1.

---

## 🚀 Quick start

```bash
# 1. Clone
git clone https://github.com/mustaphaukizuru/ukistore.git
cd ukistore

# 2. Install dev dependencies (Sass + http-server only)
npm install

# 3. Run dev server with Sass watcher
npm start          # → http://localhost:3000

# Or run them separately
npm run sass:watch # rebuild CSS on every SCSS save
npm run serve      # static HTTP server

# 4. Build minified CSS for production
npm run sass:build
```

> **Note** — `data/products.json` is loaded via `fetch()`, so opening `index.html` directly with `file://` won't work. Use the bundled server (any static server will do).

---

## 📁 Project structure

```
ukistore/
├─ index.html              # Single‑page shell (navbar, hero, grid, drawers, modals)
├─ css/
│  └─ main.css             # Compiled from scss/main.scss
├─ scss/
│  ├─ _variables.scss      # Brand palette + tokens
│  ├─ _mixins.scss         # Responsive, glass, gradient‑text, scrollbar mixins
│  ├─ _base.scss           # Resets, toast, skeleton, reveal animation
│  ├─ _navbar.scss         # Top nav + mobile search
│  ├─ _products.scss       # Product card + grid + category pills + filter sidebar
│  ├─ _shop.scss           # Hero, cart drawer, checkout modal, quick view, filter sheet
│  └─ main.scss            # Entry point — imports the above
├─ js/
│  └─ store.js             # State, cart, wishlist, filters, sort, render
├─ data/
│  └─ products.json        # 24 products with id, name, category, price, etc.
├─ .claude/launch.json     # Local dev preview config (Claude Code)
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## 🛠 Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Markup | **HTML5** | Semantic, single file |
| Styling | **SCSS → CSS** | Variables, mixins, partials. Compiled with Dart Sass. |
| Grid | **Bootstrap 5.3** | Macro‑layout (header, hero columns, sidebar) only |
| Product grid | **CSS Grid** | `auto-fill, minmax()` — no framework needed |
| Logic | **Vanilla ES2020** | No framework, no transpiler |
| Data | **JSON** | Static file, easy to migrate to an API |
| Persistence | **localStorage** | Cart and wishlist survive refresh |
| Dev tooling | **Sass + http‑server + concurrently** | Zero‑config build |

---

## 📐 Responsive breakpoints

| Breakpoint | Width | Product grid | Filters | Sidebar |
|---|---|---|---|---|
| **Mobile** | `< 576 px` | 2 cols × `minmax(160px, 1fr)` | Mobile sheet (bottom drawer) | Hidden |
| **Small** | `≥ 576 px` | 2–3 cols × `minmax(200px, 1fr)` | Mobile sheet | Hidden |
| **Medium** | `≥ 768 px` | 3 cols × `minmax(220px, 1fr)` | Mobile sheet | Hidden |
| **Large** | `≥ 992 px` | 3–4 cols × `minmax(230px, 1fr)` | Sidebar (always visible) | Visible |
| **Extra large** | `≥ 1200 px` | Locked 4 cols × `1fr` | Sidebar | Visible |

The **mobile filter sheet** is the key responsiveness win — phones and tablets get *every* filter (price slider, category, rating, in‑stock, on‑sale) via a slide‑up drawer with a live "Show N results" footer button. Open with **⚙ Filters** in the sort bar, close with ✕ / overlay tap / ESC.

---

## 🎨 Customization

### Swap the palette

Edit `scss/_variables.scss`:

```scss
$brand-indigo:  #1E104E;  // base / dark text
$brand-plum:    #452E5A;  // elevated surface
$brand-orange:  #FF653F;  // primary CTA
$brand-gold:    #FFC85C;  // highlight
```

Then run `npm run sass:build`. All cards, buttons, badges, and surfaces update from this one file.

### Add a product

Append to `data/products.json`:

```json
{
  "id": 25,
  "name": "Wireless Charging Pad",
  "category": "Electronics",
  "price": 29.99,
  "oldPrice": 49.99,
  "emoji": "🔌",
  "rating": 4.6,
  "reviews": 432,
  "stock": 80,
  "badge": "sale",
  "tags": ["Qi", "15W", "Universal"],
  "description": "Fast wireless charging for Qi‑compatible devices…"
}
```

Reload — the new card appears with the right discount badge, stock indicator, and category counts everywhere.

### Add a category

1. Add products with the new `category` value.
2. Add a sidebar checkbox in `index.html` (`<label class="filter-check cat-check" data-cat="NewCat">`).
3. Add the same checkbox inside the mobile filter sheet block.
4. Optionally add a color in `_variables.scss` under "Tags / category colors."

Category pills regenerate automatically from `data/products.json`.

---

## ♿ Accessibility

This project takes a11y seriously. Highlights:

- **Color contrast** — every text/background pair tested with WCAG. The biggest win was forcing dark text on the orange `$accent` (was 2.7:1 white on orange, now 5.5:1 indigo on orange).
- **Semantic markup** — `<article>` for product cards, `<nav>` for top nav, `<main>` for the shop area, `<h3>` for product names.
- **ARIA** — `aria-label` on icon‑only buttons, `aria-pressed` on toggle buttons (wishlist), `role="dialog" aria-modal="true"` on the filter sheet, `aria-disabled` on out‑of‑stock CTAs.
- **Keyboard** — ESC closes any overlay, Enter/Space activates the quick‑view trigger on `.card-media`.
- **Focus management** — close buttons are real `<button>` elements with visible focus rings inherited from Bootstrap.

**Known gaps** (tracked in [Roadmap](#-roadmap)):
- Cart drawer / checkout modal / quick view need focus trap + return‑focus.
- Skip‑to‑content link not yet implemented.
- Reduced‑motion preference disables transitions but not the hero float / shimmer animations.

---

## 🚢 Deploy

This is a 100% static site. Push to any host:

### GitHub Pages
```bash
git push origin master
# → Repo → Settings → Pages → Source: master / root → Save
```
Live at `https://<your-username>.github.io/ukistore`.

### Netlify
Drag the folder to [netlify.com/drop](https://app.netlify.com/drop) — done.

### Vercel
```bash
vercel
```
Pick "Other" as framework, leave output dir blank.

### Cloudflare Pages / Render / Surge
Same deal — point at the repo root, no build step needed (`css/main.css` is committed).

---

## 🗺 Roadmap

Roughly ranked by impact. PRs welcome.

### Next
- [ ] **Real product images** — replace emojis with WebP photos (Picsum seeds or curated set)
- [ ] **Wishlist drawer** — the navbar ♡ button is currently dead; build a drawer mirroring the cart
- [ ] **Hash‑routed product pages** — shareable URLs (`#/p/12`) + OG meta tags
- [ ] **A11y pass on remaining modals** — focus trap, return focus, role="dialog" on cart / checkout / quick view

### Soon
- [ ] **Recently viewed** rail
- [ ] **Compare 2–3 products** modal
- [ ] **Promo code field** at checkout (e.g. `UKI10` → 10 % off)
- [ ] **Variant selection** (size, color) on at least one demo product
- [ ] **Reviews section** (mock) inside quick view
- [ ] **Newsletter signup** in footer

### Later
- [ ] **Vite + ES modules** migration
- [ ] **TypeScript** via JSDoc + `// @ts-check`
- [ ] **PWA** — service worker, manifest, install prompt
- [ ] **i18n stub** — extract strings, add `es-MX` translation
- [ ] **Light theme** toggle
- [ ] **`color.scale()` migration** to drop the last few `lighten()` deprecation warnings under Sass 2.0

---

## 🤝 Contributing

PRs welcome on small fixes. For larger features, open an issue first to discuss the approach.

1. Fork and clone
2. Create a branch: `git checkout -b feature/your-thing`
3. Run `npm start` and make your changes
4. Run `npm run sass:build` before committing so `css/main.css` is current
5. Open a PR — describe what changed and why

**Style:** keep it framework‑free. The whole point of this project is to stay readable in vanilla JS / SCSS.

---

## 📄 License

[MIT](LICENSE) — do what you want, attribution appreciated.

---

## 👤 Author

**Mustapha Ukizuru** &nbsp;·&nbsp; Full‑stack developer based in Mexico City

[Website](https://mustaphaukizuru.com) &nbsp;·&nbsp; [GitHub](https://github.com/mustaphaukizuru) &nbsp;·&nbsp; [LinkedIn](https://linkedin.com/in/mustaphaukizuru) &nbsp;·&nbsp; [Twitter](https://twitter.com/ukizurumustapha)

If UkiStore helped you ship faster, **star the repo** ⭐ — it's the cheapest way to say thanks.

---

<div align="center">

Made with 🛍 and a lot of `--watch` &nbsp;·&nbsp; © 2025 Mustapha Ukizuru

</div>
