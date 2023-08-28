import Model from "./notification.model";
import * as controllerHelper from "../../helpers/controllerHelper";
// import * as responseHelper from '../../helpers/responseHelper';
// import queryHelper from '../../helpers/queryHelper';
import * as NotificationService from "./notification.service";
import { extractIds } from "../../utils/dataConverter";
import User from "../user/model";
import { filterRequest, optionsRequest } from "../../utils/filterRequest";
import * as responseHelper from "../../helpers/responseHelper";

// export const findOne = controllerHelper.createFindOneFunction(Model, populateOpts);
// export const remove = controllerHelper.createRemoveFunction(Model);
// export const update = controllerHelper.createUpdateByIdFunction(Model, Service, populateOpts);
// export const create = controllerHelper.createCreateFunction(Model, Service, populateOpts);
// export const getAll = controllerHelper.createGetAllFunction(Model, null, [
//   { path: "feedback", select: "title" },
//   { path: "sender", select: "username" },
// ]);

export const testNotification = async (req, res) => {
  try {
    const userNoti = await User.find({ is_deleted: false }).lean();
    const userNotiId = extractIds(userNoti);
    await NotificationService.notification(userNotiId);
    return res.status(200).json("ok");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};
export async function getAll(req, res) {
  try {
    const decodeToken = req.jwtDecoded;
    if (!decodeToken) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập!",
      });
    }
    req.query.recipient = decodeToken._id;
    const query = filterRequest(req.query, true);
    const options = optionsRequest(req.query);
    if (req.query.limit && req.query.limit === "0") {
      options.pagination = false;
    }
    options.populate = [
      { path: "feedback", select: "title" },
      { path: "sender", select: "username" },
    ];

    const notifications = await Model.paginate(query, options);
    return responseHelper.success(res, notifications);
  } catch (err) {
    console.error(err);
    return responseHelper.error(res, 500, "Lỗi hệ thống, vui lòng liên hệ qtv!");
  }
}
