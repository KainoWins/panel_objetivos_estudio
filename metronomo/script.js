const bpmInput = document.getElementById("bpm");
const startStopButton = document.getElementById("startStop");

let intervalId = null;
let isRunning = false;

// Función para reproducir el sonido del metrónomo
function playClick() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // frecuencia del sonido en Hz
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // duración del click
}

// Función para iniciar/detener el metrónomo
function toggleMetronome() {
    if (isRunning) {
        clearInterval(intervalId);
        intervalId = null;
        startStopButton.textContent = "Iniciar";
    } else {
        const bpm = parseInt(bpmInput.value);
        const interval = (60 / bpm) * 1000; // Convertimos BPM a milisegundos
        intervalId = setInterval(playClick, interval);
        startStopButton.textContent = "Detener";
    }
    isRunning = !isRunning;
}

// Event listener para el botón de iniciar/detener
startStopButton.addEventListener("click", toggleMetronome);
