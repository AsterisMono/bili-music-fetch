import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, offerFileAsDownload } from "./util";
import { UNKNOWN_ERROR_DETAILMSG, packageError } from "./error";
export const transcodeBiliVideo = async function (
  ffmpeg: FFmpeg,
  bvid: string,
  statusCb: (statusMsg: string) => Promise<void>,
  progressCb: (ratio: number) => Promise<void>
) {
  // 1. fetch video info
  progressCb(0.1);
  await statusCb("正在获取视频信息");
  let cid: string,
    coverImageUrl: string,
    videoTitle: string,
    videoUploader: string,
    videoUrl: string;
  try {
    const infoResult = await fetch(
      `https://bili-fetch.nanekino8629.workers.dev/video/${bvid}`
    );
    ({ cid, coverImageUrl, videoTitle, videoUploader, videoUrl } =
      await infoResult.json());
  } catch (e) {
    throw packageError("视频信息获取失败", "请检查BV号是否正确", e);
  }

  // stage: raw(mp4), converted(mp3), bundled(mp3)
  const getFileName = (stage: string, ext: string) =>
    `${bvid}_${cid}_${stage}.${ext}`;

  // 2. download video
  progressCb(0.2);
  await statusCb("正在下载视频");
  try {
    ffmpeg.FS(
      "writeFile",
      getFileName("raw", "mp4"),
      await fetchFile(videoUrl, (ratio) => progressCb(0.2 + ratio * 0.3))
    );
  } catch (e) {
    throw packageError("下载失败", UNKNOWN_ERROR_DETAILMSG, e, true);
  }

  // 3. convert video to audio
  progressCb(0.5);
  await statusCb("正在进行转换");
  ffmpeg.setProgress(({ ratio }) => progressCb(0.5 + ratio * 0.3));
  try {
    await ffmpeg.run(
      "-i",
      getFileName("raw", "mp4"),
      "-q:a",
      "0",
      "-map",
      "a",
      getFileName("converted", "mp3")
    );
  } catch (e) {
    throw packageError("转换失败", UNKNOWN_ERROR_DETAILMSG, e, true);
  }
  ffmpeg.setProgress(() => undefined);

  // 4. bundle metadata
  progressCb(0.8);
  await statusCb("正在给文件附魔");
  try {
    ffmpeg.FS(
      "writeFile",
      getFileName("albumart", "jpg"),
      await fetchFile(coverImageUrl, (ratio) => progressCb(0.8 + ratio * 0.1))
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
  } catch (e) {
    throw packageError("附加信息失败", UNKNOWN_ERROR_DETAILMSG, e, true);
  }

  // 5. finish up
  progressCb(1.0);
  await statusCb("即将完成...");
  offerFileAsDownload(ffmpeg, getFileName("out", "mp3"), `${videoTitle}.mp3`);
};
