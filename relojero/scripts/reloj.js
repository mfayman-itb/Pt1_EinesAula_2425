function actualizaReloj() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    document.getElementById('hora').textContent = `${horas}:${minutos}:${segundos}`;
    document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

setInterval(actualizaReloj, 1000);
actualizaReloj();
