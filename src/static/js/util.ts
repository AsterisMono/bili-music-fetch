import type { FFmpeg } from "@ffmpeg/ffmpeg";

export const fetchFile = async (URL: string) => {
  const res = await fetch(URL, {
    referrer: "",
  });
  const data = await res.arrayBuffer();
  return new Uint8Array(data);
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
