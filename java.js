window.onload = () => {
  // 1) Fade-in
  document.body.classList.remove("not-loaded");

  // 2) Init toggle button (always dark on load)
  const btn = document.getElementById("modeToggle");
  if (!btn) return;
  btn.textContent = "🌙";                  // dark icon
  // remove any persisted day-mode
  document.body.classList.remove("day-mode");

  btn.addEventListener("click", () => {
    const isDay = document.body.classList.toggle("day-mode");
    btn.textContent = isDay ? "🌞" : "🌙";
  });
};
