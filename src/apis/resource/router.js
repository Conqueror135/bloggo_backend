import express from "express";
import Controller from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";

const resourceRouter = express.Router();

resourceRouter.get("/", Controller.getAll);
resourceRouter.post("/", apiTokenMiddleware.isAuth, Controller.create);
resourceRouter
  .route("/:id")
  .get(Controller.findOne)
  .delete(apiTokenMiddleware.isAuth, Controller.remove)
  .put(apiTokenMiddleware.isAuth, Controller.update);

export default resourceRouter;
