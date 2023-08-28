import * as responseHelper from "./responseHelper";
import queryHelper from "./queryHelper";
import CommonError from "../error/CommonError";
import { filterRequest, optionsRequest } from "../utils/filterRequest";

export async function findOneById(Model, id, populateOps, lean) {
  let queryPromise = Model.findById(id);
  if (populateOps) {
    populateOps.forEach((populateOp) => {
      queryPromise.populate(populateOp);
    });
  }
  if (lean) {
    queryPromise = queryPromise.lean();
  }
  return queryPromise;
}

export function createFindOneFunction(Model, populateOps = null) {
  return async function findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await findOneById(Model, id, populateOps, true);
      if (!data) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      return responseHelper.success(res, data);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  };
}

export function createRemoveFunction(Model, callback = null) {
  return async function remove(req, res) {
    try {
      const { id } = req.params;
      const data = await Model.findOneAndUpdate(
        { _id: id },
        { is_deleted: true },
        { new: true, useFindAndModify: false },
      );
      if (!data) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      if (callback) callback(data);
      return responseHelper.success(res, data);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  };
}

export function createUpdateByIdFunction(Model, Service, populateOps = null, uniqueOpts = [], callback = null) {
  return async function update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = Service.validate(req.body);
      if (error) return responseHelper.error(res, error, 400);

      if (Array.isArray(uniqueOpts) && uniqueOpts.length) {
        const promises = uniqueOpts.map(async ({ field, message }) => {
          const checkUnique = await Model.findOne({ [field]: value[field], _id: { $ne: id }, is_deleted: false });
          if (checkUnique) {
            return responseHelper.error(res, { message: `${message} đã tồn tại, vui lòng kiểm tra và thử lại` }, 404);
          }
          return true;
        });

        await Promise.all(promises);
      }
      const data = await Model.findOneAndUpdate({ _id: id }, value, { new: true, useFindAndModify: false });
      if (!data) {
        return responseHelper.error(res, null, null, CommonError.NOT_FOUND);
      }
      const updatedData = await findOneById(Model, id, populateOps, true);
      if (callback) callback(updatedData);
      return responseHelper.success(res, updatedData);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  };
}

export function createGetAllFunction(Model, searchLikes = null, populateOps = null, sortOpts = null) {
  return async function getAll(req, res) {
    try {
      const query = filterRequest(req.query, true);
      const options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === "0") {
        options.pagination = false;
      }
      if (populateOps) {
        options.populate = populateOps;
      }
      if (sortOpts) {
        options.sort = sortOpts;
      }
      const data = await Model.paginate(query, options);
      return responseHelper.success(res, data);
    } catch (err) {
      return responseHelper.error(res, err);
    }
  };
}

export function createCreateFunction(
  Model,
  Service,
  isSelf = false,
  populateOps = null,
  uniqueOpts = [],
  callback = null,
) {
  return async function create(req, res) {
    try {
      const { error, value } = Service.validate(req.body, "POST");
      if (error) return responseHelper.error(res, 400, "", error);
      if (Array.isArray(uniqueOpts) && uniqueOpts.length) {
        const promises = uniqueOpts.map(async ({ field, message }) => {
          const checkUnique = await Model.findOne({ [field]: value[field], is_deleted: false });
          if (checkUnique) {
            return responseHelper.error(res, { message: `${message} đã tồn tại, vui lòng kiểm tra và thử lại` }, 404);
          }
          return true;
        });

        await Promise.all(promises);
      }
      /*
       * Define and assign the default values
       */
      value.request_time = new Date();
      if (isSelf) {
        const decodeToken = req.jwtDecoded;
        if (!decodeToken) {
          return responseHelper.error(res, CommonError.INVALID_TOKEN);
        }
        value.user = decodeToken._id;
      }
      const data = await Model.create(value);
      const createdData = await findOneById(Model, data._id, populateOps, true);
      if (callback) callback(createdData);
      return responseHelper.success(res, createdData);
    } catch (err) {
      return responseHelper.error(res, 500, "", err);
    }
  };
}
