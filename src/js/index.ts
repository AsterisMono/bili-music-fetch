// @ts-ignore
const { createFFmpeg } = FFmpeg;
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { nextStatus } from "./statusWheel";
import { setProgress } from "./progressBar";
import { transcodeBiliVideo } from "./transcodeBiliVideo";
const bvidInput = document.querySelector(".bvid_input") as HTMLInputElement;
const submitButton = document.querySelector(".submit") as HTMLButtonElement;

const ffmpeg = createFFmpeg({
  // corePath: new URL("ffmpeg-core.js", document.location.toString()).href,
  log: true,
}) as FFmpeg;

// submitButton.addEventListener("click", () => {
//   transcodeBiliVideo(ffmpeg, bvidInput.value, nextStatus, setProgress);
// });

(async () => {
  await ffmpeg.load();
  nextStatus("等待指令");
  // submitButton.disabled = false;
})();
