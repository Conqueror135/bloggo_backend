import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const catalogRouter = express.Router();

catalogRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
catalogRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default catalogRouter;
