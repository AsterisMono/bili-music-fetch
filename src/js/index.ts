// @ts-ignore
const { createFFmpeg } = FFmpeg;
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { nextStatus } from "./statusWheel";
import { setProgress, setProgressColor } from "./progressBar";
import { transcodeBiliVideo } from "./transcodeBiliVideo";
import { UNKNOWN_ERROR_DETAILMSG, isCustomError, packageError } from "./error";
const bvidInput = document.querySelector(".bvid_input") as HTMLInputElement;
const submitButton = document.querySelector(".submit") as HTMLButtonElement;

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.zhimg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
}) as FFmpeg;

submitButton.addEventListener("click", async () => {
  try {
    await transcodeBiliVideo(ffmpeg, bvidInput.value, nextStatus, setProgress);
  } catch (e) {
    const error = packageError("未知错误", UNKNOWN_ERROR_DETAILMSG, e, true);
    nextStatus(error.status);
    setProgress(0);
  }
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
