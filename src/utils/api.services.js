import { getByUsername } from "../models/user/User.js";
import md5 from "md5";
import DateExtension from "@joi/date";
import JoiImport from "joi";
import { TYPE_ORG } from "../constants/CONSTANTS.js";

const Joi = JoiImport.extend(DateExtension);
////////////////////////////////////////////////////////////
const checkSingleParam = async (req, res, key) => {
  const schemaId = {};
  schemaId[key] = Joi.string().min(3).max(50).required();
  const schema = Joi.object().keys(schemaId);
  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};

const checkParamAuth = async (req, res) => {
  const schemaAuth = {
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  };
  const schema = Joi.object().keys(schemaAuth);
  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};
const checkParamChangeStatus = async (req, res, key) => {
  const schemaChangeStatus = {
    user: {
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {
      newStatus: Joi.string().valid("active", "inactive", "deleted").required(),
    },
  };
  schemaChangeStatus.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeStatus);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkParamChangeStatusTypeVerifie = async (req, res, key) => {
  const schemaChangeStatus = {
    user: {
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {
      newStatus: Joi.string().valid("verified", "unverified", "blocked", "deleted").required(),
    },
  };
  schemaChangeStatus.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeStatus);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkParamChangeRole = async (req, res, key) => {
  const schemaChangeRole = {
    user: {
      //username: Joi.string().min(3).max(30).required(),
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {
      newRole: Joi.string().valid("admin", "producer", "endorser", "consumer").required(),
    },
  };
  schemaChangeRole.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeRole);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};
const checkParamPermissionUsePassword = async (req, res, keys) => {
  const schemaCreateNew = {
    user: {
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {},
  };
  for (const key of keys) {
    switch (key) {
      case "status":
        schemaCreateNew.data[key] = Joi.string().valid("active", "inactive", "deleted").required();
        break;
      case "url":
        schemaCreateNew.data[key] = Joi.string().uri().allow(null, "").required();
        break;
      case "cameraId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "mediaId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "email":
        Joi.string();
        schemaCreateNew.data[key] = Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        });
        break;
      case "phone":
        schemaCreateNew.data[key] = Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required();
        break;
      case "timeStart":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY").default(Date.now);
        break;
      case "timeEnd":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY");
        break;
      case "describe":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "publicKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKeyEncode":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "username":
        schemaCreateNew.data[key] = Joi.string().min(3).max(30).required();
        break;
      case "password":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      case "newPassword":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      default:
        schemaCreateNew.data[key] = Joi.string().min(1).max(50).required();
        break;
    }
  }
  const schema = Joi.object().keys(schemaCreateNew);
  const { error } = schema.validate(req.body);

  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};
const checkParamRegister = async (req, res) => {
  const schemaRegister = Joi.object({
    fullName: Joi.string().min(1).max(50).required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    address: Joi.string().min(3).max(50).required(),
    avatarUrl: Joi.string().allow(null, "").uri().required(),
    orgId: Joi.string().min(1).required(),
    role: Joi.string().valid("admin", "member").required(),
  });
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkParamRefreshToken = async (req, res) => {
  const schemaRefreshToken = Joi.object({
    refreshToken: Joi.string()
      .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
      .required(),
  });
  const { error } = schemaRefreshToken.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkUserAccout = async (req, res) => {
  const username = req.jwtDecoded.data.username;
  const password = req.body.user.password;
  const passwordEncode = md5(password);
  try {
    const user = await getByUsername(username);
    if (user.status) {
      if (user.data[0].password === passwordEncode) {
        if (user.data[0].status === "verified") {
          return true;
        } else {
          res.status(200).json({
            message: `Tài khoản của bạn đang ở trạng thái ${user.data[0].status}`,
            status: false,
          });
        }
      } else {
        res.status(200).json({
          message: "Mật khẩu không chính xác!",
          status: false,
        });
      }
    } else {
      res.status(200).json({
        message: "Tài khoản không tồn tại!",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra, vui lòng liên hệ quản trị viên!",
      status: false,
    });
  }
  return false;
};
const checkParamPermissionUseToken = async (req, res, keys) => {
  const schemaCreateNew = {
    data: {},
  };
  for (const key of keys) {
    switch (key) {
      case "status":
        schemaCreateNew.data[key] = Joi.string().valid("active", "inactive", "deleted").required();
        break;
      case "stepIndex":
        schemaCreateNew.data[key] = Joi.number().required();
        break;
      case "url":
        schemaCreateNew.data[key] = Joi.string()
          // .uri()
          .allow(null, "")
          .required();
        break;
      case "cameraId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "mediaId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "email":
        Joi.string();
        schemaCreateNew.data[key] = Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        });
        break;
      case "phone":
        schemaCreateNew.data[key] = Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required();
        break;
      case "timeStart":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY").default(Date.now);
        break;
      case "timeEnd":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY");
        break;
      case "describe":
        schemaCreateNew.data[key] = Joi.string().allow(null, "");
        break;
      case "publicKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKeyEncode":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "username":
        schemaCreateNew.data[key] = Joi.string().min(3).max(30).required();
        break;
      case "password":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      case "newPassword":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      default:
        schemaCreateNew.data[key] = Joi.string().allow(null, "");
        break;
    }
  }
  const schema = Joi.object().keys(schemaCreateNew);
  const { error } = schema.validate(req.body);

  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};
const checkParamNoPermission = async (req, res, keys) => {
  const schemaCreateNew = {
    data: {},
  };
  for (const key of keys) {
    switch (key) {
      case "status":
        schemaCreateNew.data[key] = Joi.string().valid("verified", "unverified", "blocked", "deleted").required();
        break;
      case "type":
        schemaCreateNew.data[key] = Joi.string().valid("system", "endorser", "producer", "consumer").required();
        break;
      case "url":
        schemaCreateNew.data[key] = Joi.string().uri().allow(null, "").required();
        break;
      case "cameraId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "mediaId":
        schemaCreateNew.data[key] = Joi.string().allow(null, "").required();
        break;
      case "email":
        Joi.string();
        schemaCreateNew.data[key] = Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        });
        break;
      case "phone":
        schemaCreateNew.data[key] = Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required();
        break;
      case "timeStart":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY").default(Date.now);
        break;
      case "timeEnd":
        schemaCreateNew.data[key] = Joi.date().format("DD/MM/YYYY");
        break;
      case "describe":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "publicKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKey":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "privateKeyEncode":
        schemaCreateNew.data[key] = Joi.string().min(1).required();
        break;
      case "username":
        schemaCreateNew.data[key] = Joi.string().min(3).max(30).required();
        break;
      case "password":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      case "newPassword":
        schemaCreateNew.data[key] = Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));
        break;
      default:
        schemaCreateNew.data[key] = Joi.string().min(1).max(50).required();
        break;
    }
  }
  const schema = Joi.object().keys(schemaCreateNew);
  const { error } = schema.validate(req.body);

  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }
  return true;
};
const checkParamChangeStatusTypeActive = async (req, res, key) => {
  const schemaChangeStatus = {
    user: {
      username: Joi.string().min(3).max(30).required(),
    },
    data: {
      newStatus: Joi.string().valid("active", "inactive", "deleted").required(),
    },
  };
  schemaChangeStatus.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeStatus);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkParamChangeStatusTypeActivePassword = async (req, res, key) => {
  const schemaChangeStatus = {
    user: {
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {
      newStatus: Joi.string().valid("active", "inactive", "deleted").required(),
    },
  };
  schemaChangeStatus.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeStatus);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};
const checkParamChangeStatusTypeSign = async (req, res, key) => {
  const schemaChangeStatus = {
    user: {
      password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    },
    data: {
      newStatus: Joi.string().valid("unsigned", "signed", "deleted").required(),
      signImg: Joi.string().allow(null, "").uri(),
    },
  };
  schemaChangeStatus.data[key] = Joi.string().required();
  const schema = Joi.object().keys(schemaChangeStatus);

  const { error } = schema.validate(req.body);
  if (error) {
    for (const mes of error.details) {
      res.status(400).json({ message: mes.message, status: false });
      break;
    }
    return false;
  }

  return true;
};

function validateActive(body) {
  const schema = Joi.object().keys({
    active: Joi.string().valid(true, false).required(),
  });
  const { value, error } = schema.validate(body);
  if (error && error.details) {
    return { error };
  }
  return { value };
}
export default {
  checkParamChangeStatusTypeSign: checkParamChangeStatusTypeSign,
  checkUserAccout: checkUserAccout,
  checkSingleParam: checkSingleParam,
  checkParamAuth: checkParamAuth,
  checkParamChangeStatus: checkParamChangeStatus,
  checkParamPermissionUsePassword: checkParamPermissionUsePassword,
  checkParamChangeRole: checkParamChangeRole,
  checkParamRefreshToken: checkParamRefreshToken,
  checkParamRegister: checkParamRegister,
  checkParamChangeStatusTypeVerifie: checkParamChangeStatusTypeVerifie,
  checkParamChangeStatusTypeActive: checkParamChangeStatusTypeActive,
  checkParamPermissionUseToken: checkParamPermissionUseToken,
  checkParamNoPermission: checkParamNoPermission,
  checkParamChangeStatusTypeActivePassword: checkParamChangeStatusTypeActivePassword,
  validateActive: validateActive,
};
