import generator from "generate-password";
import fs from "fs";
import User from "./model";
import userService from "./service";
import sendEmail from "../../utils/mailHelper";
import getConfig from "../../config/config";
import * as responseAction from "../../utils/responseAction";
import { ROLES, ROLE_TEXT } from "../../constants/CONSTANTS";
import Roles from "../roles/model";
import jwtHelper from "../../helpers/jwt.helper";
import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import * as fileUtils from "../../utils/fileUtils";
import "dotenv/config";

const sizeOf = require("image-size");
const sharp = require("sharp");

const { tempDir } = fileUtils;

const config = getConfig(process.env.NODE_ENV);
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default {
  async signup(req, res) {
    try {
      const { valueUser, error } = userService.validateSignup(req.body, "POST");
      if (error) {
        return res.status(400).json(error.details[0].message);
      }

      const userInfo = await User.findOne({
        $or: [{ email: valueUser.email }, { username: valueUser.username }],
      });
      if (userInfo) {
        if (valueUser.username === userInfo.username) {
          return res.status(400).json({ success: false, message: "Tài khoản đã được đăng ký" });
        }
        if (valueUser.email === userInfo.email) {
          return res.status(400).json({ success: false, message: "Email đã được đăng ký" });
        }
      }

      valueUser.active = true;

      const encryptedPass = userService.encryptPassword(valueUser.password);

      valueUser.password = encryptedPass;
      const user = await User.create(valueUser);
      if (valueUser.email) {
        const mailOptions = {
          from: `Bloggo <${config.mail.auth.user}>`,
          to: valueUser.email,
          subject: "Đăng ký tài khoản thành công",
          html: `<h2>Bạn đã đăng ký thành công tài khoản tại Bloggo, Thông tin tài khoản</h2>
                <div><strong>Họ tên: </strong>${valueUser.name}</div>
                <div><strong>Tên tài khoản: </strong>${valueUser.username}</div>    
                <div><strong>Số điện thoại: </strong>${valueUser.phone}</div>
                <div><strong>Email: </strong>${valueUser.email}</div>
                <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`,
        };

        await sendEmail(mailOptions);
      }

      delete user.password;

      const token = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
      return res.json({ token, ...user });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async createSystemAdminAccout() {
    try {
      const randomPassword = generator.generate({
        length: 8,
        numbers: true,
      });
      const valueUser = {
        fullname: config.name_admin,
        email: config.email_admin,
        username: config.username_admin,
        password: randomPassword,
        phone: config.phone_admin,
        is_sysadmin: true,
        active: true,
      };

      const userInfo = await User.findOne({
        $or: [{ email: config.email_admin }, { username: config.username_admin }],
      });
      if (!userInfo) {
        const initRole = await Roles.create({
          name: ROLE_TEXT.admin,
          fields: { is_admin: true },
        });
        if (initRole) {
          valueUser.role = initRole._id;
        }
        const encryptedPass = userService.encryptPassword(valueUser.password);

        valueUser.password = encryptedPass;
        const user = await User.create(valueUser);
        if (user.email) {
          const mailOptions = {
            from: `Bloggo <${config.mail.auth.user}>`,
            to: valueUser.email,
            subject: "Tạo tài khoản quản trị viên hệ thống thành công",
            html: `<h2>Bạn đã được tạo thành công tài khoản quản trị viên tại Bloggo. Thông tin tài khoản:</h2>
                  <div><strong>Tên tài khoản: </strong>${valueUser.username}</div>    
                  <div><strong>Mật khẩu: </strong>${randomPassword}</div>
                  <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`,
          };
          await sendEmail(mailOptions);
        }

        return "Create syadmin account successful!";
      }
      return "";
    } catch (err) {
      return "Create syadmin account failed!";
    }
  },
  async login(req, res) {
    try {
      const { value, error } = userService.validateLogin(req.body);
      if (error) {
        return res.status(400).json(error.details[0].message);
      }

      const user = await User.findOne({
        username: value.username,
        is_deleted: false,
      }).lean();
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản hoặc mật khẩu không đúng",
        });
      }

      const authenticted = userService.comparePassword(value.password, user.password);
      if (authenticted) {
        if (!user.active) {
          return res.status(401).json({
            success: false,
            message: "Tài khoản đã tạm khóa, vui lòng liên hệ quản trị viên.",
          });
        }
        delete user.password;

        const token = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        return res.json({ token, ...user });
      }
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async authenticate(req, res) {
    try {
      const decodeToken = req.jwtDecoded;
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập!",
        });
      }
      const user = await User.findById(decodeToken._id).populate("role");
      if (!user) {
        return responseAction.error(res, 404, "");
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async findAllInActive(req, res) {
    try {
      // req.query.active = false;
      req.query.role = ROLES.ADMIN;
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }
      const users = await User.paginate(query, options);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async findAll(req, res) {
    try {
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }
      options.select = "-password -is_deleted";
      const users = await User.paginate(query, options);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return responseAction.error(res, 404, "");
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOneAndUpdate({ _id: id }, { is_deleted: true }, { useFindAndModify: false });
      if (!user) {
        return responseAction.error(res, 404, "");
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const { valueUser, error } = userService.validateSignup(req.body, "PUT");
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0]);
      }

      const userInfo = await User.findOne({
        $and: [
          { _id: { $ne: id } },
          {
            $or: [{ email: valueUser.email }, { username: valueUser.username }],
          },
        ],
      });
      if (userInfo) {
        if (valueUser.username === userInfo.username) {
          return res.status(400).json({ success: false, message: "Tài khoản đã được đăng ký" });
        }
        if (valueUser.email === userInfo.email) {
          return res.status(400).json({ success: false, message: "Email đã được đăng ký" });
        }
      }
      const user = await User.findOneAndUpdate({ _id: id }, valueUser, {
        new: true,
        useFindAndModify: false,
      });
      if (!user) {
        return responseAction.error(res, 404, "");
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async changePassword(req, res) {
    try {
      const user = await User.findOne({
        is_deleted: false,
        _id: req.jwtDecoded._id,
      });
      if (!user) {
        return responseAction.error(res, 404, "");
      }

      const authenticted = userService.comparePassword(req.body.old_password, user.password);
      if (!authenticted) {
        return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng" });
      }

      const encryptedPass = userService.encryptPassword(req.body.new_password);

      const userUpdate = await User.findOneAndUpdate(
        { _id: req.jwtDecoded._id },
        { password: encryptedPass },
        { useFindAndModify: false },
      );

      // let mailOptions = {
      //   from: `Bloggo <${config.mail.auth.user}>`, // sender address
      //   to: userUpdate.email, // list of receivers
      //   subject: 'Đổi mật khẩu thành công', // Subject line
      //   html: `<h2>Mật khẩu mới của bạn là <b style="color: red">${req.body.new_password}</b></h2>
      //           </br>
      //           <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>` // html body
      // };

      // sendEmail(mailOptions, (err) => {
      //   if (err) {
      //     return responseAction.error(res, 400)
      //   } else {

      //   }
      // });
      return res.status(200).json(userUpdate);
    } catch (err) {
      return responseAction.error(res, 500, err);
    }
  },

  async updateInfo(req, res) {
    try {
      const id = req.jwtDecoded._id;
      const { valueUser, error } = userService.validateSignup(req.body, "PUT");

      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0]);
      }
      delete valueUser.password;
      delete valueUser.username;

      const user = await User.findOneAndUpdate({ _id: id }, valueUser, {
        new: true,
        useFindAndModify: false,
      }).populate("role");
      if (!user) {
        return responseAction.error(res, 404, "");
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async forgotPasswordMail(req, res) {
    try {
      const user = await User.findOne({
        is_deleted: false,
        email: req.body.email,
      });

      if (!user) {
        return responseAction.error(res, 404, "");
      }

      const token = await jwtHelper.generateToken(user, accessTokenSecret, "50m");

      const url = `${config.host_admin}/reset-password?token=${token}`;
      const mailOptions = {
        from: `Bloggo <${config.mail.auth.user}>`, // sender address
        to: user.email, // list of receivers
        subject: "Quên mật khẩu", // Subject line
        html: `<p>Bạn có yêu cầu thay đổi mật khẩu trên Bloggo</p>
                </br>
                <p>Vui lòng click vào link để thay đổi mật khẩu : ${url} </p>`, // html body
      };

      sendEmail(mailOptions, (err) => {
        if (err) {
          return responseAction.error(res, 400);
        }
        return true;
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async resetPassword(req, res) {
    try {
      const user = await User.findOne({
        is_deleted: false,
        _id: req.jwtDecoded._id,
      });
      if (!user) {
        return responseAction.error(res, 404, "");
      }

      const encryptedPass = userService.encryptPassword(req.body.password);

      const userUpdate = await User.findOneAndUpdate(
        { _id: req.jwtDecoded._id },
        { password: encryptedPass },
        { new: true },
      );

      const mailOptions = {
        from: `Bloggo <${config.mail.auth.user}>`, // sender address
        to: userUpdate.email, // list of receivers
        subject: "Đổi mật khẩu thành công", // Subject line
        html: `<h2>Mật khẩu mới của bạn là <b style="color: red">${req.body.password}</b></h2>
                </br>
                <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`, // html body
      };

      sendEmail(mailOptions, (err) => {
        if (err) {
          return responseAction.error(res, 400);
        }
        return true;
      });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async issueAccountMember(req, res) {
    try {
      const decodeToken = req.jwtDecoded;
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập!",
        });
      }

      const { valueUser, error } = userService.validateIssueAccount(req.body, "POST");
      if (error) {
        return res.status(400).json(error.details[0].message);
      }
      const randomPassword = generator.generate({
        length: 8,
        numbers: true,
      });
      const userInfo = await User.findOne({
        $or: [{ email: valueUser.email }, { username: valueUser.username }],
      });
      if (userInfo) {
        if (valueUser.username === userInfo.username) {
          return res.status(400).json({ success: false, message: "Tài khoản đã được đăng ký" });
        }
        if (valueUser.email === userInfo.email) {
          return res.status(400).json({ success: false, message: "Email đã được đăng ký" });
        }
      }

      valueUser.active = true;
      valueUser.password = randomPassword;

      const encryptedPass = userService.encryptPassword(valueUser.password);
      valueUser.password = encryptedPass;
      const user = await User.create(valueUser);
      if (valueUser.email) {
        const mailOptions = {
          from: `Bloggo <${config.mail.auth.user}>`,
          to: valueUser.email,
          subject: "Cấp tài khoản thành viên",
          html: `<h3>Bạn đã được cấp tài khoản quản tại Bloggo. Thông tin tài khoản:</h3>
                  <div><strong>Email: </strong>${valueUser.email}</div>
                <div><strong>Tên tài khoản: </strong>${valueUser.username}</div>    
                <div><strong>Mật khẩu: </strong>${randomPassword}</div>
                <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`,
        };

        await sendEmail(mailOptions);
      }

      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async issueAccount(req, res) {
    try {
      const decodeToken = req.jwtDecoded;
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập!",
        });
      }
      const { valueUser, error } = userService.validateIssueAccount(req.body, "POST");
      if (error) {
        return res.status(400).json(error.details[0].message);
      }
      const randomPassword = generator.generate({
        length: 8,
        numbers: true,
      });
      const userInfo = await User.findOne({
        $or: [{ email: valueUser.email }, { username: valueUser.username }],
      });
      if (userInfo) {
        if (valueUser.username === userInfo.username) {
          return res.status(400).json({ success: false, message: "Tài khoản đã được đăng ký" });
        }
        if (valueUser.email === userInfo.email) {
          return res.status(400).json({ success: false, message: "Email đã được đăng ký" });
        }
      }

      valueUser.active = true;
      valueUser.password = randomPassword;

      const encryptedPass = userService.encryptPassword(valueUser.password);
      valueUser.password = encryptedPass;
      const user = await User.create(valueUser);
      if (valueUser.email) {
        const mailOptions = {
          from: `Bloggo <${config.mail.auth.user}>`,
          to: valueUser.email,
          subject: "Cấp tài khoản thành viên",
          html: `<h3>Bạn đã được cấp tài khoản tại Bloggo. Thông tin tài khoản:</h3>
                  <div><strong>Email: </strong>${valueUser.email}</div>
                <div><strong>Tên tài khoản: </strong>${valueUser.username}</div>    
                <div><strong>Mật khẩu: </strong>${randomPassword}</div>
                <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`,
        };

        await sendEmail(mailOptions);
      }

      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async updateAvatar(req, res) {
    try {
      const decodeToken = req.jwtDecoded;
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập!",
        });
      }
      const image = req.files && req.files.image ? req.files.image : "";

      if (!image) {
        return res.status(404).send({
          success: false,
          message: "Dữ liệu của ảnh tải lên không tồn tại.",
        });
      }

      const { originalFilename } = image;
      const pathOriginal = req.files.image.path;

      if (!originalFilename.match(/\.(jpg|png|jpeg|gif|JPG|PNG|JPEG)$/)) {
        fs.unlink(pathOriginal, (err) => {
          if (err) {
            throw err;
          }
        });
        return res.status(400).json({
          success: false,
          message: "Tệp tin tải lên không đúng định dạng ảnh.",
        });
      }

      const properties = sizeOf(pathOriginal);
      const imageHeight = properties.height;
      const fileNmStore = fileUtils.convertFileName(originalFilename);
      const pathImageResize = `${tempDir}\\${fileNmStore}`;
      let filenameAvatar = fileNmStore;
      await sharp(pathOriginal)
        .rotate()
        .resize(null, imageHeight > 960 ? 960 : null)
        .toFile(pathImageResize)
        .then(async () => {
          fs.unlink(pathOriginal, (err) => {
            if (err) {
              throw err;
            }
          });
          if (config.host_api_image) {
            const imageDetail = await fileUtils.sendImageFile(pathImageResize);
            filenameAvatar = imageDetail.filename;
          } else {
            fileUtils
              .createByName(pathImageResize, fileNmStore)
              .then(() => {
                filenameAvatar = fileNmStore;
              })
              .catch((err) => res.status(500).send({ success: false, error: err }));
          }
          const user = await User.findOneAndUpdate(
            { _id: decodeToken._id },
            { avatar: `${fileUtils.curentDateFolder}/${filenameAvatar}` },
            { new: true, useFindAndModify: false },
          );

          if (!user) {
            return responseAction.error(res, 404, "");
          }
          return res.json({
            file_id: `${fileUtils.curentDateFolder}/${filenameAvatar}`,
          });
        })
        .catch(() =>
          res.status(404).json({
            success: false,
            message: "Không thể tải ảnh lên, vui lòng kiểm tra và thử lại",
          }),
        );
      return true;
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async findCommoner(req, res) {
    try {
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }
      const users = await User.paginate(query, options);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
