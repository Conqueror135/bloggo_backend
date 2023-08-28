import express from "express";
import userController from "./controller";
import apiTokenMiddleware from "../../middleware/apiTokenMiddleware";
import { checkTempFolder, multipartMiddleware } from "../../utils/fileUtils";

const userRouter = express.Router();
userRouter.get("/", userController.findAll);

userRouter.get("/inactive", apiTokenMiddleware.isAuth, userController.findAllInActive);

userRouter.post("/", userController.signup);
userRouter.post("/issue-account-member", apiTokenMiddleware.isAuth, userController.issueAccountMember);
userRouter.post("/issue-account", apiTokenMiddleware.isAuth, userController.issueAccount);
userRouter.post("/login", userController.login);
userRouter.post("/forgot-password-mail", userController.forgotPasswordMail);

userRouter.put("/change-password", apiTokenMiddleware.isAuth, userController.changePassword);
userRouter.put("/reset-password", apiTokenMiddleware.isAuth, userController.resetPassword);
userRouter.put("/avatar", apiTokenMiddleware.isAuth, checkTempFolder, multipartMiddleware, userController.updateAvatar);
userRouter.put("/info", multipartMiddleware, userController.updateInfo);
userRouter.get("/commoner", apiTokenMiddleware.isAuth, apiTokenMiddleware.isAuth, userController.findCommoner);

userRouter
  .route("/me")
  .get(apiTokenMiddleware.isAuth, userController.authenticate)
  .put(apiTokenMiddleware.isAuth, userController.updateInfo);

userRouter
  .route("/:id")
  .get(apiTokenMiddleware.isAuth, userController.findOne)
  .delete(apiTokenMiddleware.isAuth, userController.delete)
  .put(apiTokenMiddleware.isAuth, userController.update);
export default userRouter;
