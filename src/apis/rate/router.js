import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const rateRouter = express.Router();

rateRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
rateRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default rateRouter;
