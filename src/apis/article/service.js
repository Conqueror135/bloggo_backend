import DateExtension from "@joi/date";
import JoiImport from "joi";

const Joi = JoiImport.extend(DateExtension);

export default {
  validate(body, method) {
    const objSchema = {
      title: Joi.string().required(),
      content: Joi.string().required(),
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
  validateChangeGroup(body, method) {
    const objSchema = {
      group: Joi.string().required(),
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
