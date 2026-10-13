// Deslizar a la izquierda para borrar, al estilo de Mail en iOS:
//  - un poco  → se queda abierto el botón «Eliminar»
//  - mucho    → al soltar se borra con animación
// La fila tiene esta forma: .item-swipe > (.swipe-action + .item)

const ACTION_W = 96; // ancho del botón cuando la fila se queda abierta
const ARM_RATIO = 0.55; // fracción del ancho a partir de la cual se borra al soltar
const FLICK_SPEED = 0.5; // px/ms: un gesto rápido abre aunque sea corto

let openWrap = null;
let active = 0; // gestos o animaciones en curso
let onIdle = () => { };

// Mientras haya un dedo encima o una animación, la app no debe repintar la lista.
export const swipeActive = () => active > 0;
export const onSwipeIdle = (fn) => { onIdle = fn; };

const begin = () => { active++; };
const finish = () => {
	active = Math.max(0, active - 1);
	if (!active) onIdle();
};

document.addEventListener('pointerdown', (e) => {
	if (openWrap && !openWrap.contains(e.target)) closeOpenSwipe();
}, true);

export function closeOpenSwipe() {
	if (!openWrap) return;
	const wrap = openWrap;
	openWrap = null;
	wrap.classList.remove('is-open');
	setOffset(wrap, 0);
}

function openSwipe(wrap) {
	if (openWrap && openWrap !== wrap) closeOpenSwipe();
	openWrap = wrap;
	wrap.classList.add('is-open');
	setOffset(wrap, -ACTION_W);
}

function setOffset(wrap, x) {
	const p = -x;
	wrap.querySelector('.item').style.transform = x ? `translateX(${x}px)` : '';
	wrap.style.setProperty('--p', `${p}px`);
	wrap.querySelector('.swipe-label').style.opacity = String(Math.min(1, Math.max(0, (p - 20) / 50)));
}

export function attachSwipe(wrap, { onDelete }) {
	const row = wrap.querySelector('.item');
	let start = null;
	let dragging = false;
	let base = 0;
	let x = 0;
	let armed = false;
	let last = { x: 0, t: 0 };
	let speed = 0;

	row.addEventListener('pointerdown', (e) => {
		if ((e.pointerType === 'mouse' && e.button !== 0) || wrap.classList.contains('is-removing')) return;
		delete wrap.dataset.swiped;
		start = { x: e.clientX, y: e.clientY, id: e.pointerId };
		base = wrap === openWrap ? -ACTION_W : 0;
		last = { x: e.clientX, t: e.timeStamp };
		speed = 0;
	});

	row.addEventListener('pointermove', (e) => {
		if (!start || e.pointerId !== start.id) return;
		const dx = e.clientX - start.x;
		const dy = e.clientY - start.y;

		if (!dragging) {
			if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
			// Gesto vertical: es scroll, no nos metemos.
			if (Math.abs(dy) >= Math.abs(dx)) {
				start = null;
				return;
			}
			dragging = true;
			armed = false;
			begin();
			if (openWrap && openWrap !== wrap) closeOpenSwipe();
			try { row.setPointerCapture(e.pointerId); } catch { /* el puntero ya no existe */ }
			wrap.classList.add('is-dragging');
		}

		const width = wrap.offsetWidth;
		x = Math.max(-width, Math.min(0, base + dx));
		const nowArmed = -x > width * ARM_RATIO;
		if (nowArmed !== armed) {
			armed = nowArmed;
			wrap.classList.toggle('is-armed', armed);
			navigator.vibrate?.(10);
		}
		setOffset(wrap, x);

		const dt = e.timeStamp - last.t;
		if (dt > 0) speed = (e.clientX - last.x) / dt;
		last = { x: e.clientX, t: e.timeStamp };
	});

	const end = (e) => {
		if (!start || e.pointerId !== start.id) return;
		start = null;
		if (!dragging) return;
		dragging = false;
		wrap.dataset.swiped = '1';
		wrap.classList.remove('is-dragging');

		if (e.type === 'pointercancel') {
			wrap.classList.remove('is-armed');
			if (base) openSwipe(wrap);
			else setOffset(wrap, 0);
		} else if (armed) {
			onDelete();
		} else {
			wrap.classList.remove('is-armed');
			if (-x > ACTION_W / 2 || speed < -FLICK_SPEED) openSwipe(wrap);
			else {
				if (openWrap === wrap) closeOpenSwipe();
				setOffset(wrap, 0);
			}
		}
		finish();
	};
	row.addEventListener('pointerup', end);
	row.addEventListener('pointercancel', end);

	// Tras arrastrar, el «click» que dispara el navegador no debe abrir la ficha ni marcar.
	// Y con la fila abierta, tocarla solo la cierra.
	wrap.addEventListener('click', (e) => {
		if (e.target.closest('.swipe-action')) return;
		if (wrap.dataset.swiped) {
			e.preventDefault();
			e.stopPropagation();
			delete wrap.dataset.swiped;
		} else if (wrap === openWrap) {
			e.preventDefault();
			e.stopPropagation();
			closeOpenSwipe();
		}
	}, true);

	wrap.querySelector('.swipe-action').addEventListener('click', () => onDelete());
}

// La fila sale disparada hacia la izquierda y después se cierra el hueco.
// Si era la última de su pasillo, se pliega el pasillo entero.
export function animateRemoval(wrap) {
	begin();
	if (openWrap === wrap) openWrap = null;
	wrap.classList.remove('is-open');
	wrap.classList.add('is-removing', 'is-armed');
	setOffset(wrap, -wrap.offsetWidth);

	const card = wrap.parentElement;
	const section = card?.closest('.group, .cart');
	const target = section && card.childElementCount === 1 ? section : wrap;

	return new Promise((resolve) => {
		setTimeout(() => {
			target.classList.add('is-collapsing');
			target.style.height = `${target.offsetHeight}px`;
			void target.offsetHeight;
			target.style.height = '0px';
			if (target === section) {
				target.style.marginTop = '0px';
				target.style.opacity = '0';
			}
			setTimeout(() => {
				resolve();
				finish();
			}, 280);
		}, 230);
	});
}

// Pista para descubrir el gesto: la primera vez, la fila asoma el rojo y vuelve.
export function peekHint(wrap) {
	if (!wrap || active) return;
	begin();
	wrap.classList.add('is-peeking');
	setOffset(wrap, -64);
	setTimeout(() => {
		setOffset(wrap, 0);
		setTimeout(() => {
			wrap.classList.remove('is-peeking');
			finish();
		}, 400);
	}, 650);
}
