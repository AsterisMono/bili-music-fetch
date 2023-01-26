const progressBarEl = document.querySelector(".progress-bar") as HTMLDivElement;

export const setProgress = async function (ratio: number) {
  progressBarEl.style.width = `${Math.round(ratio * 100)}%`;
};

export const setProgressColor = async function (color: string) {
  progressBarEl.style.backgroundColor = color;
};
