const statusWheel = document.querySelector(".status_wheel") as HTMLElement;
statusWheel.style.transform = "translateY(0rem)";
const statusWheelFontSize = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue(
    "--status-text-size"
  )
);

const getTranslateYFromTransform = function (transform: string) {
  return parseFloat(
    transform
      .split(" ")
      .filter((str) => str.includes("translateY"))[0]
      .slice(11)
  );
};

export const nextStatus = async function (statusMsg: string) {
  return new Promise<void>((resolve, reject) => {
    statusWheel.addEventListener("transitionend", (e) => resolve());
    const statusEl = document.createElement("p");
    statusEl.textContent = statusMsg;
    statusWheel.append(statusEl);
    const currentTranslateY = getTranslateYFromTransform(
      statusWheel.style.transform
    );
    const nextTranslateY = currentTranslateY - 2 * statusWheelFontSize;
    statusWheel.style.transform = `translateY(${nextTranslateY}rem)`;
  });
};
