let horaAlarma, sonidoAlarma, tituloAlarma, cuentaAtrasInterval;

const modal = document.getElementById('modal');
const horaAlarmaElemento = document.getElementById('hora-alarma');
const cuentaAtrasElemento = document.getElementById('cuenta-atras');
const alarmaInfo = document.getElementById('alarma-info');
const habilitarBoton = document.getElementById('habilitar');
const desactivarBoton = document.getElementById('desactivar');
const cancelarBoton = document.getElementById('cancelar');  // Aquí obtenemos el botón de cancelar

document.getElementById('habilitar').addEventListener('click', () => {
    modal.classList.remove('hidden');
});

document.getElementById('guardar-alarma').addEventListener('click', () => {
    // Obtener valores del modal
    horaAlarma = document.getElementById('hora-input').value;
    sonidoAlarma = document.getElementById('sonido-input').value;
    tituloAlarma = document.getElementById('titulo-input').value;

    // Validación básica
    if (!horaAlarma) {
        alert('Por favor, selecciona una hora válida.');
        return;
    }

    // Mostrar información de la alarma
    horaAlarmaElemento.textContent = horaAlarma;
    document.querySelector('.alarma h2').textContent = tituloAlarma || 'Alarma';
    alarmaInfo.classList.remove('hidden');

    // Cambiar botón "Guardar" a "Desactivar"
    habilitarBoton.classList.add('hidden');
    desactivarBoton.classList.remove('hidden');

    // Cerrar modal
    modal.classList.add('hidden');

    // Iniciar cuenta atrás
    iniciarCuentaAtras();
});

// Evento para cancelar el modal
cancelarBoton.addEventListener('click', () => {
    // Cerrar el modal sin hacer nada
    modal.classList.add('hidden');
});

function iniciarCuentaAtras() {
    if (cuentaAtrasInterval) clearInterval(cuentaAtrasInterval);

    const [hora, minuto] = horaAlarma.split(':');
    const alarmaTime = new Date();
    alarmaTime.setHours(hora, minuto, 0, 0);

    cuentaAtrasInterval = setInterval(() => {
        const ahora = new Date();
        const tiempoRestante = alarmaTime - ahora;

        if (tiempoRestante <= 0) {
            clearInterval(cuentaAtrasInterval);
            reproducirAlarma();
            return;
        }

        // Actualizar cuenta atrás
        const horas = String(Math.floor(tiempoRestante / 3600000)).padStart(2, '0');
        const minutos = String(Math.floor((tiempoRestante % 3600000) / 60000)).padStart(2, '0');
        const segundos = String(Math.floor((tiempoRestante % 60000) / 1000)).padStart(2, '0');
        cuentaAtrasElemento.textContent = `${horas}:${minutos}:${segundos}`;
    }, 1000);
}

function reproducirAlarma() {
    const audio = new Audio(`sounds/${sonidoAlarma}`);
    audio.play();
    alert(`⏰ ¡Es hora de la alarma! ${tituloAlarma || ''}`);

    // Desactivar alarma automáticamente después de sonar
    resetearAlarma();
}

desactivarBoton.addEventListener('click', () => {
    // Reiniciar alarma manualmente
    resetearAlarma();
});

function resetearAlarma() {
    // Restablecer los valores de la alarma
    horaAlarma = null;
    tituloAlarma = null;
    sonidoAlarma = null;

    // Detener cuenta atrás
    clearInterval(cuentaAtrasInterval);
    cuentaAtrasElemento.textContent = '--:--:--';
    horaAlarmaElemento.textContent = '--:--';
    document.querySelector('.alarma h2').textContent = 'Alarma';

    // Ocultar información de la alarma
    alarmaInfo.classList.add('hidden');

    // Cambiar botones
    habilitarBoton.classList.remove('hidden');
    desactivarBoton.classList.add('hidden');
}
