import DateExtension from "@joi/date";
import JoiImport from "joi";
import bcrypt from "bcryptjs";
// import { ROLES } from "../../constants/CONSTANTS";

const Joi = JoiImport.extend(DateExtension);

export default {
  encryptPassword(palinText) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(palinText, salt);
  },
  comparePassword(plainText, encrypedPassword) {
    return bcrypt.compareSync(plainText, encrypedPassword);
  },
  validateSignup(body, method) {
    const objSchema = {
      //   role_id: Joi.string().required().label('Vai trò').error((errors) => {
      //     return {
      //       template: 'không được bỏ trống',
      //       context: {
      //         errors: errors.length,
      //         codes: errors.map((err) => err.type)
      //       }
      //     };
      //   }),
      email: Joi.string()
        .label("Email")
        .email()
        .messages({
          "string.email": "Email không đúng định dạng",
        })
        .required()
        .messages({
          "string.empty": "Email không được bỏ trống",
          "any.required": "Email là một trường bắt buộc",
        }),

      username: Joi.string().required().label("Tài khoản").messages({
        "string.empty": "Tên tài khoản không được bỏ trống",
        "any.required": "Tên tài khoản là một trường bắt buộc",
      }),
      password: Joi.string().required().label("Mật khẩu").messages({
        "string.empty": "Mật khẩu không được bỏ trống",
        "any.required": "Mật khẩu là một trường bắt buộc",
      }),
      gender: Joi.string().allow(""),
      birthday: Joi.string().allow("").allow(null),
    };

    let newSchema = {};
    if (method === "POST") {
      newSchema = { ...objSchema };
    } else {
      Object.keys(objSchema).forEach((key) => {
        if (objSchema[key] && body[key]) {
          newSchema[key] = objSchema[key];
        }
      });
    }

    const schema = Joi.object().keys(newSchema);
    const { value, error } = schema.validate(body, {
      allowUnknown: true,
      abortEarly: true,
    });
    if (error && error.details) {
      return { error };
    }
    return { valueUser: value };
  },
  validateIssueAccount(body, method) {
    const objSchema = {
      // name: Joi.string()
      //   .required()
      //   .label("Tên người dùng")
      //   .messages({
      //       "string.empty": "Tên người dùng không được bỏ trống",
      //       "any.required": "Tên người dùng là một trường bắt buộc",
      //   }),
      // role: Joi.string().valid(ROLES.ADMIN, ROLES.MEMBER).required(),
      email: Joi.string()
        .label("Email")
        .email()
        .messages({
          "string.email": "Email không đúng định dạng",
        })
        .required()
        .messages({
          "string.empty": "Email không được bỏ trống",
          "any.required": "Email là một trường bắt buộc",
        }),

      username: Joi.string().required().label("Tài khoản").messages({
        "string.empty": "Tên tài khoản không được bỏ trống",
        "any.required": "Tên tài khoản là một trường bắt buộc",
      }),
    };

    let newSchema = {};
    if (method === "POST") {
      newSchema = { ...objSchema };
    } else {
      Object.keys(objSchema).forEach((key) => {
        if (objSchema[key] && body[key]) {
          newSchema[key] = objSchema[key];
        }
      });
    }

    const schema = Joi.object().keys(newSchema);
    const { value, error } = schema.validate(body, {
      allowUnknown: true,
      abortEarly: true,
    });
    if (error && error.details) {
      return { error };
    }
    return { valueUser: value };
  },
  validateIssueAccountOrg(body, method) {
    const objSchema = {
      // name: Joi.string()
      //   .required()
      //   .label("Tên người dùng")
      //   .messages({
      //       "string.empty": "Tên người dùng không được bỏ trống",
      //       "any.required": "Tên người dùng là một trường bắt buộc",
      //   }),
      email: Joi.string()
        .label("Email")
        .email()
        .messages({
          "string.email": "Email không đúng định dạng",
        })
        .required()
        .messages({
          "string.empty": "Email không được bỏ trống",
          "any.required": "Email là một trường bắt buộc",
        }),

      username: Joi.string().required().label("Tài khoản").messages({
        "string.empty": "Tên tài khoản không được bỏ trống",
        "any.required": "Tên tài khoản là một trường bắt buộc",
      }),
    };

    let newSchema = {};
    if (method === "POST") {
      newSchema = { ...objSchema };
    } else {
      Object.keys(objSchema).forEach((key) => {
        if (objSchema[key] && body[key]) {
          newSchema[key] = objSchema[key];
        }
      });
    }

    const schema = Joi.object().keys(newSchema);
    const { value, error } = schema.validate(body, {
      allowUnknown: true,
      abortEarly: true,
    });
    if (error && error.details) {
      return { error };
    }
    return { valueUser: value };
  },
  validateLogin(body) {
    const schema = Joi.object().keys({
      username: Joi.string().required().label("Tài khoản").messages({
        "string.empty": "Tài khoản không được bỏ trống",
        "any.required": "Tài khoản là một trường bắt buộc",
      }),
      password: Joi.string().required().label("Mật khẩu").messages({
        "string.empty": "Mật khẩu không được bỏ trống",
        "any.required": "Mật khẩu là một trường bắt buộc",
      }),
    });
    const { value, error } = schema.validate(body);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
