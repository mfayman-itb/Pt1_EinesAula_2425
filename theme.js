document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    const boton = document.getElementById('toggle-theme');
    if (document.body.classList.contains('light-theme')) {
        boton.textContent = '☀️'; // Sol para el tema claro
    } else {
        boton.textContent = '🌙'; // Luna para el tema oscuro
    }
});
