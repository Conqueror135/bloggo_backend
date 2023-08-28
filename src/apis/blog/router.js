import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const blogRouter = express.Router();

blogRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
blogRouter.put("/change-group/:id", apiTokenMiddleware.isAuth, Controller.changeGroup);

blogRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default blogRouter;
