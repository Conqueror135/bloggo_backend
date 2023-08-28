import express from "express";
import imgUploadController from "./imgUpload.controller";
import { checkTempFolder, multipartMiddleware } from "../../utils/fileUtils";

export const imgUploadRouter = express.Router();

imgUploadRouter.route("/hissync").get(imgUploadController.downloadFileHisSync);

imgUploadRouter.route("/:date/:id").get(imgUploadController.findFileById).delete(imgUploadController.deleteFile);

imgUploadRouter.route("/preview/:date/:id").get(imgUploadController.previewFile);

imgUploadRouter.route("/image").post(checkTempFolder, multipartMiddleware, imgUploadController.uploadImages);

imgUploadRouter.route("/file").post(checkTempFolder, multipartMiddleware, imgUploadController.uploadFiles);

imgUploadRouter.route("/dowload/:date/:id").get(imgUploadController.downloadImg);
// imgUploadRouter.route("/image/:date/:id").get(imgUploadController.downloadImg);
