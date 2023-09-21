// Update slider values
countdownSlider.addEventListener("input", () => {
    countdownValue.textContent = countdownSlider.value + "s";
});

timeLimitSlider.addEventListener("input", () => {
    timeLimitValue.textContent = timeLimitSlider.value + "s";
});

intervalSlider.addEventListener("input", () => {
    intervalValue.textContent = intervalSlider.value + "ms";
});

randomDelaySlider.addEventListener("input", () => {
    randomDelayValue.textContent = randomDelaySlider.value + "ms";
});

startButton.addEventListener("click", start);
canvas.addEventListener("click", end);

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  if (installButton) {
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
      // Show the installation prompt
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          }
          deferredPrompt = null;
        });
      }
    });
  }
}

const audio = [
  new Audio('assets/audio/front-left.mp3'),
  new Audio('assets/audio/front.mp3'),
  new Audio('assets/audio/front-right.mp3'),
  new Audio('assets/audio/left.mp3'),
  new Audio('assets/audio/center.mp3'),
  new Audio('assets/audio/right.mp3'),
  new Audio('assets/audio/back-left.mp3'),
  new Audio('assets/audio/back.mp3'),
  new Audio('assets/audio/back-right.mp3'),
]
const whistleAudio = new Audio('assets/audio/end.mp3');
const calloutText = ["FL", "F", "FR", "L", "C", "R", "BL", "B", "BR"];

let running = false;
let endTime, countdown, countdownInterval;
const context = canvas.getContext('2d');
async function start() {
  running = true;
  canvas.style.display = 'block';
  await openFullscreen();
  endTime = new Date().getTime() + parseInt(timeLimitSlider.value) * 1000;
  countdown = 1 + parseInt(countdownSlider.value);
  countdownLoop();
  if (countdown > 0 && running) countdownInterval = setInterval(countdownLoop, 1000);
}

function countdownLoop() {
  if (!running) return clearInterval(countdownInterval)
  if (--countdown == 0) {
    clearInterval(countdownInterval);
    if (startEndWhistleCheckbox.checked) whistleAudio.play();
    setTimeout(calloutLoop, 1000);
  } 

  // clear screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);

  // draw text
  const fontSize = Math.min(canvas.width, canvas.height) / 2;
  context.font = fontSize + "px sans-serif";
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const countdownText = countdown > 0 ? countdown : "GO";
  context.fillText(countdownText, canvas.width / 2, canvas.height / 2);
}

function calloutLoop() {
  if (!running) return
  if (new Date().getTime() > endTime) {
    if (startEndWhistleCheckbox.checked) whistleAudio.play();
    return end();
  }

  // schedule next loop
  const interval = parseInt(intervalSlider.value);
  const randomDelay = Math.floor(Math.random() * parseInt(randomDelaySlider.value));
  const totalDelay = interval + randomDelay;
  setTimeout(calloutLoop, totalDelay);
  setTimeout(clearCanvas, totalDelay * .8);

  // pick callout, disable center by default
  let callout = Math.floor(Math.random() * 9);
  while (callout == 4) callout = Math.floor(Math.random() * 9);

  // play sound
  if (textToSpeechCheckbox.checked) audio[callout].play();
  
  // show new rect
  clearCanvas();
  const squareWidth = canvas.width / 3;
  const squareHeight = canvas.height / 3;
  const xOffset = squareWidth * (callout % 3);
  const yOffset = squareHeight * Math.floor(callout / 3)
  const hue = 40 * callout;
  context.fillStyle = `hsl(${hue},100%,50%)`;
	context.fillRect(xOffset, yOffset, squareWidth, squareHeight);

  // draw text
  const fontSize = Math.min(canvas.width, canvas.height) / 6;
  context.font = fontSize + "px sans-serif";
  context.fillStyle = "#000";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(calloutText[callout], xOffset + squareWidth / 2, yOffset + squareHeight / 2);
}

function clearCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function end() {
  running = false
  canvas.style.display = 'none';
  closeFullscreen();
}

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    return elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    return elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    return elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
} 