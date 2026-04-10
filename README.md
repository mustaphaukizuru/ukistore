# 🛍 UkiStore — Modern E-Commerce Product Store

**Built by [Mustapha Ukizuru](https://mustaphaukizuru.com)**

A fully responsive single-page e-commerce store with product catalog, cart, filters, search, sort, quick view, and checkout UI — all product data stored in JSON.

---

## 🛠 Tech Stack

| Technology   | Role |
|--------------|------|
| HTML5        | Semantic structure |
| CSS3         | Animations, keyframes, custom properties |
| SCSS         | Variables, mixins, partials (compiled to css/main.css) |
| Bootstrap 5  | Grid, responsive utilities |
| JavaScript   | App logic, state management, DOM rendering |
| JSON         | All 24 products as data source |

---

## ✨ Features

- **24 products** across 6 categories (Electronics, Fashion, Home, Sports, Beauty, Books)
- **Real-time search** — filters as you type across name, category, tags
- **Category filter** — pill navigation + sidebar checkboxes
- **Price range slider** — dynamic max-price filter
- **Rating filter** — minimum star rating
- **In Stock / On Sale** toggles
- **Sort** — by popularity, rating, price, newest, biggest discount
- **Grid / List view** toggle
- **Cart drawer** — add, remove, quantity control, subtotal, free shipping threshold
- **Quick View modal** — product detail with quantity selector
- **Checkout flow** — 3-step (Shipping → Payment → Review) with order confirmation
- **Wishlist** — toggle with ♡/♥ and localStorage persistence
- **Cart persistence** — survives page refresh via localStorage
- **Skeleton loaders** — shown while products load
- **Scroll reveal animations**
- **Toast notifications** — success, error, info
- **Fully mobile responsive** — Bootstrap grid + custom breakpoints

---

## 🚀 Quick Start

```bash
# Open directly (no server needed for basic browsing)
open index.html

# OR run with local server (required for JSON fetch)
npm install
npm run serve      # → http://localhost:3000

# Watch SCSS + serve simultaneously
npm start

# Build minified CSS
npm run sass:build
```

---

## 📁 Structure

```
ukistore/
├── index.html          # Full single-page store
├── css/main.css        # Compiled from SCSS
├── scss/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _base.scss
│   ├── _navbar.scss
│   ├── _products.scss
│   ├── _shop.scss
│   └── main.scss
├── js/store.js         # Full app logic
├── data/products.json  # 24 products
├── package.json
└── README.md
```

---

## ☁️ Deploy Free

- **GitHub Pages**: Push repo → Settings → Pages → Branch: main
- **Netlify**: Drag & drop folder at netlify.com/drop
- **Vercel**: Import repo, framework: Other, output: `.`

---

## 👨‍💻 Author

**Mustapha Ukizuru** | [mustaphaukizuru.com](https://mustaphaukizuru.com) | [@ukizurumustapha](https://twitter.com/ukizurumustapha)
