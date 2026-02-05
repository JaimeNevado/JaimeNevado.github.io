// Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('active');
		}
	});
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile Menu Logic (Simple version)
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
	navLinks.classList.toggle('mobile-active');
	// Aquí puedes añadir animación a la hamburguesa
});