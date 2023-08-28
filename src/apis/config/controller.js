import Model from "./model";
import Service from "./service";
import * as controllerHelper from "../../helpers/controllerHelper";
import CommonError from "../../error/CommonError";
import * as responseHelper from "../../helpers/responseHelper";

export default {
  findOne: controllerHelper.createFindOneFunction(Model, null),
  getAll: controllerHelper.createGetAllFunction(Model, null),
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const config = await Model.findById(id).lean();
      if (!config) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      if (config.active) {
        return res.status(400).json({ success: false, message: "Không thể xóa cấu hình đang sử dụng!" });
      }
      const data = await Model.findOneAndUpdate(
        { _id: id },
        { is_deleted: true },
        { new: true, useFindAndModify: false },
      );
      if (!data) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      return responseHelper.success(res, data);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  },
  create: async (req, res) => {
    try {
      const { error, value } = Service.validate(req.body, "POST");
      if (error) return responseHelper.error(res, 400, "", error);

      const decodeToken = req.jwtDecoded;
      if (!decodeToken) {
        return responseHelper.error(res, CommonError.INVALID_TOKEN);
      }
      const activeConfig = await Model.findOne({ active: true, is_deleted: false });
      if (!activeConfig) {
        value.active = true;
      }
      value.user = decodeToken._id;

      const data = await Model.create(value);

      return responseHelper.success(res, data);
    } catch (err) {
      return responseHelper.error(res, 500, "", err);
    }
  },
  update: controllerHelper.createUpdateByIdFunction(Model, Service),
  changeActive: async (req, res) => {
    try {
      const { id } = req.params;

      const config = await Model.findById(id).lean();
      if (!config) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      let newConffig;
      if (!config.active) {
        await Model.findOneAndUpdate({ active: true }, { active: false }, { new: true, useFindAndModify: false });
        newConffig = await Model.findByIdAndUpdate(id, { active: true }, { new: true, useFindAndModify: false });
      }

      return responseHelper.success(res, newConffig);
    } catch (err) {
      console.error(err);
      return responseHelper.error(res, 500, "Lỗi hệ thống, vui lòng liên hệ qtv!");
    }
  },
};
