import DateExtension from "@joi/date";
import JoiImport from "joi";
import { RATE_TYPE } from "../../constants/CONSTANTS";

const Joi = JoiImport.extend(DateExtension);

export default {
  validate(body, method) {
    const objSchema = {
      feedback: Joi.string().required(),
      type: Joi.string().valid(RATE_TYPE.RATE_GOOD, RATE_TYPE.RATE_GREATE, RATE_TYPE.RATE_BAD).required(),
    };

    let newSchema = {};
    if (method === "POST") {
      newSchema = { ...objSchema };
    } else {
      Object.keys(objSchema).forEach((key) => {
        if (objSchema[key] && body[key]) {
          newSchema[key] = objSchema[key];
        }
      });
    }

    const schema = Joi.object().keys(newSchema);
    const { value, error } = schema.validate(body, {
      allowUnknown: true,
      abortEarly: true,
    });
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
