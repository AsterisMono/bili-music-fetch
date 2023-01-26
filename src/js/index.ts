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

(async () => {
  const loadFFmpeg = async () => {
    try {
      await ffmpeg.load();
    } catch (e) {
      throw packageError("加载失败", "FFmpeg 运行时加载失败", e, true);
    }
  };
  try {
    await loadFFmpeg();
    const pathname = new URL(location.href).pathname;
    const re = new RegExp("\\/video\\/BV\\w{10}/");
    const re2 = new RegExp("\\/video\\/BV\\w{10}");
    if (!(re.test(pathname) || re2.test(pathname)))
      throw packageError("参数错误", "调用格式不正确");
    const bvid = pathname.split("/")[2];
    nextMessage(bvid, "normal");
    await transcodeBiliVideo(ffmpeg, bvid, nextStatus, setProgress);
    await new Promise((resolve, reject) => setTimeout(resolve, 700));
    nextMessage("喜欢吗？", "link", () => {
      nextMessage("谢谢。开发者已经收到你的👍。", "normal");
    });
  } catch (e) {
    const error = packageError("未知错误", UNKNOWN_ERROR_DETAILMSG, e, true);
    nextStatus(error.status);
    nextMessage(error.detailMsg, "error");
    console.error(error);
    setProgress(0);
  }
})();
