import {
	STORES, storeById, CATEGORIES, categoryById,
	normalize, productKey, guessCategory, parseInput, capitalize,
} from './catalogo.js';
import { initFirebase, demoBackend } from './datos.js';
import { attachSwipe, animateRemoval, swipeActive, onSwipeIdle, peekHint } from './deslizar.js';
import { firebaseConfig, isConfigured } from './config.js';

const $ = (id) => document.getElementById(id);
const FILTER_KEY = 'compra-filtro';
const THEME_KEY = 'compra-tema';
const HINT_KEY = 'compra-pista-deslizar';
const darkQuery = matchMedia('(prefers-color-scheme: dark)');

const state = {
	backend: null,
	unsubs: [],
	items: [],
	products: [],
	productMap: new Map(),
	filter: readPref(FILTER_KEY) || 'all',
	draftStore: null,
	manualStore: false,
	checking: new Set(),
	removing: new Set(), // borrados por deslizamiento que aún se están animando
	renderPending: false,
	flash: new Map(), // id → instante en que empezó el destello
	knownIds: null,
	editingId: null,
	sheetStore: null,
	sheetCat: null,
	wakeLock: null,
	wakeWanted: false,
	toastTimer: null,
};

// ───────────────────────── Arranque ─────────────────────────

injectStoreStyles();
applyTheme();
setupViewport();
setupStaticUI();
boot();

async function boot() {
	if (new URLSearchParams(location.search).has('demo')) {
		$('demoBar').hidden = false;
		start(demoBackend());
		return;
	}
	if (!isConfigured) {
		show('setup');
		return;
	}

	let fb;
	try {
		fb = await initFirebase(firebaseConfig);
	} catch (err) {
		console.error(err);
		show('login');
		toast('No se pudo conectar. Revisa la conexión y recarga.');
		return;
	}

	$('loginBtn').addEventListener('click', () => {
		fb.signIn().catch((err) => {
			if (!['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(err.code)) {
				console.error(err);
				toast('No se pudo iniciar sesión');
			}
		});
	});

	fb.onUser((user) => {
		stop();
		if (!user) show('login');
		else start(fb.backendFor(user));
	});
}

function start(backend) {
	state.backend = backend;
	state.knownIds = null;
	state.draftStore = defaultStore();
	renderUser();

	let shown = false;
	state.unsubs.push(backend.watchItems((items) => {
		const me = backend.user.uid;
		if (state.knownIds) {
			items.forEach(i => {
				if (!state.knownIds.has(i.id) && i.addedBy?.uid !== me) flash(i.id);
			});
		}
		state.knownIds = new Set(items.map(i => i.id));
		state.items = items;
		if (!shown) {
			shown = true;
			show('app');
			$('list').classList.add('is-intro');
			setTimeout(() => $('list').classList.remove('is-intro'), 900);
		}
		render();
	}, (err) => {
		console.error(err);
		if (err.code === 'permission-denied') {
			$('deniedEmail').textContent = backend.user.email;
			$('deniedBtn').onclick = () => backend.signOut();
			show('denied');
		} else {
			toast('No se pudo cargar la lista');
		}
	}));

	state.unsubs.push(backend.watchProducts((products) => {
		state.products = products;
		state.productMap = new Map(products.map(p => [p.key, p]));
		if (!$('panel').hidden) renderPanel();
		if ($('productsSheet').open) renderProducts();
	}));
}

function stop() {
	state.unsubs.forEach(u => u());
	state.unsubs = [];
	state.backend = null;
}

function show(id) {
	for (const el of ['splash', 'login', 'denied', 'setup', 'app']) $(el).hidden = el !== id;
}

// ───────────────────────── Render ─────────────────────────

const isVisible = (item, filter) =>
	filter === 'all' || item.store === filter || storeById(item.store).id === 'any';

// Lo que hay en la lista, sin lo que se está borrando con animación.
const liveItems = () => state.items.filter(i => !state.removing.has(i.id));

function render() {
	// Con un dedo encima de una fila, repintar la cortaría a mitad de gesto.
	if (swipeActive()) {
		state.renderPending = true;
		return;
	}
	state.renderPending = false;
	renderTabs();
	renderSummary();
	renderList();
	if (!$('panel').hidden) renderPanel();
}

function renderTabs() {
	const tabs = [{ id: 'all', name: 'Todo' }, ...STORES.filter(s => s.id !== 'any')];
	if (!tabs.some(t => t.id === state.filter)) state.filter = 'all';
	$('tabs').replaceChildren(...tabs.map(t => {
		const count = liveItems().filter(i => !i.done && isVisible(i, t.id)).length;
		return h('button', {
			class: `tab s-${t.id}`, type: 'button', role: 'tab',
			'data-store': t.id, 'aria-selected': String(state.filter === t.id),
			onclick: () => setFilter(t.id),
		},
		t.id !== 'all' && h('span', { class: 'dot' }),
		h('span', { class: 'tab-name' }, t.name),
		count > 0 && h('span', { class: 'tab-count' }, count));
	}));
}

function setFilter(id) {
	state.filter = id;
	writePref(FILTER_KEY, id);
	if (!state.manualStore) state.draftStore = defaultStore();
	render();
	const hero = document.querySelector('.hero');
	const dockTop = hero.offsetTop + hero.offsetHeight;
	if (window.scrollY > dockTop) window.scrollTo({ top: dockTop, behavior: 'smooth' });
}

function renderSummary() {
	const vis = liveItems().filter(i => isVisible(i, state.filter));
	const pending = vis.filter(i => !i.done).length;
	const done = vis.length - pending;
	const where = state.filter === 'all' ? '' : ` en ${storeById(state.filter).name}`;
	const el = $('summary');
	el.replaceChildren();
	if (!vis.length) el.append('Lista vacía');
	else if (!pending) el.append('Todo en el carro ✨');
	else el.append(h('b', null, pending), ` por comprar${where}`);
	if (done) el.append(` · ${done} en el carro`);
}

function renderList() {
	const vis = liveItems().filter(i => isVisible(i, state.filter));
	const pending = vis.filter(i => !i.done).sort((a, b) => a.createdAt - b.createdAt);
	const done = vis.filter(i => i.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
	const list = $('list');
	list.replaceChildren();

	if (!pending.length) list.append(emptyState(vis.length > 0));

	for (const cat of CATEGORIES) {
		const rows = pending.filter(i => categoryById(i.category).id === cat.id);
		if (!rows.length) continue;
		list.append(h('section', { class: 'group' },
			h('div', { class: 'group-head' },
				h('span', { class: 'emoji' }, cat.emoji), cat.name,
				h('span', { class: 'count' }, rows.length)),
			h('div', { class: 'card' }, rows.map(itemRow))));
	}

	if (done.length) {
		list.append(h('section', { class: 'cart' },
			h('div', { class: 'cart-head' },
				h('h2', null, `🛒 En el carro · ${done.length}`),
				h('button', { class: 'link', type: 'button', onclick: () => clearCart(done) }, 'Vaciar carro')),
			h('div', { class: 'card' }, done.map(itemRow))));
	}

	maybeHintSwipe();
}

// La primera vez en un móvil, una fila asoma el «Eliminar» para enseñar el gesto.
function maybeHintSwipe() {
	if (readPref(HINT_KEY) || !matchMedia('(pointer: coarse)').matches) return;
	const first = document.querySelector('#list .group .item-swipe');
	if (!first) return;
	writePref(HINT_KEY, '1');
	setTimeout(() => peekHint(document.querySelector('#list .group .item-swipe')), 1200);
}

const FLASH_MS = 1600;

function flash(id) {
	state.flash.set(id, Date.now());
}

function emptyState(somethingDone) {
	const store = state.filter === 'all' ? null : storeById(state.filter);
	if (somethingDone) {
		return h('div', { class: 'empty' },
			h('div', { class: 'empty-art' }, '🎉'),
			h('h2', null, '¡Todo en el carro!'),
			h('p', null, 'Cuando paséis por caja, vaciad el carro.'));
	}
	return h('div', { class: 'empty' },
		h('div', { class: 'empty-art' }, store ? '🛒' : '🧺'),
		h('h2', null, store ? `Nada pendiente en ${store.name}` : 'Nada que comprar'),
		h('p', null, 'Añade lo que falte arriba. Escribe «2 aguacates» y la cantidad se pone sola.'));
}

function itemRow(item) {
	const store = storeById(item.store);
	const me = state.backend.user.uid;
	const checking = state.checking.has(item.id);
	const showTag = state.filter === 'all' || store.id === 'any';
	const byOther = item.addedBy && item.addedBy.uid !== me;
	const cls = ['item', `s-${store.id}`];
	if (item.done) cls.push('is-done');
	if (checking) cls.push('is-checking');
	const flashAge = Date.now() - (state.flash.get(item.id) ?? -Infinity);
	if (flashAge < FLASH_MS) cls.push('is-new');
	else state.flash.delete(item.id);

	const row = h('div', {
		class: cls.join(' '), 'data-id': item.id,
		// Si se repinta a mitad del destello, que continúe donde iba.
		style: flashAge < FLASH_MS ? `animation-delay:-${flashAge}ms` : null,
	},
		h('button', {
			class: 'check', type: 'button',
			'aria-label': `${item.done ? 'Desmarcar' : 'Marcar'} ${item.name}`,
			onclick: () => toggleDone(item, row),
		}, h('span', { class: 'check-ring', html: CHECK_SVG })),
		h('button', { class: 'item-body', type: 'button', onclick: () => openSheet(item) },
			h('span', { class: 'item-text' },
				h('span', { class: 'item-name' },
					h('span', null, item.name),
					item.qty && h('span', { class: 'qty' }, formatQty(item.qty))),
				item.note && h('span', { class: 'item-note' }, item.note)),
			showTag && storeTag(store),
			byOther && avatar(item.addedBy, `Añadido por ${item.addedBy.name}`)));

	const wrap = h('div', { class: 'item-swipe' },
		h('button', {
			class: 'swipe-action', type: 'button', tabindex: '-1', 'aria-label': `Eliminar ${item.name}`,
		}, h('span', { class: 'swipe-label', html: `${TRASH_SVG}<span>Eliminar</span>` })),
		row);
	attachSwipe(wrap, { onDelete: () => swipeDelete(item, wrap) });
	return wrap;
}

const TRASH_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12a2 2 0 0 0 2 1.8h7a2 2 0 0 0 2-1.8l1-12M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CHECK_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function storeTag(store) {
	return h('span', { class: `tag s-${store.id}` }, h('span', { class: 'dot' }), store.name);
}

function formatQty(qty) {
	return /^\d+([.,]\d+)?$/.test(qty) ? `×${qty}` : qty;
}

// ───────────────────────── Acciones sobre la lista ─────────────────────────

function toggleDone(item, row) {
	const { backend } = state;
	if (item.done) {
		backend.updateItem(item.id, { done: false });
		return;
	}
	if (state.checking.has(item.id)) return;
	state.checking.add(item.id);
	row.classList.add('is-checking');
	vibrate(12);
	setTimeout(() => {
		state.checking.delete(item.id);
		backend.updateItem(item.id, { done: true });
	}, 420);
}

async function swipeDelete(item, wrap) {
	if (state.removing.has(item.id)) return;
	state.removing.add(item.id);
	vibrate(15);
	const copy = { ...item };
	await animateRemoval(wrap);
	state.backend.deleteItems([item.id]);
	render();
	toast(`${item.name} eliminado`, () => {
		state.removing.delete(item.id);
		flash(item.id);
		state.backend.restoreItems([copy]);
	});
}

function clearCart(doneItems) {
	const copies = doneItems.map(i => ({ ...i }));
	state.backend.deleteItems(copies.map(i => i.id));
	toast(`${copies.length === 1 ? '1 producto quitado' : `${copies.length} productos quitados`} del carro`,
		() => state.backend.restoreItems(copies));
}

function addItem(data, { raw } = {}) {
	const { backend } = state;
	const key = productKey(data.name);
	const existing = key && state.items.find(i => productKey(i.name) === key);

	if (existing && !existing.done) {
		if (data.qty && data.qty !== existing.qty) backend.updateItem(existing.id, { qty: data.qty });
		flash(existing.id);
		render();
		toast(`${existing.name} ya estaba en la lista`);
		return;
	}

	if (existing) {
		backend.updateItem(existing.id, { done: false, qty: data.qty || existing.qty, store: data.store });
		flash(existing.id);
		toast(`${existing.name} vuelve a la lista`);
	} else {
		const id = backend.addItem({ note: '', ...data });
		flash(id);
		const store = storeById(data.store);
		toast(`Añadido: ${data.name}${store.id === 'any' ? '' : ` · ${store.name}`}`,
			() => backend.deleteItems([id]));
	}
	backend.rememberProduct(key, { name: data.name, store: data.store, category: data.category || guessCategory(raw || data.name) }, true);
	vibrate(8);
}

// ───────────────────────── Añadir (input + panel) ─────────────────────────

function defaultStore() {
	return state.filter === 'all' ? 'any' : state.filter;
}

function draft() {
	const raw = $('addInput').value;
	const { qty, name } = parseInput(raw);
	const product = name ? state.productMap.get(productKey(name)) : null;
	return { raw, qty, name, product };
}

function onDraftInput() {
	const { name, product } = draft();
	if (!state.manualStore) state.draftStore = product?.store || defaultStore();
	$('addBtn').disabled = !name;
	renderPanel();
}

function submitDraft() {
	const { raw, qty, name, product } = draft();
	if (!name) return;
	addItem({
		name: product?.name || name,
		qty,
		store: state.draftStore,
		category: product?.category || guessCategory(raw),
	}, { raw });
	resetDraft();
}

function resetDraft() {
	$('addInput').value = '';
	$('addBtn').disabled = true;
	state.manualStore = false;
	state.draftStore = defaultStore();
	renderPanel();
}

function openPanel() {
	if (!$('panel').hidden) return;
	$('panel').hidden = false;
	$('scrim').hidden = false;
	renderPanel();
}

function closePanel() {
	$('panel').hidden = true;
	$('scrim').hidden = true;
	if (!$('addInput').value.trim()) {
		state.manualStore = false;
		state.draftStore = defaultStore();
	}
}

function renderPanel() {
	const { name, product } = draft();

	$('storePick').replaceChildren(...STORES.map(s => h('button', {
		class: `chip s-${s.id}`, type: 'button', role: 'radio',
		'aria-checked': String(state.draftStore === s.id),
		onclick: () => {
			state.draftStore = s.id;
			state.manualStore = true;
			renderPanel();
			$('addInput').focus();
		},
	}, h('span', { class: 'dot' }), s.name)));

	const query = normalize(name);
	const found = query
		? state.products
			.filter(p => p.key !== productKey(name) && normalize(p.name).includes(query))
			.sort((a, b) => Number(normalize(b.name).startsWith(query)) - Number(normalize(a.name).startsWith(query)) || (b.uses || 0) - (a.uses || 0))
			.slice(0, 5)
		: [];

	const hint = $('memoryHint');
	hint.hidden = !name || (!product && found.length > 0);
	if (!hint.hidden) {
		const store = storeById(state.draftStore);
		if (product && product.store === state.draftStore) {
			hint.textContent = store.id === 'any'
				? '⭐ Os da igual dónde comprarlo'
				: `⭐ Normalmente lo compráis en ${store.name}`;
		} else if (product) {
			hint.textContent = `A partir de ahora: ${store.id === 'any' ? 'en cualquier súper' : `en ${store.name}`}`;
		} else {
			const cat = categoryById(guessCategory($('addInput').value));
			hint.textContent = `Nuevo · irá a ${cat.emoji} ${cat.name}`;
		}
	}

	const matches = $('matches');
	const usualWrap = $('usualWrap');
	if (query) {
		usualWrap.hidden = true;
		matches.replaceChildren(...found.map(p => matchRow(p, query)));
	} else {
		matches.replaceChildren();
		usualWrap.hidden = false;
		renderUsual();
	}
}

function matchRow(product, query) {
	const n = product.name;
	const at = normalize(n).indexOf(query);
	const label = at >= 0
		? [n.slice(0, at), h('mark', null, n.slice(at, at + query.length)), n.slice(at + query.length)]
		: [n];
	const inList = state.items.some(i => !i.done && productKey(i.name) === product.key);
	return h('button', {
		class: 'match', type: 'button',
		onclick: () => {
			const { qty } = draft();
			addItem({ name: product.name, qty, store: product.store || 'any', category: product.category });
			resetDraft();
			$('addInput').focus();
		},
	},
	h('span', { class: 'match-emoji' }, categoryById(product.category).emoji),
	h('span', { class: 'match-name' }, ...label),
	inList ? h('span', { class: 'tag' }, 'En la lista') : storeTag(storeById(product.store)));
}

function renderUsual() {
	const pendingKeys = new Set(state.items.filter(i => !i.done).map(i => productKey(i.name)));
	const usual = state.products
		.filter(p => !pendingKeys.has(p.key) && (p.uses || 0) > 0)
		.filter(p => state.filter === 'all' || p.store === state.filter || p.store === 'any')
		.sort((a, b) => (b.uses || 0) - (a.uses || 0))
		.slice(0, 14);
	const box = $('usual');
	if (!usual.length) {
		box.replaceChildren(h('p', { class: 'usual-empty' },
			state.products.length ? 'Ya está todo lo habitual en la lista 👌' : 'Aquí aparecerán los productos que más compráis.'));
		return;
	}
	box.replaceChildren(...usual.map(p => h('button', {
		class: `chip s-${storeById(p.store).id}`, type: 'button',
		onclick: () => {
			addItem({ name: p.name, qty: '', store: p.store || 'any', category: p.category });
			$('addInput').focus();
		},
	}, h('span', { class: 'dot' }), p.name, h('span', { class: 'plus' }, '+'))));
}

// ───────────────────────── Hoja de edición ─────────────────────────

function openSheet(item) {
	state.editingId = item.id;
	state.sheetStore = storeById(item.store).id;
	state.sheetCat = categoryById(item.category).id;
	$('fName').value = item.name;
	$('fQty').value = item.qty || '';
	$('fNote').value = item.note || '';
	const who = item.addedBy?.uid === state.backend.user.uid ? 'ti' : (item.addedBy?.name || 'alguien');
	$('fMeta').textContent = `Añadido por ${who} · ${timeAgo(item.createdAt)}`;
	renderSheetChoices();
	$('sheet').showModal();
}

function renderSheetChoices() {
	$('fStore').replaceChildren(...STORES.map(s => h('button', {
		class: `store-opt s-${s.id}`, type: 'button', role: 'radio',
		'aria-checked': String(state.sheetStore === s.id),
		onclick: () => { state.sheetStore = s.id; renderSheetChoices(); },
	}, h('span', { class: 'store-badge' }, s.short), s.name)));

	$('fCat').replaceChildren(...CATEGORIES.map(c => h('button', {
		class: 'cat-opt', type: 'button', role: 'radio', title: c.name,
		'aria-checked': String(state.sheetCat === c.id),
		onclick: () => { state.sheetCat = c.id; renderSheetChoices(); },
	}, h('span', { class: 'cat-emoji' }, c.emoji), h('span', null, c.short))));
}

function saveSheet() {
	const name = capitalize($('fName').value.trim());
	if (!name || !state.editingId) return;
	const patch = {
		name,
		qty: $('fQty').value.trim(),
		note: $('fNote').value.trim(),
		store: state.sheetStore,
		category: state.sheetCat,
	};
	state.backend.updateItem(state.editingId, patch);
	state.backend.rememberProduct(productKey(name), { name, store: patch.store, category: patch.category }, false);
	$('sheet').close();
}

function deleteFromSheet() {
	const item = state.items.find(i => i.id === state.editingId);
	$('sheet').close();
	if (!item) return;
	const copy = { ...item };
	state.backend.deleteItems([item.id]);
	toast(`${item.name} eliminado`, () => state.backend.restoreItems([copy]));
}

function stepQty(delta) {
	const input = $('fQty');
	const m = input.value.trim().match(/^(\d+)(.*)$/);
	const n = (m ? parseInt(m[1], 10) : 0) + delta;
	input.value = n > 0 ? `${n}${m ? m[2] : ''}` : '';
}

// ───────────────────────── Productos recordados ─────────────────────────

function openProducts() {
	$('menu').hidePopover();
	$('productsSearch').value = '';
	renderProducts();
	$('productsSheet').showModal();
}

function renderProducts() {
	const q = normalize($('productsSearch').value);
	const list = state.products
		.filter(p => !q || normalize(p.name).includes(q))
		.sort((a, b) => a.name.localeCompare(b.name, 'es'));
	const ul = $('productsList');
	if (!list.length) {
		ul.replaceChildren(h('li', { class: 'products-empty' },
			q ? 'Ningún producto coincide' : 'Todavía no hay productos. Se guardan solos al añadirlos a la lista.'));
		return;
	}
	ul.replaceChildren(...list.map(p => h('li', { class: 'product' },
		h('span', null, categoryById(p.category).emoji),
		h('span', { class: 'product-name' }, p.name, p.uses ? h('small', null, `×${p.uses}`) : null),
		h('span', { class: 'mini-seg', role: 'radiogroup', 'aria-label': `Dónde comprar ${p.name}` },
			STORES.map(s => h('button', {
				class: `s-${s.id}`, type: 'button', role: 'radio', title: s.name,
				'aria-checked': String(storeById(p.store).id === s.id),
				onclick: () => setProductStore(p, s.id),
			}, s.short))),
		h('button', {
			class: 'icon-btn', type: 'button', 'aria-label': `Olvidar ${p.name}`,
			onclick: () => forgetProduct(p),
		}, '✕'))));
}

function setProductStore(product, storeId) {
	const { backend } = state;
	backend.rememberProduct(product.key, { store: storeId }, false);
	state.items
		.filter(i => !i.done && productKey(i.name) === product.key && i.store !== storeId)
		.forEach(i => backend.updateItem(i.id, { store: storeId }));
	const store = storeById(storeId);
	toast(`${product.name} → ${store.id === 'any' ? 'cualquier súper' : store.name}`);
}

function forgetProduct(product) {
	const { key, ...data } = product;
	state.backend.forgetProduct(key);
	toast(`${product.name} olvidado`, () => state.backend.rememberProduct(key, data, false));
}

// ───────────────────────── Usuario, menú, pantalla encendida ─────────────────────────

function renderUser() {
	const { user } = state.backend;
	const hour = new Date().getHours();
	const hello = hour < 6 ? 'Buenas noches' : hour < 14 ? 'Buenos días' : hour < 21 ? 'Buenas tardes' : 'Buenas noches';
	$('greeting').textContent = `${hello}, ${user.name}`;
	fillAvatar($('menuBtn'), user);
	fillAvatar($('menuAvatar'), user);
	$('menuName').textContent = user.name;
	$('menuEmail').textContent = user.email || '';
}

function avatar(user, title) {
	const el = h('span', { class: 'avatar', title, 'aria-label': title });
	fillAvatar(el, user, false);
	return el;
}

function fillAvatar(el, user, usePhoto = true) {
	el.style.setProperty('--c', colorFor(user.uid || user.name));
	el.replaceChildren((user.name || '?').charAt(0).toUpperCase());
	if (usePhoto && user.photo) {
		const img = h('img', { src: user.photo, alt: '', referrerpolicy: 'no-referrer' });
		img.addEventListener('error', () => img.remove());
		img.addEventListener('load', () => el.replaceChildren(img));
	}
}

function colorFor(seed) {
	const palette = ['#ff5b35', '#7c5cff', '#13a89e', '#e0457b', '#e39b0b', '#3b82f6'];
	let hash = 0;
	for (const ch of String(seed)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
	return palette[hash % palette.length];
}

async function setWake(on) {
	state.wakeWanted = on;
	try {
		if (on && document.visibilityState === 'visible') {
			state.wakeLock = await navigator.wakeLock.request('screen');
			state.wakeLock.addEventListener('release', () => { $('wakeToggle').checked = state.wakeWanted; });
		} else if (!on && state.wakeLock) {
			await state.wakeLock.release();
			state.wakeLock = null;
		}
	} catch {
		state.wakeWanted = false;
		$('wakeToggle').checked = false;
		toast('Este navegador no deja mantener la pantalla encendida');
	}
}

// ───────────────────────── Tema claro / oscuro ─────────────────────────

function themePref() {
	const pref = readPref(THEME_KEY);
	return pref === 'light' || pref === 'dark' ? pref : 'auto';
}

function applyTheme() {
	const pref = themePref();
	const theme = pref === 'auto' ? (darkQuery.matches ? 'dark' : 'light') : pref;
	document.documentElement.dataset.theme = theme;
	document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#121110' : '#f5f2ec';
	document.querySelectorAll('#themePick button').forEach(b =>
		b.setAttribute('aria-checked', String(b.dataset.value === pref)));
}

function setTheme(pref) {
	const root = document.documentElement;
	writePref(THEME_KEY, pref);
	root.classList.add('theme-anim');
	applyTheme();
	setTimeout(() => root.classList.remove('theme-anim'), 350);
}

// ───────────────────────── Eventos estáticos ─────────────────────────

function setupStaticUI() {
	onSwipeIdle(() => {
		if (state.renderPending) render();
	});

	const input = $('addInput');
	input.addEventListener('focus', openPanel);
	input.addEventListener('input', onDraftInput);
	$('addForm').addEventListener('submit', (e) => {
		e.preventDefault();
		submitDraft();
		input.focus();
	});
	$('scrim').addEventListener('click', () => {
		closePanel();
		input.blur();
	});
	// Que tocar un chip del panel no cierre el teclado.
	$('panel').addEventListener('mousedown', (e) => {
		if (e.target.closest('button')) e.preventDefault();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !$('panel').hidden) {
			closePanel();
			input.blur();
		}
	});

	$('sheetForm').addEventListener('submit', (e) => {
		e.preventDefault();
		saveSheet();
	});
	$('deleteBtn').addEventListener('click', deleteFromSheet);
	document.querySelectorAll('[data-step]').forEach(b =>
		b.addEventListener('click', () => stepQty(Number(b.dataset.step))));

	for (const dlg of [$('sheet'), $('productsSheet')]) {
		dlg.addEventListener('click', (e) => {
			if (e.target.closest('[data-close]')) return dlg.close();
			const r = dlg.getBoundingClientRect();
			const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
			if (e.target === dlg && outside) dlg.close();
		});
	}

	$('menu').addEventListener('beforetoggle', (e) => {
		if (e.newState === 'open') $('menu').style.top = `${$('menuBtn').getBoundingClientRect().bottom + 8}px`;
	});
	document.querySelectorAll('#themePick button').forEach(b =>
		b.addEventListener('click', () => setTheme(b.dataset.value)));
	darkQuery.addEventListener('change', applyTheme);
	$('productsBtn').addEventListener('click', openProducts);
	$('productsSearch').addEventListener('input', renderProducts);
	$('logoutBtn').addEventListener('click', () => {
		$('menu').hidePopover();
		state.backend?.signOut();
	});

	if ('wakeLock' in navigator) {
		$('wakeToggle').addEventListener('change', (e) => setWake(e.target.checked));
		document.addEventListener('visibilitychange', () => {
			if (state.wakeWanted && document.visibilityState === 'visible') setWake(true);
		});
	} else {
		$('wakeRow').hidden = true;
	}

	const net = () => { $('netPill').hidden = navigator.onLine; };
	window.addEventListener('online', net);
	window.addEventListener('offline', net);
	net();

	window.addEventListener('compra:error', (e) => {
		toast(e.detail?.code === 'permission-denied'
			? 'Sin permiso para guardar cambios'
			: 'No se pudo guardar. Se reintentará al recuperar conexión.');
	});
}

// Con el teclado abierto en iOS, la parte de abajo queda tapada: lo compensamos.
function setupViewport() {
	const vv = window.visualViewport;
	if (!vv) return;
	const update = () => {
		const typing = document.activeElement?.matches?.('input, textarea');
		const kb = typing ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
		document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
	};
	vv.addEventListener('resize', update);
	vv.addEventListener('scroll', update);
	document.addEventListener('focusout', () => setTimeout(update, 50));
}

function injectStoreStyles() {
	const css = STORES.map(s => {
		const dark = s.dark || s.color;
		const dot = s.dot ? `--dot:${s.dot};` : '';
		return `.s-${s.id}{--sc:${s.color};--st:${s.tint};${dot}}` +
			`:root[data-theme="dark"] .s-${s.id}{--sc:${dark};--st:color-mix(in srgb, ${dark} 16%, transparent)}`;
	}).join('\n');
	document.head.append(h('style', null, css));
}

// ───────────────────────── Utilidades ─────────────────────────

function toast(text, undo) {
	const el = $('toast');
	const btn = $('toastUndo');
	$('toastText').textContent = text;
	btn.hidden = !undo;
	btn.onclick = () => {
		el.hidden = true;
		undo?.();
	};
	el.hidden = false;
	el.style.animation = 'none';
	void el.offsetWidth;
	el.style.animation = '';
	clearTimeout(state.toastTimer);
	state.toastTimer = setTimeout(() => { el.hidden = true; }, undo ? 5000 : 2600);
}

function timeAgo(ms) {
	const min = Math.round((Date.now() - ms) / 60000);
	if (min < 1) return 'ahora mismo';
	if (min < 60) return `hace ${min} min`;
	const hours = Math.round(min / 60);
	if (hours < 24) return `hace ${hours} h`;
	const days = Math.round(hours / 24);
	return days === 1 ? 'ayer' : `hace ${days} días`;
}

function vibrate(ms) {
	navigator.vibrate?.(ms);
}

function readPref(key) {
	try { return localStorage.getItem(key); } catch { return null; }
}

function writePref(key, value) {
	try { localStorage.setItem(key, value); } catch { /* sin storage */ }
}

function h(tag, props, ...children) {
	const el = document.createElement(tag);
	for (const [k, v] of Object.entries(props || {})) {
		if (v == null || v === false) continue;
		if (k === 'class') el.className = v;
		else if (k === 'html') el.innerHTML = v;
		else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
		else el.setAttribute(k, v);
	}
	for (const c of children.flat()) {
		if (c == null || c === false || c === '') continue;
		el.append(c instanceof Node ? c : String(c));
	}
	return el;
}
