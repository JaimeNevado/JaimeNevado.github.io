function toggleMenu() {
    const dropdown = document.getElementById('configDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

window.addEventListener('click', function (e) {
    const menu = document.getElementById('configDropdown');
    const icon = document.querySelector('.config-icon');
    if (!menu.contains(e.target) && !icon.contains(e.target)) {
        menu.style.display = 'none';
    }
});
