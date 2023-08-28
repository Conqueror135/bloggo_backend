import express from "express";
import * as Controller from "./notification.controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

export const notificationRouter = express.Router();

notificationRouter.use(apiTokenMiddleware.isAuth);
notificationRouter.route("/").get(Controller.getAll);

// notificationRouter.post("/test", Controller.testNotification);

// notificationRouter.route("/:id").get(Controller.findOne).delete(Controller.remove).put(Controller.update);
