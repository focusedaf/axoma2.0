export function initAntiCheat() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      alert("You switched tabs! Not allowed!");
    }
  });

  window.addEventListener("blur", () => {
    alert("You left the window! Not allowed!");
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());

  ["copy", "paste", "cut"].forEach((event) => {
    document.addEventListener(event, (e) => e.preventDefault());
  });

  setInterval(() => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      alert("DevTools detected!");
    }
  }, 1000);
}
