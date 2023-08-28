export const VALIDATION_ERROR = "VALIDATION_ERROR";
export const VALIDATION_CODE_ITEM = "VALIDATION_CODE_ITEM";
export const VALIDATION_FILE = "VALIDATION_FILE";
export const NOT_FOUND_MODEL = "NOT_FOUND_MODEL";
export const NOT_FOUND_USER = "NOT_FOUND_USER";
export const NOT_FOUND_IMAGE = "NOT_FOUND_IMAGE";
export const NOT_FOUND_CATEGORY = "NOT_FOUND_CATEGORY";
export const NOT_FOUND_DRONE = "NOT_FOUND_CATEGORY";
export const NOT_FOUND_ADMIN_UNIT = "NOT_FOUND_ADMIN_UNIT";

export const FILE_MISSING = "FILE_MISSING";
export const FILE_UPLOAD = "FILE_UPLOAD";
export const SEND_MAIL_SUCCESS = "SEND_MAIL_SUCCESS";
export const OTHER_ERROR = "OTHER_ERROR";
export const DUPLICATE_KEY = "DUPLICATE_KEY";
export const DUPLICATE_CATEGORY_CODE = "DUPLICATE_CATEGORY_CODE";
export const DUPLICATE_LINE_CODE = "DUPLICATE_LINE_CODE";
export const EMAIL_NOT_EXISTED = "EMAIL_NOT_EXISTED";
export const VALIDATION_TOKEN = "VALIDATION_TOKEN";
export const VALIDATION_DRONE_STATUS = "VALIDATION_DRONE_STATUS";
export const NO_TOKEN = "NO_TOKEN";
export const CANNT_EDIT = "CANNOT_EDIT";
export const CATE_DONT_HAVE_POSI_RECORD = "CATE_DONT_HAVE_POSI_RECORD";
export const ITEM_DONT_HAVE_POSI_RECORD = "ITEM_DONT_HAVE_POSI_RECORD";
export const POSI_DONT_HAVE_POSI_RECORD = "POSI_DONT_HAVE_POSI_RECORD";
export const DUPLICATE_POSITION_NAME_DATA = "DUPLICATE_POSITION_NAME_DATA";

const messageError = {
  DOCUMENT_TYPE_NOT_SUPPORTED: {
    vi: "Loại tài liệu không hỗ trợ",
    en: "Unsupported Document Type",
  },
  OTHER_ERROR: {
    vi: "Có lỗi không mong muốn xin vui lòng liên hệ quản trị viên",
    en: "other error",
  },
  NOT_FOUND_MODEL: {
    vi: "Không tìm thấy đối tượng",
    en: "not fount model",
  },
  DUPLICATE_POSITION_NAME_DATA: {
    vi: "Tên vị trí đã tồn tại, vui lòng kiểm tra và thử lại",
    en: "Position name existed, please check and try again",
  },

  VALIDATION_TOKEN: {
    vi: "Token không hợp lệ hoặc đã hết hạn, vui lòng kiểm tra lại.",
    en: "Token is invalid or has expired, please login again.",
  },
  NO_TOKEN: {
    vi: "Request bị từ trối vì yêu cầu cần token xác thực",
    en: "Request is rejected because it requires an authentication token",
  },
  ERR_COMPARE_PASSWORD_FAILT: {
    vi: "Mật khẩu hiện tại không đúng, vui lòng kiểm tra và thử lại",
    en: "password current failt, please check and try again",
  },
  ERR_GET_DATA: {
    vi: "Có lỗi trong quá trình truy vấn dữ liệu, vui lòng báo cáo lại quản trị viên",
    en: " have error when get data, please report admin",
  },
  ERR_DELETE_DATA: {
    vi: "Có lỗi trong quá trình xoá dữ liệu, vui lòng báo cáo lại quản trị viên",
    en: " have error when delete data, please report admin",
  },
  ERR_ADD_DATA: {
    vi: "Có lỗi trong quá trình thêm mới dữ liệu, vui lòng báo cáo lại quản trị viên",
    en: " have error when add new data, please report admin",
  },
  ERR_UPDATE_DATA: {
    vi: "Có lỗi trong quá trình cập nhật dữ liệu, vui lòng báo cáo lại quản trị viên",
    en: " have error when update data, please report admin",
  },
  ERR_DUPLICATE_EMAIL: {
    vi: "Email đã tồn tại, vui lòng kiểm tra và thử lại",
    en: "Email already exists, please check and try again",
  },
  DUPLICATE_CODE: {
    vi: "Mã nhân viên đã tồn tại",
    en: "Code already exists",
  },
  DUPLICATE_USERNAME: {
    vi: "Tên tài khoản đã tồn tại",
    en: "User name already exists",
  },
  DUPLICATE_KEY: {
    vi: "Dữ liệu đã tồn tại",
    en: "Data already exists",
  },
  DUPLICATE_CATEGORY_CODE: {
    vi: "Mã hạng mục đã tồn tại",
    en: "Data already exists",
  },

  VALIDATION_ERROR: {
    vi: "Dữ liệu không phù hợp",
    en: "Validation error",
  },

  ERR_WRONG_PASSWORD: {
    vi: "Nhập sai mật khẩu.",
    en: "Enter wrong password.",
  },
  ERR_ACCOUNT_DOES_NOT_EXIST: {
    vi: "Tài khoản không tồn tại.",
    en: "Account does not exist.",
  },

  ERR_CAN_NOT_DELETE_UNIT: {
    vi: "Bạn không thể xoá đơn vị, vì đơn vị đã được dùng để tạo dữ liệu, vui lòng kiểm tra và thử lại",
    en: "You can not delete the unit, because the unit used to create data, please check and try again",
  },
  ERR_UNIT_NAME_IS_REQUIRED: {
    vi: "Tên đơn vị là trường bắt buộc, vui lòng kiểm tra và thử lại",
    en: "Unit name is required, please check and try again",
  },
  ERR_UNIT_CODE_EXIST: {
    vi: "Mã đơn vị đã tồn tại, vui lòng kiểm tra và thử lại",
    en: "Unit code is existed, please check and try again",
  },
  ERR_USER_NOT_EXIST: {
    vi: "Nhân viên đã bị xoá hoặc không tồn tại, vui lòng kiểm tra và thử lại",
    en: "User has been deleted or does not exist, please check and try again",
  },
  ERR_FILE_MISSING: {
    vi: "Chưa có dữ liệu tải lên, vui lòng kiểm tra và thử lại",
    en: "No data uploads yet, please check and try again",
  },
  ERR_PERMISION_UNIT: {
    vi: "Bạn không có quyền truy vấn dữ liệu ở đơn vị đang đang tìm kiếm, vui lòng kiểm tra và thử lại",
    en: "You don't have permision query data from unit, please check and try again.",
  },
  ERR_USER_DUPLICATE_CODE: {
    vi: "Mã nhân viên đã tồn tại, vui lòng kiểm tra và thử lại",
    en: "User code has been existed, please check and try again",
  },
  ERR_DATA_NOT_EXITS: {
    vi: "Dữ liệu không tồn tại hoặc đã bị xoá, vui lòng kiểm tra và thử lại",
    en: "Data not exist or deleted, please check and try again",
  },
  ERR_VALIDATE_STATUS: {
    vi: "Trạng thái không hợp lệ, vui lòng kiểm tra và thử lại.",
    en: "Invalid status, please check and try again.",
  },

  ERR_VALIDATION_FILE_IMAGE: {
    vi: "Bạn chưa có dữ liệu ảnh tải lên",
    en: "You don't have data image upload",
  },

  ERR_EMAIL_NOT_EXISTED: {
    vi: "Email không tồn tại",
    en: "Email not exist",
  },
  ERR_IMAGE_ID_REQUIRED: {
    vi: "Tên ảnh bắt buộc nhập, vui lòng kiểm tra và thử lại.",
    en: "Image name name is required, please check and try again.",
  },

  ERR_API_NOT_FOUND: {
    vi: "Không tìm thấy API",
    en: "API not found",
  },

  MAIL_NOT_FOUND: {
    vi: "Email không thuộc bất kỳ người dùng nào, vui lòng kiểm tra lại",
    en: "Email does not belong to any user, please check again",
  },
};

export function getMessageError(message, err, langId) {
  if (messageError[message] && messageError[message][langId]) {
    return messageError[message][langId];
  }
  if (!message && typeof err === "object" && err) {
    switch (err.name) {
      case "ValidationError":
        return messageError.VALIDATION_ERROR[langId];
      case "CastError":
        return messageError.VALIDATION_ERROR[langId];
      default:
        if (err.errmsg && err.errmsg.includes("duplicate key") > 0) {
          return messageError.DUPLICATE_KEY[langId];
        }
    }

    if (messageError.OTHER_ERROR[langId]) return messageError.OTHER_ERROR[langId];

    return messageError.OTHER_ERROR[langId];
  }
  if (message && typeof message === "string") {
    return message;
  }
  if (messageError.OTHER_ERROR[langId]) return messageError.OTHER_ERROR[langId];

  return messageError.OTHER_ERROR.vi;
}
