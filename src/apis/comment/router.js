import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const commentRouter = express.Router();

commentRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
commentRouter.get("/get-by-feedback/:id", Controller.getByFeedback);

commentRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default commentRouter;
