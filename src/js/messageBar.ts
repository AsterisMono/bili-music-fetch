const messageBarEl = document.querySelector(
  ".message-bar"
) as HTMLParagraphElement;

let clickHandler: () => void;
export const nextMessage = async function (
  msg: string,
  style: "normal" | "link" | "error",
  onClick?: () => void
) {
  messageBarEl.addEventListener("transitionend", () => {
    messageBarEl.classList.remove("message-normal");
    messageBarEl.classList.remove("message-link");
    messageBarEl.classList.remove("message-error");
    messageBarEl.classList.add(`message-${style}`);
    messageBarEl.textContent = msg;
    messageBarEl.style.opacity = "1";
    messageBarEl.removeEventListener("click", clickHandler);
    if (onClick) {
      clickHandler = onClick;
      messageBarEl.addEventListener("click", onClick);
    }
  });
  messageBarEl.style.opacity = "0";
};
