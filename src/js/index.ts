// @ts-ignore
const { createFFmpeg } = FFmpeg;
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { nextStatus } from "./statusWheel";
import { setProgress } from "./progressBar";
import { transcodeBiliVideo } from "./transcodeBiliVideo";
import { UNKNOWN_ERROR_DETAILMSG, packageError } from "./error";
import { nextMessage } from "./messageBar";

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.zhimg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
}) as FFmpeg;

const main = async function () {
  try {
    const pathname = new URL(location.href).pathname;
    const re = new RegExp("\\/video\\/BV\\w{10}/");
    if (!re.test(pathname)) throw packageError("( ´ﾟДﾟ`)", "调用格式不正确");
    const bvid = pathname.split("/")[2];
    nextMessage(bvid);
    await transcodeBiliVideo(ffmpeg, bvid, nextStatus, setProgress);
  } catch (e) {
    const error = packageError("未知错误", UNKNOWN_ERROR_DETAILMSG, e, true);
    nextStatus(error.status);
    nextMessage(error.detailMsg);
    console.error(error);
    setProgress(0);
  }
};

(async () => {
  try {
    await ffmpeg.load();
  } catch (e) {
    nextStatus("加载失败");
    return;
  }
  main();
})();
