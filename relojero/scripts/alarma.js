let horaAlarma, sonidoAlarma, tituloAlarma, cuentaAtrasInterval;

const modal = document.getElementById('modal');
const horaAlarmaElemento = document.getElementById('hora-alarma');
const cuentaAtrasElemento = document.getElementById('cuenta-atras');
const alarmaInfo = document.getElementById('alarma-info');
const habilitarBoton = document.getElementById('habilitar');
const desactivarBoton = document.getElementById('desactivar');
const cancelarBoton = document.getElementById('cancelar');

// Nuevo input para la cuenta atrás
const tiempoInput = document.getElementById('tiempo-input');

document.getElementById('habilitar').addEventListener('click', () => {
    modal.classList.remove('hidden');
});

document.getElementById('guardar-alarma').addEventListener('click', () => {
    // Obtener valores del modal
    const horaInput = document.getElementById('hora-input').value;
    const tiempoCuentaAtras = tiempoInput.value;
    sonidoAlarma = document.getElementById('sonido-input').value;
    tituloAlarma = document.getElementById('titulo-input').value;

    if (!horaInput && !tiempoCuentaAtras) {
        alert('Por favor, selecciona una hora o configura la cuenta atrás.');
        return;
    }

    // Configuración basada en cuenta atrás
    if (tiempoCuentaAtras) {
        const [hh, mm, ss] = tiempoCuentaAtras.split(':').map(Number);
        const ahora = new Date();
        const tiempoRestanteMs = (hh * 3600 + mm * 60 + ss) * 1000;

        // Calcular la hora exacta sumando la cuenta atrás
        const horaAlarmaExacta = new Date(ahora.getTime() + tiempoRestanteMs);
        horaAlarma = horaAlarmaExacta.toTimeString().slice(0, 5);
    } else {
        // Configuración basada en hora exacta
        horaAlarma = horaInput;
    }

    // Mostrar información de la alarma
    horaAlarmaElemento.textContent = horaAlarma;
    document.querySelector('.alarma h2').textContent = tituloAlarma || 'Alarma';
    alarmaInfo.classList.remove('hidden');

    habilitarBoton.classList.add('hidden');
    desactivarBoton.classList.remove('hidden');

    // Cerrar modal
    modal.classList.add('hidden');

    // Iniciar cuenta atrás
    iniciarCuentaAtras();
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
    resetearAlarma();
}

desactivarBoton.addEventListener('click', resetearAlarma);

function resetearAlarma() {
    horaAlarma = null;
    tituloAlarma = null;
    sonidoAlarma = null;

    clearInterval(cuentaAtrasInterval);
    cuentaAtrasElemento.textContent = '--:--:--';
    horaAlarmaElemento.textContent = '--:--';
    document.querySelector('.alarma h2').textContent = 'Alarma';

    alarmaInfo.classList.add('hidden');
    habilitarBoton.classList.remove('hidden');
    desactivarBoton.classList.add('hidden');
}

// Evento para cerrar el modal al hacer clic en "Cancelar"
cancelarBoton.addEventListener('click', () => {
    modal.classList.add('hidden'); // Oculta el modal
    limpiarFormularioAlarma(); // Limpia los campos del modal (opcional)
});

// Función opcional para limpiar los campos del modal
function limpiarFormularioAlarma() {
    document.getElementById('hora-input').value = '';
    document.getElementById('titulo-input').value = '';
    document.getElementById('sonido-input').value = 'alarma.mp3'; // Restablece el sonido por defecto
}
