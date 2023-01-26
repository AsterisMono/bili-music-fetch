const messageBarEl = document.querySelector(
  ".message-bar"
) as HTMLParagraphElement;
export const nextMessage = async function (msg: string) {
  messageBarEl.addEventListener("transitionend", () => {
    messageBarEl.textContent = msg;
    messageBarEl.style.opacity = "1";
  });
  messageBarEl.style.opacity = "0";
};
