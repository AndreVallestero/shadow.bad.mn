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

// JavaScript in your HTML file or in an external script
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Display a button or UI element to trigger the prompt
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
