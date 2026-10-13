// Capa de datos. Dos implementaciones con la misma interfaz:
//  - Firebase (Auth con Google + Firestore en tiempo real) → la de verdad.
//  - Demo (localStorage) → para ver la web sin configurar nada: /compra/?demo

import { productKey } from './catalogo.js';

const FIREBASE_VERSION = '12.18.0';
const LIST_ID = 'casa';

/**
 * Interfaz común de un backend:
 *   user                         { uid, name, photo, email }
 *   watchItems(onData, onError)  → unsubscribe
 *   watchProducts(onData)        → unsubscribe
 *   addItem(data)                → id (síncrono; la escritura sigue en segundo plano)
 *   updateItem(id, patch)
 *   deleteItems(ids)
 *   restoreItems(items)          // deshacer: vuelve a escribir items con su id
 *   rememberProduct(key, data, countUse)
 *   forgetProduct(key)
 *   signOut()
 */

// ───────────────────────── Firebase ─────────────────────────

export async function initFirebase(config) {
	const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
	const [appMod, authMod, fs] = await Promise.all([
		import(`${base}/firebase-app.js`),
		import(`${base}/firebase-auth.js`),
		import(`${base}/firebase-firestore.js`),
	]);

	const app = appMod.initializeApp(config);
	const auth = authMod.getAuth(app);
	auth.languageCode = 'es';

	let db;
	try {
		// Caché offline: en el súper suele haber poca cobertura.
		db = fs.initializeFirestore(app, {
			localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }),
		});
	} catch {
		db = fs.getFirestore(app);
	}

	const provider = new authMod.GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });

	return {
		onUser(cb) {
			return authMod.onAuthStateChanged(auth, cb);
		},
		// Popup en vez de redirect: el redirect falla en Safari/Chrome móviles
		// cuando la web y el authDomain de Firebase son dominios distintos.
		signIn() {
			return authMod.signInWithPopup(auth, provider);
		},
		backendFor(fbUser) {
			return firebaseBackend(fs, db, auth, authMod, fbUser);
		},
	};
}

function firebaseBackend(fs, db, auth, authMod, fbUser) {
	const listRef = fs.doc(db, 'listas', LIST_ID);
	const itemsRef = fs.collection(listRef, 'items');
	const productsRef = fs.collection(listRef, 'productos');
	const user = {
		uid: fbUser.uid,
		name: (fbUser.displayName || fbUser.email || '').split(' ')[0],
		photo: fbUser.photoURL || '',
		email: fbUser.email,
	};

	const toItem = (snap) => {
		const d = snap.data({ serverTimestamps: 'estimate' });
		return {
			id: snap.id,
			...d,
			createdAt: d.createdAt?.toMillis?.() ?? Date.now(),
			doneAt: d.doneAt?.toMillis?.() ?? null,
		};
	};

	return {
		user,
		watchItems(onData, onError) {
			return fs.onSnapshot(itemsRef,
				(qs) => onData(qs.docs.map(toItem), { fromCache: qs.metadata.fromCache }),
				onError);
		},
		watchProducts(onData) {
			return fs.onSnapshot(productsRef,
				(qs) => onData(qs.docs.map(s => ({ key: s.id, ...s.data() }))),
				() => {});
		},
		addItem(data) {
			const ref = fs.doc(itemsRef);
			// Sin await: con la caché offline la escritura se aplica al momento
			// y se sincroniza cuando haya conexión.
			fs.setDoc(ref, {
				...data,
				done: false,
				doneAt: null,
				createdAt: fs.serverTimestamp(),
				addedBy: { uid: user.uid, name: user.name, photo: user.photo },
			}).catch(reportError);
			return ref.id;
		},
		updateItem(id, patch) {
			const p = { ...patch };
			if ('done' in p) p.doneAt = p.done ? fs.serverTimestamp() : null;
			fs.updateDoc(fs.doc(itemsRef, id), p).catch(reportError);
		},
		deleteItems(ids) {
			const batch = fs.writeBatch(db);
			ids.forEach(id => batch.delete(fs.doc(itemsRef, id)));
			batch.commit().catch(reportError);
		},
		restoreItems(items) {
			const batch = fs.writeBatch(db);
			items.forEach(({ id, createdAt, doneAt, ...rest }) => {
				batch.set(fs.doc(itemsRef, id), {
					...rest,
					createdAt: fs.Timestamp.fromMillis(createdAt),
					doneAt: doneAt ? fs.Timestamp.fromMillis(doneAt) : null,
				});
			});
			batch.commit().catch(reportError);
		},
		rememberProduct(key, data, countUse) {
			if (!key) return;
			const payload = { ...data, lastUsed: fs.serverTimestamp() };
			if (countUse) payload.uses = fs.increment(1);
			fs.setDoc(fs.doc(productsRef, key), payload, { merge: true }).catch(reportError);
		},
		forgetProduct(key) {
			fs.deleteDoc(fs.doc(productsRef, key)).catch(reportError);
		},
		signOut() {
			return authMod.signOut(auth);
		},
	};
}

function reportError(err) {
	console.error(err);
	window.dispatchEvent(new CustomEvent('compra:error', { detail: err }));
}

// ───────────────────────── Demo ─────────────────────────

const DEMO_KEY = 'compra-demo-v1';

function demoSeed() {
	const now = Date.now();
	const ana = { uid: 'demo-pareja', name: 'Lucía', photo: '' };
	const yo = { uid: 'demo-yo', name: 'Jaime', photo: '' };
	const it = (name, store, category, extra = {}, by = yo, ago = 60) => ({
		id: Math.random().toString(36).slice(2, 12),
		name, store, category, qty: '', note: '', done: false, doneAt: null,
		createdAt: now - ago * 60000, addedBy: by, ...extra,
	});
	const items = [
		it('Pesto', 'mercadona', 'despensa', { note: 'El de albahaca, no el rojo' }, ana, 300),
		it('Atún para sushi', 'lidl', 'pescado', { qty: '2' }, yo, 240),
		it('Aguacates', 'any', 'fruta', { qty: '3' }, ana, 200),
		it('Leche', 'mercadona', 'lacteos', { qty: '6' }, yo, 180),
		it('Pan de molde', 'lidl', 'pan', {}, ana, 120),
		it('Tomates cherry', 'mercadona', 'fruta', {}, yo, 90),
		it('Papel de cocina', 'any', 'limpieza', {}, ana, 30),
		it('Huevos', 'mercadona', 'lacteos', { qty: '12', done: true, doneAt: now - 5 * 60000 }, yo, 400),
	];
	const products = {};
	const p = (name, store, category, uses) => { products[productKey(name)] = { name, store, category, uses }; };
	p('Pesto', 'mercadona', 'despensa', 9);
	p('Atún para sushi', 'lidl', 'pescado', 7);
	p('Aguacates', 'any', 'fruta', 8);
	p('Leche', 'mercadona', 'lacteos', 12);
	p('Pan de molde', 'lidl', 'pan', 6);
	p('Hummus', 'mercadona', 'charcuteria', 6);
	p('Salmón', 'lidl', 'pescado', 5);
	p('Yogures griegos', 'mercadona', 'lacteos', 5);
	p('Plátanos', 'any', 'fruta', 5);
	p('Café', 'lidl', 'despensa', 4);
	p('Papel higiénico', 'mercadona', 'higiene', 3);
	p('Croissants', 'lidl', 'pan', 3);
	p('Huevos', 'mercadona', 'lacteos', 7);
	return { items, products };
}

export function demoBackend() {
	const user = { uid: 'demo-yo', name: 'Jaime', photo: '', email: 'demo@nevadox.com' };
	let state;
	try { state = JSON.parse(localStorage.getItem(DEMO_KEY)); } catch { /* sin storage */ }
	if (!state?.items) state = demoSeed();

	const itemSubs = new Set();
	const productSubs = new Set();
	const emit = () => {
		try { localStorage.setItem(DEMO_KEY, JSON.stringify(state)); } catch { /* sin storage */ }
		const items = state.items.map(i => ({ ...i }));
		const products = Object.entries(state.products).map(([key, v]) => ({ key, ...v }));
		itemSubs.forEach(cb => cb(items, { fromCache: false }));
		productSubs.forEach(cb => cb(products));
	};
	window.addEventListener('storage', (e) => {
		if (e.key !== DEMO_KEY || !e.newValue) return;
		state = JSON.parse(e.newValue);
		emit();
	});
	const later = () => queueMicrotask(emit);

	return {
		user,
		demo: true,
		watchItems(cb) { itemSubs.add(cb); later(); return () => itemSubs.delete(cb); },
		watchProducts(cb) { productSubs.add(cb); later(); return () => productSubs.delete(cb); },
		addItem(data) {
			const id = Math.random().toString(36).slice(2, 12);
			state.items.push({ ...data, id, done: false, doneAt: null, createdAt: Date.now(), addedBy: { uid: user.uid, name: user.name, photo: '' } });
			later();
			return id;
		},
		updateItem(id, patch) {
			const item = state.items.find(i => i.id === id);
			if (!item) return;
			Object.assign(item, patch);
			if ('done' in patch) item.doneAt = patch.done ? Date.now() : null;
			later();
		},
		deleteItems(ids) {
			state.items = state.items.filter(i => !ids.includes(i.id));
			later();
		},
		restoreItems(items) {
			items.forEach(it => state.items.push({ ...it }));
			later();
		},
		rememberProduct(key, data, countUse) {
			if (!key) return;
			const prev = state.products[key] || { uses: 0 };
			state.products[key] = { ...prev, ...data, uses: (prev.uses || 0) + (countUse ? 1 : 0), lastUsed: Date.now() };
			later();
		},
		forgetProduct(key) {
			delete state.products[key];
			later();
		},
		async signOut() {
			try { localStorage.removeItem(DEMO_KEY); } catch { /* sin storage */ }
			location.href = location.pathname;
		},
	};
}
