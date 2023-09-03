import Model from "./model";
import Service from "./service";
import * as controllerHelper from "../../helpers/controllerHelper";
import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import * as responseHelper from "../../helpers/responseHelper";
import Resource from "../resource/model";
import { ARTICLE_STATUS } from "../../constants/CONSTANTS";
import CommonError from "../../error/CommonError";
import { groupBy, extractObjectIds } from "../../utils/dataConverter";

export default {
  findOne: controllerHelper.createFindOneFunction(Model, [{ path: "user", select: "fullname username phone email" }]),
  getAll: controllerHelper.createGetAllFunction(
    Model,
    null,
    [{ path: "user", select: "fullname username phone email" }],
    { updated_at: -1 },
  ),
  remove: controllerHelper.createRemoveFunction(Model),
  create: controllerHelper.createCreateFunction(Model, Service, true, null, null),
  update: controllerHelper.createUpdateByIdFunction(Model, Service, null, null),

  changeGroup: async (req, res) => {
    try {
      const decodeToken = req.jwtDecoded;
      const { id } = req.params;
      if (!decodeToken) {
        return res.status(401).json({
          success: false,
          message: "Không có quyền truy cập!",
        });
      }

      const data = await Model.findById(id);
      if (!data) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      const { error, value } = Service.validateChangeGroup(req.body);
      if (error) return responseHelper.error(res, error, 400);

      const dataArticle = await Model.findOneAndUpdate(
        { _id: id },
        { group: value.group },
        { new: true, useFindAndModify: false },
      );
      return responseHelper.success(res, dataArticle);
    } catch (err) {
      console.log(err);
      return responseHelper.error(res, 500, "Lỗi hệ thống, vui lòng liên hệ qtv!");
    }
  },
};
