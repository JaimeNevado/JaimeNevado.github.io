// --- Lógica del Menú Hamburguesa ---
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
	if (!menuOpen) {
		menuBtn.classList.add('open');
		navMenu.classList.add('open');
		menuOpen = true;
	} else {
		menuBtn.classList.remove('open');
		navMenu.classList.remove('open');
		menuOpen = false;
	}
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
	link.addEventListener('click', () => {
		menuBtn.classList.remove('open');
		navMenu.classList.remove('open');
		menuOpen = false;
	});
});

// --- Lógica de Revelación (Hacer visible el contenido) ---
const observerOptions = {
	threshold: 0.1 // Se activa cuando el 10% del elemento es visible
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('active');
		}
	});
}, observerOptions);

// Aplicar el observador a todos los elementos con la clase .reveal
document.querySelectorAll('.reveal').forEach(el => {
	observer.observe(el);
});

window.addEventListener('scroll', () => {
	const scrollIndicator = document.querySelector('.scroll-indicator');
	if (window.scrollY > 50) {
		scrollIndicator.classList.add('fade-out');
	} else {
		scrollIndicator.classList.remove('fade-out');
	}
});