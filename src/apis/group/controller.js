import Model from "./model";
import Service from "./service";
import * as controllerHelper from "../../helpers/controllerHelper";

export default {
  findOne: controllerHelper.createFindOneFunction(Model, null),
  getAll: controllerHelper.createGetAllFunction(Model, null, null, { updated_at: -1 }),
  remove: controllerHelper.createRemoveFunction(Model),
  create: controllerHelper.createCreateFunction(Model, Service),
  update: controllerHelper.createUpdateByIdFunction(Model, Service),
};
