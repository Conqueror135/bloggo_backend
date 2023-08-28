import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const newsRouter = express.Router();

newsRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
newsRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default newsRouter;
