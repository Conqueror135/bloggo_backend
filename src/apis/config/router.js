import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const configRouter = express.Router();

configRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
configRouter.put("/active/:id", apiTokenMiddleware.isAuth, Controller.changeActive);

configRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default configRouter;
