import Model from "./model";
import Service from "./service";
import * as controllerHelper from "../../helpers/controllerHelper";
import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import * as responseHelper from "../../helpers/responseHelper";
import Resource from "../resource/model";
import { BLOG_STATUS } from "../../constants/CONSTANTS";
import CommonError from "../../error/CommonError";
import { groupBy, extractObjectIds } from "../../utils/dataConverter";

export default {
  findOne: controllerHelper.createFindOneFunction(Model, [
    { path: "user", select: "fullname username phone email" },
    { path: "group", select: "name" },
  ]),

  getAll: async (req, res) => {
    try {
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }

      options.populate = [
        { path: "user", select: "username" },
        { path: "group", select: "name" },
      ];
      if (!query.status) {
        query.status = { $ne: BLOG_STATUS.DRAFT };
      }
      const data = await Model.paginate(query, options);
      const dataFeedback = JSON.parse(JSON.stringify(data));

      if (dataFeedback) {
        const feebackIds = extractObjectIds(dataFeedback.docs);
        const dataResources = await Resource.find({ feedback: { $in: feebackIds }, is_deleted: false }).lean();
        const resourceGroupByFeedback = groupBy(dataResources, "feedback");

        dataFeedback.docs.forEach((item) => {
          item.resources = resourceGroupByFeedback[item._id];
        });
      }
      return responseHelper.success(res, dataFeedback);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  },
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

      const dataFeedback = await Model.findOneAndUpdate(
        { _id: id },
        { group: value.group },
        { new: true, useFindAndModify: false },
      );
      return responseHelper.success(res, dataFeedback);
    } catch (err) {
      console.log(err);
      return responseHelper.error(res, 500, "Lỗi hệ thống, vui lòng liên hệ qtv!");
    }
  },
};
