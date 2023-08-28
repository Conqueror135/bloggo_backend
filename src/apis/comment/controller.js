import Model from "./model";
import Service from "./service";
import * as controllerHelper from "../../helpers/controllerHelper";
import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import * as responseHelper from "../../helpers/responseHelper";

export default {
  findOne: controllerHelper.createFindOneFunction(Model, null),
  getAll: controllerHelper.createGetAllFunction(Model, null, [
    { path: "user", select: "name username" },
    { path: "feedback", select: "title" },
  ]),
  remove: controllerHelper.createRemoveFunction(Model),
  create: controllerHelper.createCreateFunction(Model, Service, true),
  update: controllerHelper.createUpdateByIdFunction(Model, Service),
  getByFeedback: async (req, res) => {
    try {
      const { id } = req.params;
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }
      options.populate = [
        { path: "user", select: "name username avatar" },
        { path: "feedback", select: "title" },
      ];
      query.feedback = id;
      const allComment = await Model.paginate(query, options);

      return responseHelper.success(res, allComment);
    } catch (err) {
      return responseHelper.error(res, 500, "Lỗi hệ thống, vui lòng liên hệ qtv!");
    }
  },
};
