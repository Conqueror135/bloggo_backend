import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const articleRouter = express.Router();

articleRouter.route("/").get(Controller.getAll).post(apiTokenMiddleware.isAuth, Controller.create);
articleRouter.put("/change-group/:id", apiTokenMiddleware.isAuth, Controller.changeGroup);

articleRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default articleRouter;
