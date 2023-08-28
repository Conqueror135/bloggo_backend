import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const groupRouter = express.Router();

groupRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
groupRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default groupRouter;
