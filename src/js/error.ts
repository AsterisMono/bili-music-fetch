export const UNKNOWN_ERROR_DETAILMSG = "出现了意料之外的错误";
const USE_SAD_FACE_STATUS = true;
interface customError {
  status: string;
  detailMsg: string;
  originalError: any;
  sendForAnalytics: boolean;
}
export function isCustomError(error: any): error is customError {
  return error && (error as customError).detailMsg !== undefined;
}

export function packageError(
  status: string,
  detailMsg: string,
  originalError?: any,
  sendForAnalytics = false
): customError {
  if (isCustomError(originalError)) return originalError;
  else
    return {
      status: USE_SAD_FACE_STATUS ? "( ´ﾟДﾟ`)" : status,
      detailMsg,
      originalError,
      sendForAnalytics,
    };
}
