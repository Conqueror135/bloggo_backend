export const ROLES = {
  ADMIN: "admin",
  MEMBER: "member",
};
export const BLOG_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
};

export const TYPE_FILE = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
  mp4: "video/mp4",
};

export const STATUS_PARCEL_ENDORSER = {
  CREATING: "creating", // Trạng thái đang tạo
  BROWSING: "browsing", // Trạng thái đang duyệt
  SENDING: "sending", // Trạng thái đang gửi sang bên kiểm định
  EDORSING: "endorsing", // Trạng thái đang kiểm định
  ENDORSED: "endorsed", // Trạng thái hoàn tất kiểm định
  PUBLISH: "publish", // Trạng thái công khai
  REJECT: "reject", // Trạng thái bị từ chối kiểm định
};

export const TYPE_MEDIA = {
  IMAGE: "image", // Dạng ảnh
  VIDEO: "video", // Dạng video
};

export const STATUS_ACTIVE = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};
export const RESULT_SENDING = {
  ACCEPTED: "accepted",
  DENIED: "denied",
};

export const ROLE_TEXT = {
  admin: "Quản trị viên",
  member: "Nhân viên",
};

export const RATE_TYPE = {
  RATE_GOOD: "RATE_GOOD",
  RATE_GREATE: "RATE_GREATE",
  RATE_BAD: "RATE_BAD",
};

export const STATUS_COMMENT = {
  PENDING: {
    title: "Đang chờ duyệt",
    color: "gold",
    status: "PENDING",
  },
  ACCEPTED: {
    title: "Đã duyệt",
    color: "cyan",
    status: "ACCEPTED",
  },
  DENIED: {
    title: "Đã bị từ chối",
    color: "red",
    status: "DENIED",
  },
};
