import express from "express";
import userRouter from "./user/router";
import { imgUploadRouter } from "./imgUpload/imgUpload.router";
import { notificationRouter } from "./notification/notification.router";
import rolesRouter from "./roles/router";
import groupRouter from "./group/router";
import rateRouter from "./rate/router";
import resourceRouter from "./resource/router";
import commentRouter from "./comment/router";
import configRouter from "./config/router";
import newsRouter from "./news/router";
import newsCategoryRouter from "./newCategory/router";
import articleRouter from "./article/router";

const restRouter = express.Router();

restRouter.use("/users", userRouter);
restRouter.use("/files", imgUploadRouter);
restRouter.use("/notification", notificationRouter);
restRouter.use("/articles", articleRouter);
restRouter.use("/roles", rolesRouter);
restRouter.use("/group", groupRouter);
restRouter.use("/rate", rateRouter);
restRouter.use("/resource", resourceRouter);
restRouter.use("/comment", commentRouter);
restRouter.use("/config", configRouter);
restRouter.use("/news", newsRouter);
restRouter.use("/news-category", newsCategoryRouter);

export default restRouter;
