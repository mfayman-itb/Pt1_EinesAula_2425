let horaAlarma, sonidoAlarma, tituloAlarma, tiempoRestanteMs, cuentaAtrasInterval;

const modal = document.getElementById('modal');
const modalAlarma = document.getElementById('modal-alarma'); // Nuevo modal al sonar
const horaAlarmaElemento = document.getElementById('hora-alarma');
const cuentaAtrasElemento = document.getElementById('cuenta-atras');
const tituloAlarmaElemento = document.getElementById('alarma-titulo');
const alarmaInfo = document.getElementById('alarma-info');
const habilitarBoton = document.getElementById('habilitar');
const desactivarBoton = document.getElementById('desactivar');
const tiempoInput = document.getElementById('tiempo-input');
const horaInput = document.getElementById('hora-input');

// **VALIDAR OPCIONES MUTUAS**
horaInput.addEventListener('input', () => {
    if (horaInput.value) tiempoInput.disabled = true; // Desactiva cuenta atrás
    else tiempoInput.disabled = false;
});

tiempoInput.addEventListener('input', () => {
    if (tiempoInput.value) horaInput.disabled = true; // Desactiva hora exacta
    else horaInput.disabled = false;
});

// ABRIR MODAL
document.getElementById('habilitar').addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// BOTÓN CANCELAR
document.getElementById('cancelar').addEventListener('click', () => {
    modal.classList.add('hidden');
});

// GUARDAR ALARMA
document.getElementById('guardar-alarma').addEventListener('click', () => {
    sonidoAlarma = document.getElementById('sonido-input').value;
    tituloAlarma = document.getElementById('titulo-input').value;

    // VALIDACIÓN
    if (!horaInput.value && !tiempoInput.value) {
        alert('Por favor, selecciona una hora o configura la cuenta atrás.');
        return;
    }

    // CONFIGURAR CUENTA ATRÁS
    if (tiempoInput.value) {
        const [hh, mm, ss] = tiempoInput.value.split(':').map(Number);
        tiempoRestanteMs = (hh * 3600 + mm * 60 + ss) * 1000;
        iniciarCuentaAtras();
    } else {
        horaAlarma = horaInput.value;
        calcularCuentaAtrasDesdeHora();
    }

    tituloAlarmaElemento.textContent = tituloAlarma || 'Alarma';
    alarmaInfo.classList.remove('hidden');
    habilitarBoton.classList.add('hidden');
    desactivarBoton.classList.remove('hidden');
    modal.classList.add('hidden');
});

// INICIAR CUENTA ATRÁS
function iniciarCuentaAtras() {
    const tiempoFinal = Date.now() + tiempoRestanteMs;

    cuentaAtrasInterval = setInterval(() => {
        const tiempoActual = Date.now();
        const diferencia = tiempoFinal - tiempoActual;

        if (diferencia <= 0) {
            clearInterval(cuentaAtrasInterval);
            cuentaAtrasElemento.textContent = '00:00:00';
            reproducirAlarma();
            return;
        }

        actualizarTiempoRestante(diferencia);
    }, 1000);
}

// ACTUALIZAR TIEMPO RESTANTE
function actualizarTiempoRestante(ms) {
    const horas = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const minutos = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const segundos = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    cuentaAtrasElemento.textContent = `${horas}:${minutos}:${segundos}`;
}

// CUENTA ATRÁS DESDE HORA EXACTA
function calcularCuentaAtrasDesdeHora() {
    const [hora, minuto] = horaAlarma.split(':');
    const ahora = new Date();
    const alarmaTime = new Date();
    alarmaTime.setHours(hora, minuto, 0, 0);

    if (alarmaTime < ahora) alarmaTime.setDate(alarmaTime.getDate() + 1);

    tiempoRestanteMs = alarmaTime - ahora;
    iniciarCuentaAtras();
}

// REPRODUCIR ALARMA Y MOSTRAR MODAL
function reproducirAlarma() {
    const audio = new Audio(`sounds/${sonidoAlarma}`);
    audio.play();

    // MOSTRAR MODAL DE ALARMA
    document.getElementById('modal-alarma-hora').textContent = obtenerHoraActual();
    document.getElementById('modal-alarma-titulo').textContent = tituloAlarma || '¡Alarma!';
    modalAlarma.classList.remove('hidden');
}

// OBTENER HORA ACTUAL FORMATEADA
function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString();
}

// CERRAR MODAL DE ALARMA
document.getElementById('cerrar-alarma').addEventListener('click', () => {
    modalAlarma.classList.add('hidden');
    resetearAlarma();
});

// DESACTIVAR ALARMA
desactivarBoton.addEventListener('click', resetearAlarma);

function resetearAlarma() {
    clearInterval(cuentaAtrasInterval);
    cuentaAtrasElemento.textContent = '--:--:--';
    horaAlarmaElemento.textContent = '--:--';
    tituloAlarmaElemento.textContent = 'Alarma';

    alarmaInfo.classList.add('hidden');
    habilitarBoton.classList.remove('hidden');
    desactivarBoton.classList.add('hidden');
    tiempoInput.disabled = false;
    horaInput.disabled = false;
}
