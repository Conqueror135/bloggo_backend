import { getMessageError } from "../constants/messageError";
import { getMessage } from "../constants/messageSuccess";
import CommonError from "../error/CommonError";
// import { loggerResponse, loggerError } from '../logs/middleware';

export async function success(res, docs, code = 200, message = undefined) {
  // save log system.
  const messageSuccess = getMessage(message, res.lang_id || "vi");
  try {
    return res.status(code).json({
      success: true,
      data: docs,
      message: messageSuccess,
    });
  } catch (e) {
    return false;
  }
}

export async function error(res, code, message, err = CommonError.UNEXPECTED_ERROR) {
  const errResponse = typeof err === "function" ? err() : err;
  const codeResponse = code || (errResponse && errResponse.status_code) || 400;
  const messageResponse = message || errResponse.message;
  const messageErr = getMessageError(messageResponse, errResponse, res.lang_id || "vi");
  const response = {
    success: false,
    message: messageErr,
  };
  try {
    return res.status(codeResponse).json(response);
  } catch (e) {
    return false;
  }
}
