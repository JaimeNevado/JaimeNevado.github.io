// Esperamos a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

	// --- 1. LÓGICA DE REVELACIÓN (SCROLL) ---
	const revealElements = document.querySelectorAll('.reveal');

	const observerOptions = {
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('active');
			}
		});
	}, observerOptions);

	revealElements.forEach(el => {
		// Le decimos al observador que vigile el elemento
		observer.observe(el);

		// FIX PARA EL VISOR 3D: Comprobamos si el elemento YA está en pantalla 
		// al cargar la página y lo activamos manualmente sin esperar al scroll
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight) {
			// Le damos un ligerísimo retraso para asegurar que CSS ya ha pintado todo
			setTimeout(() => {
				el.classList.add('active');
			}, 100);
		}
	});

	// --- 2. LÓGICA DEL MENÚ (CON PROTECCIÓN) ---
	const menuBtn = document.getElementById('menu-btn');
	const navMenu = document.getElementById('nav-menu');

	// Solo si AMBOS existen en la página, añadimos el evento
	if (menuBtn && navMenu) {
		menuBtn.addEventListener('click', () => {
			menuBtn.classList.toggle('open');
			navMenu.classList.toggle('open');
		});

		// Cerrar menú al hacer click en un link
		document.querySelectorAll('.nav-links a').forEach(link => {
			link.addEventListener('click', () => {
				menuBtn.classList.remove('open');
				navMenu.classList.remove('open');
			});
		});
	} else {
		console.warn("Navegación no encontrada en esta página. Revisa los IDs 'menu-btn' y 'nav-menu'.");
	}
});

document.addEventListener("DOMContentLoaded", function () {
	const ua = navigator.userAgent || navigator.vendor || window.opera;
	const isInstagram = ua.indexOf('Instagram') > -1;
	const isTikTok = ua.indexOf('TikTok') > -1;
	const isFB = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;

	if (isInstagram || isTikTok || isFB) {
		const notice = document.getElementById('tiktok-notice');
		if (notice) {
			// Usamos !important en línea para saltarnos el CSS
			notice.style.setProperty('display', 'block', 'important');
		}
	}
});