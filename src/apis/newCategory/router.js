import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const newsCategoryRouter = express.Router();

newsCategoryRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
newsCategoryRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default newsCategoryRouter;
