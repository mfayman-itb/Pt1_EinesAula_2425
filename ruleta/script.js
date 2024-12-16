// Ajustar el centro de la ruleta para que quede centrada en el canvas
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-btn');
const winnerDiv = document.getElementById('winner');

let names = []; // Lista de nombres desde el archivo
let startAngle = 0;
let arc = 0; // Ángulo de cada sección (se calculará dinámicamente)
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300', '#DAF7A6', '#900C3F', '#581845'];

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
    arc = Math.PI * 2 / names.length; // Ángulo para cada sección (360 grados / número de nombres)

    drawWheel();
}

// Dibujar la ruleta (centrada en el canvas)
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

        // Configurar el estilo del texto
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";  // Tamaño de la fuente

        // Calcular el ángulo central para cada nombre
        const textAngle = angle + arc / 2; // Ángulo central del segmento

        // Posición en el borde exterior de la ruleta (en el radio adecuado)
        const x = centerX + Math.cos(textAngle) * 180; // Ajusta el radio si es necesario
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

    // Dibujar la flecha que indica el ganador
    drawArrow(centerX, centerY);
}

// Función para dibujar una flecha tradicional que apunte al ganador
function drawArrow(centerX, centerY) {
  ctx.save();
  ctx.translate(centerX + 250, centerY);  // Posiciona la flecha a la derecha de la ruleta
  ctx.rotate(Math.PI / 2);   // Rota la flecha para que apunte hacia la ruleta

  // Cuerpo de la flecha (línea recta)
  ctx.beginPath();
  ctx.moveTo(0, -10);    // Parte inferior del cuerpo de la flecha
  ctx.lineTo(60, 0);     // Línea recta hacia la punta
  ctx.lineTo(0, 10);     // Parte superior del cuerpo de la flecha
  ctx.closePath();
  ctx.fillStyle = "#FF0000"; // Color rojo
  ctx.fill();

  // Punta de la flecha (triángulo)
  ctx.beginPath();
  ctx.moveTo(60, 0);      // Base de la punta de la flecha
  ctx.lineTo(80, 10);     // Punta hacia la derecha
  ctx.lineTo(80, -10);    // Punta hacia la izquierda
  ctx.closePath();
  ctx.fillStyle = "#FF0000"; // Color rojo
  ctx.fill();

  ctx.restore();
}
// Control del botón
spinButton.addEventListener('click', () => {
    if (isSpinning) return; // Evita múltiples giros simultáneos
    isSpinning = true;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // Tiempo de giro aleatorio (3-7 segundos)
    rotateWheel();
});

// Función para girar la ruleta con animación fluida
function rotateWheel() {
    spinTime += 20; // Control del tiempo de giro
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
}

// Inicializar
loadNames();
