import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const rolesRouter = express.Router();

rolesRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
rolesRouter
  .route("/:id")
  .get(apiTokenMiddleware.isAuth, Controller.findOne)
  .put(apiTokenMiddleware.isAuth, Controller.update)
  .delete(Controller.remove);

export default rolesRouter;
