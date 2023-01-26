import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { UNKNOWN_ERROR_DETAILMSG, packageError } from "./error";

export const fetchFile = async (
  URL: string,
  progressCb: (ratio: number) => Promise<void>
) => {
  try {
    const res = await fetch(URL, {
      referrer: "",
    });
    if (!res.ok)
      throw packageError("下载失败", `${res.status} ${res.statusText}`);
    if (!res.body) throw packageError("下载失败", "请使用现代浏览器");
    const contentEncoding = res.headers.get("content-encoding");
    const contentLength = res.headers.get(
      contentEncoding ? "x-file-size" : "content-length"
    );
    const total = parseInt(contentLength!, 10);
    let loaded = 0;
    const progressedResponse = new Response(
      new ReadableStream({
        start(controller) {
          const reader = res.body!.getReader();
          read();
          function read() {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                loaded += value.byteLength;
                progressCb(loaded / total);
                controller.enqueue(value);
                read();
              })
              .catch((error) => {
                console.error(error);
                controller.error(error);
              });
          }
        },
      })
    );
    const data = await progressedResponse.arrayBuffer();
    return new Uint8Array(data);
  } catch (e) {
    if (e.isCustomError) throw e;
    else throw packageError("下载失败", UNKNOWN_ERROR_DETAILMSG, e, true);
  }
};

export function offerFileAsDownload(
  ffmpeg: FFmpeg,
  filename: string,
  downloadName: string
) {
  const data = ffmpeg.FS("readFile", filename);
  let downloadEl = document.createElement("a");
  downloadEl.download = downloadName;
  downloadEl.style.display = "none";
  downloadEl.href = URL.createObjectURL(new Blob([data.buffer]));
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
}
