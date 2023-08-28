import * as fileUtils from "../../utils/fileUtils";
import fs from "fs";
import getConfig from "../../config/config";
import { TYPE_FILE } from "../../constants/CONSTANTS";
import path from "path";

const config = getConfig(process.env.NODE_ENV);
var sizeOf = require("image-size");
const sharp = require("sharp");

const osTempDir = require("os").tmpdir();
// const tempDir = osTempDir + "\\uploads";

const tempDir = fileUtils.tempDir;
const filesStoreDir = path.resolve("./upload");

export default {
  findFileById(req, res) {
    return res.download(fileUtils.getUrlFileAPI(req.params.id));
  },
  previewFile(req, res) {
    const file = fileUtils.getUrlFileAPI(req.params.date, req.params.id);
    const type = TYPE_FILE[path.extname(file).slice(1)] || "text/plain";
    const s = fs.createReadStream(file);
    s.on("open", function () {
      res.set("Content-Type", type);
      s.pipe(res);
    });
    s.on("error", function () {
      res.set("Content-Type", "text/plain");
      res.status(404).end("Not found");
    });
  },
  deleteFile(req, res) {
    fileUtils
      .removeFile(req.params.id)
      .then((doc) => res.send(doc))
      .catch((err) => res.send(err));
  },
  // download files
  downloadImg(req, res) {
    return res.download(fileUtils.getUrlFileAPI(req.params.date, req.params.id, true));
  },
  downloadFile(req, res) {
    return res.redirect(fileUtils.getUrlFileAPI(req.params.date, req.params.id, false));
  },

  downloadFileHisSync(req, res) {
    let fileNm = req.query.fileNm;
    return res.redirect(fileUtils.getUrlFileAPIHisSync(fileNm));
  },

  async uploadImages(req, res) {
    try {
      let image = req.files && req.files.image ? req.files.image : "";

      if (!image) {
        return res.status(404).send({
          success: false,
          message: "Dữ liệu của ảnh tải lên không tồn tại.",
        });
      }

      let originalFilename = image.originalFilename;
      const pathOriginal = req.files.image.path;

      if (!originalFilename.match(/\.(jpg|png|jpeg|gif|JPG|PNG|JPEG)$/)) {
        fs.unlink(pathOriginal, (err) => {
          if (err) {
            console.log("err", err);
            throw err;
          }
        });
        return res.status(400).json({
          success: false,
          message: "Tệp tin tải lên không đúng định dạng ảnh.",
        });
      }

      let properties = sizeOf(pathOriginal);
      const imageHeight = properties.height;
      let fileNmStore = fileUtils.convertFileName(originalFilename);
      let pathImageResize = tempDir + "\\" + fileNmStore;

      await sharp(pathOriginal)
        .rotate()
        .resize(null, imageHeight > 960 ? 960 : null)
        .toFile(pathImageResize)
        .then(async () => {
          fs.unlink(pathOriginal, (err) => {
            if (err) {
              console.log("err", err);
              throw err;
            }
          });
          if (config.host_api_image) {
            let imageDetail = await fileUtils.sendImageFile(pathImageResize);
            return res.status(200).send({ success: true, image_id: imageDetail.filename });
          } else {
            fileUtils
              .createByName(pathImageResize, fileNmStore)
              .then(() => {
                return res
                  .status(200)
                  .send({ success: true, image_id: fileUtils.curentDateFolder + "/" + fileNmStore });
              })
              .catch((err) => {
                return res.status(500).send({ success: false, error: err });
              });
          }
        })
        .catch(function (err) {
          console.log(err, "err");
          return res.status(404).json({
            success: false,
            message: "Không thể tải ảnh lên, vui lòng kiểm tra và thử lại",
          });
        });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // upload files
  async uploadFiles(req, res) {
    try {
      const image = req.files && req.files.file ? req.files.file : "";
      if (!image) {
        return res.status(404).send({
          success: false,
          message: "Dữ liệu của files tải lên không tồn tại.",
        });
      }
      const { originalFilename } = image;
      const pathOriginal = req.files.file.path;
      if (!originalFilename.match(/\.(doc|docx|xls|xlsx|excel|pdf|DOC|DOCX|XLS|XLSX|EXCEL|PDF|mp4)$/)) {
        fs.unlink(pathOriginal, (err) => {
          if (err) {
            console.log("err", err);
            throw err;
          }
        });
        return res.status(400).json({
          success: false,
          message: "Tệp tin tải lên không đúng định dạng file.",
        });
      }

      const fileNmStore = fileUtils.convertFileName(originalFilename);
      const pathFileNmStore = path.join(filesStoreDir, fileNmStore);

      await fileUtils.renameFileUploads(pathOriginal, pathFileNmStore);
      if (config.host_api_image) {
        const imageDetail = await fileUtils.sendImageFile(pathFileNmStore, false);
        return res.status(200).send({ success: true, file_id: imageDetail.filename });
      }
      await fileUtils.createByName(pathFileNmStore, fileNmStore, false);

      return res.status(200).send({ success: true, file_id: `${fileUtils.curentDateFolder}/${fileNmStore}` });
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
