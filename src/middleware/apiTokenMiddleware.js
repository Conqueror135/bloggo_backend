import jwtHelper from "../helpers/jwt_block.helper";

import { extractQueryParam } from "../utils/queryUtils.js";
import "dotenv/config";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const isAuth = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers.authorization || req.headers["x-access-token"];

  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      if (req.query) {
        req.querryString = extractQueryParam(req.query);
      }
      req.jwtDecoded = decoded;
      req.token = tokenFromClient;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized or token is expired!.",
        status: false,
      });
    }
  } else {
    return res.status(403).json({
      message: "No token provided.",
      status: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      req.jwtDecoded = decoded;
      req.token = tokenFromClient;
      if (req.query) {
        req.querryString = extractQueryParam(req.query);
      }
      if (decoded.data.role) {
        next();
      } else {
        return res.status(401).json({
          message: "You are not authorized to perform this action!",
          status: false,
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized or token is expired!",
        status: false,
      });
    }
  } else {
    return res.status(403).json({
      message: "No token provided.",
      status: false,
    });
  }
};

export default {
  isAuth,
  isAdmin,
};
