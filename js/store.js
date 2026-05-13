'use strict';

// ── State ─────────────────────────────────────────
const State = {
  products: [],
  filtered: [],
  cart: JSON.parse(localStorage.getItem('ukistore-cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('ukistore-wish') || '[]'),
  filters: { category: 'all', minPrice: 0, maxPrice: 500, minRating: 0, inStock: false, onSale: false },
  sort: 'popular',
  view: 'grid',
  search: '',
  checkoutStep: 1,
  quickviewProduct: null,
};

// ── Helpers ───────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const persist = () => {
  localStorage.setItem('ukistore-cart', JSON.stringify(State.cart));
  localStorage.setItem('ukistore-wish', JSON.stringify(State.wishlist));
};

function stars(r) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star${i < Math.round(r) ? '' : ' empty'}">★</span>`).join('');
}

function fmt(n) { return n.toFixed(2); }

function discount(old, cur) {
  if (!old) return '';
  return Math.round((1 - cur / old) * 100);
}

function stockLabel(s) {
  if (s === 0) return { cls: 'out', txt: '✕ Out of stock' };
  if (s < 20) return { cls: 'low', txt: `⚡ Only ${s} left` };
  return { cls: 'in', txt: '✓ In stock' };
}

// ── Toast ─────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  $('#toastContainer').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 2800);
}

// ── Cart ──────────────────────────────────────────
function cartCount() { return State.cart.reduce((a, i) => a + i.qty, 0); }
function cartTotal() { return State.cart.reduce((a, i) => a + i.price * i.qty, 0); }

function addToCart(id, qty = 1) {
  const p = State.products.find(p => p.id === id);
  if (!p || p.stock === 0) return toast('Out of stock', 'error');
  const existing = State.cart.find(i => i.id === id);
  if (existing) existing.qty = Math.min(existing.qty + qty, p.stock);
  else State.cart.push({ id, name: p.name, price: p.price, emoji: p.emoji, qty });
  persist(); updateCartUI(); toast(`Added to cart!`, 'success');
}

function removeFromCart(id) {
  State.cart = State.cart.filter(i => i.id !== id);
  persist(); updateCartUI();
}

function changeQty(id, delta) {
  const item = State.cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  persist(); updateCartUI();
}

function updateCartUI() {
  const count = cartCount();
  const badge = $('#cartBadge');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);

  const body = $('#cartBody');
  if (State.cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Your cart is empty</p></div>`;
  } else {
    body.innerHTML = State.cart.map(item => `
      <div class="cart-item">
        <div class="item-thumb">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${fmt(item.price)}</div>
        </div>
        <div class="item-controls">
          <div class="qty-ctrl">
            <button onclick="changeQty(${item.id},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>`).join('');
  }

  const total = cartTotal();
  $('#cartTotal').textContent = `$${fmt(total)}`;
  const shipping = total >= 50 ? 'FREE' : `$${fmt(4.99)}`;
  $('#shippingNote').innerHTML = total >= 50
    ? `<span>🎉 You qualify for <span>FREE shipping!</span></span>`
    : `Add $${fmt(50 - total)} more for <span>FREE shipping</span>`;
}

// ── Wishlist ──────────────────────────────────────
function toggleWish(id) {
  const idx = State.wishlist.indexOf(id);
  if (idx >= 0) { State.wishlist.splice(idx, 1); toast('Removed from wishlist', 'info'); }
  else { State.wishlist.push(id); toast('Added to wishlist ♡', 'success'); }
  persist();
  const wished = State.wishlist.includes(id);
  document.querySelectorAll(`.wish-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', wished);
    btn.textContent = wished ? '♥' : '♡';
    btn.setAttribute('aria-pressed', String(wished));
    btn.setAttribute('aria-label', wished ? 'Remove from wishlist' : 'Add to wishlist');
  });
}

// ── Render products ───────────────────────────────
function renderCard(p) {
  const wished = State.wishlist.includes(p.id);
  const pct = discount(p.oldPrice, p.price);
  const badgeMap = { hot: 'badge-hot', new: 'badge-new', sale: 'badge-sale' };
  const lowStock = p.stock > 0 && p.stock < 20;

  return `
  <article class="product-card reveal${p.stock === 0 ? ' out-of-stock' : ''}">
    <div class="card-badges">
      ${p.badge ? `<span class="${badgeMap[p.badge] || ''}">${p.badge}</span>` : ''}
      ${p.stock === 0 ? '<span class="badge-out">Sold out</span>' : ''}
      ${lowStock ? `<span class="stock-pill low">Only ${p.stock} left</span>` : ''}
    </div>
    <button class="wish-btn${wished ? ' active' : ''}" data-id="${p.id}"
      aria-label="${wished ? 'Remove from wishlist' : 'Add to wishlist'}"
      aria-pressed="${wished}"
      onclick="toggleWish(${p.id})">${wished ? '♥' : '♡'}</button>
    <div class="card-media" onclick="openQuickView(${p.id})" role="button" tabindex="0"
      aria-label="Quick view ${p.name}"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openQuickView(${p.id})}">
      <div class="media-glow" aria-hidden="true"></div>
      <div class="card-emoji" aria-hidden="true">${p.emoji}</div>
      <button class="quick-view-btn" onclick="event.stopPropagation();openQuickView(${p.id})">Quick view</button>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-category">${p.category}</span>
        <span class="card-rating-inline" aria-label="Rated ${p.rating} out of 5">
          <span class="star-icon" aria-hidden="true">★</span>
          <span class="rating-num">${p.rating}</span>
          <span>(${p.reviews.toLocaleString()})</span>
        </span>
      </div>
      <h3 class="card-name" onclick="openQuickView(${p.id})">${p.name}</h3>
      <div class="card-price">
        <span class="price-new">$${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">$${fmt(p.oldPrice)}</span><span class="price-badge">−${pct}%</span>` : ''}
      </div>
      <div class="card-footer">
        <button class="add-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled aria-disabled="true"' : ''}>
          ${p.stock === 0 ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </div>
  </article>`;
}

function applyFilters() {
  const { category, minPrice, maxPrice, minRating, inStock, onSale } = State.filters;
  const q = State.search.toLowerCase().trim();

  State.filtered = State.products.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    if (inStock && p.stock === 0) return false;
    if (onSale && !p.oldPrice) return false;
    if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
    return true;
  });

  // Sort
  const s = State.sort;
  if (s === 'price-asc')  State.filtered.sort((a, b) => a.price - b.price);
  if (s === 'price-desc') State.filtered.sort((a, b) => b.price - a.price);
  if (s === 'rating')     State.filtered.sort((a, b) => b.rating - a.rating);
  if (s === 'newest')     State.filtered.sort((a, b) => (b.badge === 'new') - (a.badge === 'new'));
  if (s === 'popular')    State.filtered.sort((a, b) => b.reviews - a.reviews);
  if (s === 'discount')   State.filtered.sort((a, b) => discount(b.oldPrice, b.price) - discount(a.oldPrice, a.price));

  renderProducts();
}

function renderProducts() {
  const grid = $('#productsGrid');
  grid.className = `products-grid${State.view === 'list' ? ' list-view' : ''}`;

  $('#resultsCount').innerHTML = `<strong>${State.filtered.length}</strong> products`;
  const sheetCount = $('#sheetResultsCount');
  if (sheetCount) sheetCount.textContent = State.filtered.length;
  updateActiveFilterCount();

  if (State.filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state grid-span-all"><div class="empty-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters or search term.</p></div>`;
    return;
  }

  grid.innerHTML = State.filtered.map(renderCard).join('');

  // Animate reveals
  setTimeout(() => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 40);
    });
  }, 20);
}

// ── Category pills ────────────────────────────────
function renderCategories() {
  const cats = ['all', ...new Set(State.products.map(p => p.category))];
  const container = $('#categoryPills');
  container.innerHTML = cats.map(c => {
    const count = c === 'all' ? State.products.length : State.products.filter(p => p.category === c).length;
    return `<button class="cat-pill${c === 'all' ? ' active' : ''}" data-cat="${c}" onclick="setCategory('${c}')">
      ${c === 'all' ? '🛍 All' : c} <span class="cat-count">${count}</span>
    </button>`;
  }).join('');
}

function setCategory(cat) {
  State.filters.category = cat;
  $$('.cat-pill').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  // Sync sidebar + mobile sheet checkboxes
  $$('.cat-check input').forEach(input => {
    input.checked = cat !== 'all' && input.closest('.cat-check').dataset.cat === cat;
  });
  applyFilters();
}

// ── Quick View ────────────────────────────────────
function openQuickView(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;
  State.quickviewProduct = p;
  const pct = discount(p.oldPrice, p.price);
  const sl = stockLabel(p.stock);

  $('#quickviewBody').innerHTML = `
    <div class="qv-body">
      <div class="qv-thumb">${p.emoji}</div>
      <div class="qv-info">
        <div class="qv-cat">${p.category}</div>
        <h2>${p.name}</h2>
        <div class="qv-price">
          <span class="price-new">$${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">$${fmt(p.oldPrice)}</span><span class="price-badge">-${pct}%</span>` : ''}
        </div>
        <div class="stars" style="margin-bottom:.75rem">${stars(p.rating)} <span style="font-size:.8rem;color:var(--tm,#8b88a8);margin-left:.4rem">${p.rating} (${p.reviews.toLocaleString()} reviews)</span></div>
        <p class="qv-desc">${p.description}</p>
        <div class="qv-stock ${sl.cls}">${sl.txt}</div>
        <div class="qty-row">
          <div class="qty-ctrl">
            <button onclick="qvQty(-1)">−</button>
            <span id="qvQty">1</span>
            <button onclick="qvQty(1)">+</button>
          </div>
        </div>
        <button class="qv-add" onclick="addToCart(${p.id}, parseInt(document.getElementById('qvQty').textContent))" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
        <div class="qv-tags">
          ${p.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    </div>`;

  $('#quickviewModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function qvQty(delta) {
  const el = $('#qvQty');
  const max = State.quickviewProduct?.stock || 99;
  el.textContent = Math.min(Math.max(1, parseInt(el.textContent) + delta), max);
}

// ── Cart Drawer ───────────────────────────────────
function openCart() {
  $('#cartDrawer').classList.add('open');
  $('#cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Checkout ──────────────────────────────────────
function openCheckout() {
  if (State.cart.length === 0) { toast('Your cart is empty', 'error'); return; }
  closeCart();
  State.checkoutStep = 1;
  renderCheckout();
  $('#checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  $('#checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeQuickview() {
  $('#quickviewModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckout() {
  const steps = ['Shipping', 'Payment', 'Review'];
  const stepsHTML = steps.map((s, i) => {
    const n = i + 1;
    const cls = n < State.checkoutStep ? 'done' : n === State.checkoutStep ? 'active' : '';
    return `<div class="step ${cls}"><div class="step-dot">${n < State.checkoutStep ? '✓' : n}</div><div class="step-label">${s}</div></div>`;
  }).join('');

  const summaryItems = State.cart.map(i => `<div class="summary-line"><span>${i.name} × ${i.qty}</span><span>$${fmt(i.price * i.qty)}</span></div>`).join('');
  const subtotal = cartTotal();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  let content = '';
  if (State.checkoutStep === 1) {
    content = `
      <div class="form-row">
        <div class="form-group"><label>First Name *</label><input type="text" placeholder="Mustapha" /></div>
        <div class="form-group"><label>Last Name *</label><input type="text" placeholder="Ukizuru" /></div>
      </div>
      <div class="form-group"><label>Email *</label><input type="email" placeholder="you@example.com" /></div>
      <div class="form-group"><label>Phone</label><input type="tel" placeholder="+52 55 1234 5678" /></div>
      <div class="form-group"><label>Address *</label><input type="text" placeholder="123 Main Street" /></div>
      <div class="form-row">
        <div class="form-group"><label>City *</label><input type="text" placeholder="Ciudad López Mateos" /></div>
        <div class="form-group"><label>Zip Code *</label><input type="text" placeholder="54700" /></div>
      </div>
      <div class="form-group"><label>Country *</label>
        <select><option>México</option><option>United States</option><option>Canada</option><option>Spain</option></select>
      </div>`;
  } else if (State.checkoutStep === 2) {
    content = `
      <div class="form-group"><label>Card Number *</label><input type="text" placeholder="4242 4242 4242 4242" maxlength="19" /></div>
      <div class="form-row">
        <div class="form-group"><label>Expiry *</label><input type="text" placeholder="MM/YY" maxlength="5" /></div>
        <div class="form-group"><label>CVV *</label><input type="text" placeholder="123" maxlength="4" /></div>
      </div>
      <div class="form-group"><label>Cardholder Name *</label><input type="text" placeholder="MUSTAPHA UKIZURU" /></div>
      <div style="display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap;">
        <span style="font-size:1.5rem">💳</span><span style="font-size:1.5rem">🏦</span>
        <span style="font-size:.75rem;color:#8b88a8;align-self:center">Secured by 256-bit SSL encryption</span>
      </div>`;
  } else if (State.checkoutStep === 3) {
    content = `<p style="font-size:.875rem;color:#8b88a8;margin-bottom:1rem">Review your order before placing it.</p>`;
  }

  const isLast = State.checkoutStep === 3;
  $('#checkoutBody').innerHTML = `
    <div class="steps">${stepsHTML}</div>
    ${content}
    <div class="order-summary">
      <div class="summary-title">Order Summary</div>
      ${summaryItems}
      <div class="summary-line"><span>Subtotal</span><span>$${fmt(subtotal)}</span></div>
      <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + fmt(shipping)}</span></div>
      <div class="summary-line total"><span>Total</span><span>$${fmt(total)}</span></div>
    </div>
    <div class="modal-actions">
      ${State.checkoutStep > 1 ? `<button class="btn-back" onclick="checkoutBack()">← Back</button>` : '<span></span>'}
      <button class="btn-next" onclick="${isLast ? 'placeOrder()' : 'checkoutNext()'}">
        ${isLast ? '🎉 Place Order' : 'Continue →'}
      </button>
    </div>`;
}

function checkoutNext() {
  if (State.checkoutStep < 3) { State.checkoutStep++; renderCheckout(); }
}
function checkoutBack() {
  if (State.checkoutStep > 1) { State.checkoutStep--; renderCheckout(); }
}

function placeOrder() {
  $('#checkoutBody').innerHTML = `
    <div class="checkout-success">
      <div class="success-icon">🎉</div>
      <h3>Order Placed Successfully!</h3>
      <p style="margin:.5rem 0 1.5rem">Thank you for your purchase, Mustapha!<br>Your order will arrive in 3–5 business days.</p>
      <p style="font-size:.8rem;color:#8b88a8">Order #UK${Date.now().toString().slice(-6)}</p>
      <button class="btn-primary" style="margin-top:1.5rem" onclick="closeCheckout();clearCart()">Continue Shopping →</button>
    </div>`;
}

function clearCart() {
  State.cart = []; persist(); updateCartUI();
}

// ── Search ────────────────────────────────────────
function handleSearch(val) {
  State.search = val;
  $('#searchClear').classList.toggle('visible', val.length > 0);
  applyFilters();
}

// ── Price range ───────────────────────────────────
function updatePriceRange(val) {
  const v = parseInt(val);
  State.filters.maxPrice = v;
  // Sync every slider + label (desktop sidebar + mobile sheet)
  $$('.price-range-input').forEach(s => { if (parseInt(s.value) !== v) s.value = v; });
  $$('.price-label').forEach(l => l.textContent = `$0 — $${v}`);
  applyFilters();
}

// ── Stock / sale toggles ──────────────────────────
function setInStock(val) {
  State.filters.inStock = val;
  $$('.in-stock-check').forEach(c => c.checked = val);
  applyFilters();
}
function setOnSale(val) {
  State.filters.onSale = val;
  $$('.on-sale-check').forEach(c => c.checked = val);
  applyFilters();
}

// ── Sort ──────────────────────────────────────────
function handleSort(val) {
  State.sort = val; applyFilters();
}

// ── View toggle ───────────────────────────────────
function setView(v) {
  State.view = v;
  $$('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  renderProducts();
}

// ── Rating filter ─────────────────────────────────
function setRating(r) {
  State.filters.minRating = r;
  $$('.r-opt').forEach(o => o.classList.toggle('active', parseFloat(o.dataset.r) === r));
  applyFilters();
}

// ── Active filter count ───────────────────────────
function updateActiveFilterCount() {
  const f = State.filters;
  const maxAllowed = parseFloat($('.price-range-input')?.max || 500);
  let n = 0;
  if (f.category !== 'all') n++;
  if (f.maxPrice < maxAllowed) n++;
  if (f.minRating > 0) n++;
  if (f.inStock) n++;
  if (f.onSale) n++;
  $$('.filter-count, #activeFilterCount').forEach(el => {
    el.textContent = n;
    el.classList.toggle('visible', n > 0);
  });
}

// ── Mobile filter sheet ───────────────────────────
function openFilterSheet() {
  $('#filterSheet')?.classList.add('open');
  $('#filterSheetOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeFilterSheet() {
  $('#filterSheet')?.classList.remove('open');
  $('#filterSheetOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Init ──────────────────────────────────────────
async function init() {
  const res = await fetch('data/products.json');
  State.products = await res.json();
  State.filtered = [...State.products];

  renderCategories();
  applyFilters();
  updateCartUI();

  // Max price from data — applied to every price-range input (desktop + mobile sheet)
  const maxP = Math.max(...State.products.map(p => p.price));
  const cap = Math.ceil(maxP / 100) * 100;
  $$('.price-range-input').forEach(s => { s.max = cap; s.value = cap; });
  State.filters.maxPrice = cap;
  $$('.price-label').forEach(l => l.textContent = `$0 — $${cap}`);

  // Category counts in sidebar + mobile sheet
  const catCounts = {};
  State.products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  $$('.cat-check').forEach(el => {
    const c = el.dataset.cat;
    const count = el.querySelector('.check-count');
    if (count && catCounts[c]) count.textContent = catCounts[c];
  });

  // ESC closes any open overlay (cart, checkout, quickview, filter sheet)
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('#filterSheet')?.classList.contains('open')) return closeFilterSheet();
    if ($('#quickviewModal')?.classList.contains('open')) return closeQuickview();
    if ($('#checkoutModal')?.classList.contains('open')) return closeCheckout();
    if ($('#cartDrawer')?.classList.contains('open')) return closeCart();
  });

  // IntersectionObserver for hero reveals
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Expose to HTML ────────────────────────────────
Object.assign(window, {
  addToCart, removeFromCart, changeQty, toggleWish,
  openCart, closeCart, openCheckout, closeCheckout,
  openQuickView, closeQuickview, qvQty,
  checkoutNext, checkoutBack, placeOrder, clearCart,
  handleSearch, updatePriceRange, handleSort, setView,
  setCategory, setRating,
  setInStock, setOnSale,
  openFilterSheet, closeFilterSheet,
});

document.addEventListener('DOMContentLoaded', init);
