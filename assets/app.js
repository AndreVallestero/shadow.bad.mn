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