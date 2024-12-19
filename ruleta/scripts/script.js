// Seleccionar el elemento de audio
const spinSound = document.getElementById('spin-sound');

// Ajustar el centro de la ruleta para que quede centrada en el canvas
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-btn');
const winnerDiv = document.getElementById('winner');

let names = [];
let startAngle = 0;
let arc = 0;
const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8A2BE2', '#FF00FF', '#FFD700', '#FF1493', '#00FA9A', '#1E90FF', '#FF4500', '#7FFF00', '#9400D3', '#EE82EE', '#4B0082'];

let spinAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

// Cargar nombres desde el archivo .txt
async function loadNames() {
    const response = await fetch('names.txt');
    const text = await response.text();
    names = text.split('\n').filter(name => name.trim() !== '');
    
    // Calcular el ángulo por sección según el número de nombres
    arc = Math.PI * 2 / names.length; 

    drawWheel();
}

// Dibujar la ruleta
function drawWheel() {
    const centerX = canvas.width / 2;  // Centro del canvas
    const centerY = canvas.height / 2; // Centro del canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujo de la ruleta (segmentos)
    for (let i = 0; i < names.length; i++) {
        const angle = startAngle + i * arc; // Ángulo de cada sección
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 250, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.save();

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";

        // Calcular el ángulo central para cada nombre
        const textAngle = angle + arc / 2; 

        // Posición en el borde exterior de la ruleta (en el radio adecuado)
        const x = centerX + Math.cos(textAngle) * 180;
        const y = centerY + Math.sin(textAngle) * 180;

        // Posicionamos el texto
        ctx.translate(x, y);

        // Invertimos la rotación para que apunte al centro (solo si está en el lado derecho)
        if (textAngle > Math.PI / 2 && textAngle < 3 * Math.PI / 2) {
            ctx.rotate(textAngle + Math.PI);  // Invertimos el texto en el lado derecho
        } else {
            ctx.rotate(textAngle);  // No invertimos el texto en el lado izquierdo
        }

        // Escribir el texto centrado en su ubicación
        ctx.fillText(names[i], -ctx.measureText(names[i]).width / 2, 0);
        ctx.restore();
    }
}

// Control del botón
spinButton.addEventListener('click', () => {
    if (isSpinning) return; // Evita múltiples giros simultáneos
    isSpinning = true;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // Tiempo de giro aleatorio (3-7 segundos)
    startSpinSound();
    rotateWheel();
});

// Función para iniciar el sonido cuando comienza a girar
function startSpinSound() {
    spinSound.currentTime = 0; // Reiniciar el sonido
    spinSound.play(); // Reproducir el sonido
}

// Función para girar la ruleta con animación fluida
function rotateWheel() {
    spinTime += 20;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }

    // Reducir progresivamente la velocidad
    const spinProgress = spinTime / spinTimeTotal;
    const easing = Math.pow(1 - spinProgress, 2); // Efecto de desaceleración
    spinAngle = easing * 20; // Velocidad máxima inicial
    startAngle += (spinAngle * Math.PI) / 180;

    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    isSpinning = false;
    const degrees = (startAngle * 180 / Math.PI) % 360;
    const index = Math.floor((360 - degrees) / (360 / names.length)) % names.length;
    winnerDiv.textContent = `Ganador: ${names[index]}`;
    
    // Detener el sonido cuando la ruleta se detiene
    spinSound.pause();
    spinSound.currentTime = 0; // Reiniciar el sonido
}

loadNames();
