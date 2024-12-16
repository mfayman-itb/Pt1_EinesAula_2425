document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    const boton = document.getElementById('toggle-theme');
    if (document.body.classList.contains('light-theme')) {
        boton.textContent = '☀️';
    } else {
        boton.textContent = '🌙';
    }
});
