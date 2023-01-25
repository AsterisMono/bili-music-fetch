// @ts-ignore
const { createFFmpeg } = FFmpeg;
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { nextStatus } from "./statusWheel";
import { setProgress } from "./progressBar";
import { transcodeBiliVideo } from "./transcodeBiliVideo";
const bvidInput = document.querySelector(".bvid_input") as HTMLInputElement;
const submitButton = document.querySelector(".submit") as HTMLButtonElement;

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.zhimg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
}) as FFmpeg;

submitButton.addEventListener("click", () => {
  transcodeBiliVideo(ffmpeg, bvidInput.value, nextStatus, setProgress);
});

(async () => {
  try {
    await ffmpeg.load();
  } catch (e) {
    nextStatus("加载失败");
    return;
  }
  nextStatus("等待指令");
  submitButton.disabled = false;
})();
