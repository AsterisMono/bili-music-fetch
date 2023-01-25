const statusWheel = document.querySelector(".status-wheel") as HTMLElement;
statusWheel.style.transform = "translateY(0rem)";

let statusIterationsCount = 0;
const getStatusWheelFontSize = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--status-text-size"
    )
  );

const computeTranslateY = function (iterations: number) {
  return `translateY(${-2 * getStatusWheelFontSize() * iterations}rem)`;
};

export const nextStatus = async function (statusMsg: string) {
  return new Promise<void>((resolve, reject) => {
    statusWheel.addEventListener("transitionend", (e) => resolve());
    const statusEl = document.createElement("p");
    statusEl.classList.add("status-item");
    statusEl.textContent = statusMsg;
    statusWheel.append(statusEl);
    statusIterationsCount++;
    statusWheel.style.transform = computeTranslateY(statusIterationsCount);
  });
};

const mediaWatcher = window.matchMedia("(max-width: 640px)");
mediaWatcher.addEventListener("change", (e) => {
  statusWheel.style.transform = computeTranslateY(statusIterationsCount);
});
