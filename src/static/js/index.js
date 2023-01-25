const { createFFmpeg } = FFmpeg;
const bvidInput = document.querySelector(".bvid_input");
const submitButton = document.querySelector(".submit");
const progressText = document.querySelector(".progress");
const fetchFile = async (_data) => {
  const res = await fetch(_data, {
    corePath: new URL('static/js/ffmpeg-core.js', document.location).href,
    referrer: "",
  });
  const data = await res.arrayBuffer();
  return new Uint8Array(data);
};

function offerFileAsDownload(filename, downloadName) {
  const data = ffmpeg.FS("readFile", filename);
  let downloadEl = document.createElement("a");
  downloadEl.download = downloadName;
  downloadEl.style.display = "none";
  downloadEl.href = URL.createObjectURL(new Blob([data.buffer]), {
    type: "audio/mp3",
  });
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
}

const ffmpeg = createFFmpeg({
  log: true,
});

const transcodeBiliVideo = async function (bvid, progressCb) {
  // 1. fetch video info
  progressCb("正在获取视频信息");
  const infoResult = await fetch(
    `https://bili-fetch.nanekino8629.workers.dev/video/${bvid}`
  );
  const { cid, coverImageUrl, videoTitle, videoUploader, videoUrl } =
    await infoResult.json();

  // stage: raw(mp4), converted(mp3), bundled(mp3)
  const getFileName = (stage, ext) => `${bvid}_${cid}_${stage}.${ext}`;

  // 2. download video
  progressCb("正在下载视频");
  ffmpeg.FS("writeFile", getFileName("raw", "mp4"), await fetchFile(videoUrl));

  // 3. convert video to audio
  ffmpeg.setProgress(({ ratio }) => {
    progressCb("正在进行转换", ratio);
  });
  await ffmpeg.run(
    "-i",
    getFileName("raw", "mp4"),
    "-q:a",
    "0",
    "-map",
    "a",
    getFileName("converted", "mp3")
  );
  ffmpeg.setProgress(() => undefined);

  // 4. bundle metadata
  progressCb("正在给文件附魔");
  ffmpeg.FS(
    "writeFile",
    getFileName("albumart", "jpg"),
    await fetchFile(coverImageUrl)
  );
  await ffmpeg.run(
    "-i",
    getFileName("converted", "mp3"),
    "-i",
    getFileName("albumart", "jpg"),
    "-map",
    "0:0",
    "-map",
    "1:0",
    "-c",
    "copy",
    "-id3v2_version",
    "3",
    "-metadata:s:v",
    `title="Album cover"`,
    "-metadata:s:v",
    `comment="Cover (Front)"`,
    "-metadata",
    `artist=${videoUploader}`,
    "-metadata",
    `title=${videoTitle}`,
    getFileName("out", "mp3")
  );

  // 5. finish up
  progressCb("即将完成...");
  offerFileAsDownload(getFileName("out", "mp3"), `${videoTitle}.mp3`);
};

submitButton.addEventListener("click", () => {
  transcodeBiliVideo(
    bvidInput.value,
    (msg, ratio) =>
      (progressText.textContent = !isNaN(ratio)
        ? `${msg}: ${Math.round(ratio * 100)}%`
        : `${msg}...`)
  );
});

(async () => {
  await ffmpeg.load();
  submitButton.disabled = false;
})();
