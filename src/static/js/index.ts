// @ts-ignore
const { createFFmpeg } = FFmpeg;
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { nextStatus } from "./statusWheel";
import { transcodeBiliVideo } from "./transcodeBiliVideo";
const bvidInput = document.querySelector(".bvid_input") as HTMLInputElement;
const submitButton = document.querySelector(".submit") as HTMLButtonElement;

const ffmpeg = createFFmpeg({
  log: true,
}) as FFmpeg;

submitButton.addEventListener("click", () => {
  transcodeBiliVideo(ffmpeg, bvidInput.value, async (msg: string) => {
    await nextStatus(msg);
  });
});

(async () => {
  await ffmpeg.load();
  submitButton.disabled = false;
})();
