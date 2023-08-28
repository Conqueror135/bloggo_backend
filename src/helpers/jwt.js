import jwt from "jsonwebtoken";
import getConfig from "../config/config.js";

const config = getConfig(process.env.NODE_ENV);

export default {
  issue(payload, expiresIn) {
    return jwt.sign(payload, config.secret, {
      expiresIn,
    });
  },
};
