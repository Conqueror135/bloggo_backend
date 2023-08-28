import fs from "fs";
import multipart from "connect-multiparty";
import path from "path";
import getConfig from "../config/config";
import request from "request";
import { FILE_MISSING } from "../constants/messageError.js";
import { v4 as uuidV4 } from "uuid";

const osTempDir = require("os").tmpdir();
export const curentDateFolder = new Date().toISOString().slice(0, 10).replace(/-/g, "");
export const tempDir = path.join("./upload", curentDateFolder);
const filesDir = path.join("./upload", curentDateFolder);
const filesStoreDir = path.resolve("./upload");

const saveFileDir = path.join("./upload", curentDateFolder);

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(saveFileDir)) {
  fs.mkdirSync(saveFileDir, { recursive: true });
}

export const getDirPath = (dirName, rootPath = "./upload") => {
  const dirPath = path.resolve(rootPath, dirName);
  createFolderIfNotExist(dirPath);
  return dirPath;
};

function createFolderIfNotExist(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function createIfNotExistFolders() {
  createFolderIfNotExist(tempDir);
  createFolderIfNotExist(filesDir);
  createFolderIfNotExist(filesStoreDir);
  const filesTemplatesDir = getDirPath("templates");
  createFolderIfNotExist(filesTemplatesDir);
}

export const getFilePath = (fileName, filesDir = "./upload") => {
  return path.join(filesDir, fileName);
};

const config = getConfig(process.env.NODE_ENV);
const multipartMiddleware = multipart({ uploadDir: tempDir });

const checkTempFolder = (req, res, next) => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
    createIfNotExistFolders();
  }
  next();
};

const prepareTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  clearFolder(tempDir);
};

const clearFolder = (tempDir) => {
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), (err) => {
        if (err) {
          console.log(file, err);
        }
      });
    }
  });
};

const getFileExtension = (filename) => {
  let ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? "" : ext[1];
};

function formatFileName(str) {
  if (!str) return;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\s+/g, "_");
  return str;
}

function convertFileName(fileNm) {
  let extension = path.extname(fileNm);
  let fileWithoutExtension = formatFileName(path.basename(fileNm, extension));
  let date_val = new Date();
  let timestam = date_val.getTime();
  let fileStorage = fileWithoutExtension + "_" + timestam + extension;
  return fileStorage;
}

export function renameFileUploads(pathOriginal, pathFileNmStore) {
  return new Promise(function (resolve, reject) {
    fs.rename(pathOriginal, pathFileNmStore, function (err) {
      if (!err) {
        resolve({ success: true });
      } else {
        reject({ success: false });
      }
    });
  });
}

const sendImageFile = (pathImageResize, isImage = true) => {
  return new Promise(function (resolve, reject) {
    let host_api_image = config.host_api_image + (isImage ? "" : "/files");
    const options = {
      method: "POST",
      url: host_api_image,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        image: fs.createReadStream(pathImageResize),
      },
    };
    request(options, function (error, res, body) {
      fs.unlink(pathImageResize, (err) => {
        if (err) {
          console.log("err", err);
          throw err;
        }
      });
      if (!error && res.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject({ success: false });
      }
    });
  });
};

const getUrlFileAPI = (fileDate, fileName, isImage = true) => {
  if (config.host_api_image) {
    let host_api_image = config.host_api_image + (isImage ? "" : "/files");
    return host_api_image + "/" + fileName;
  } else {
    return isImage ? path.join("./upload", fileDate, fileName) : path.join(filesStoreDir, fileDate, fileName);
  }
};

const getUrlFileAPIHisSync = (fileName) => {
  let host_api_image = config.host_api_image + "/hissync?fileNm=";
  console.log(host_api_image + fileName, "1");
  return host_api_image + fileName;
};

function deleteFile(filePath) {
  fs.unlink(filePath, () => {});
}

async function copyImageToStorage(srcPath, fileName) {
  const desPath = `${filesDir}/${fileName}`;
  return copyFile(srcPath, desPath);
}
async function copyFileToStorage(srcPath, fileName) {
  const desPath = `${saveFileDir}/${fileName}`;
  return copyFile(srcPath, desPath);
}

async function copyFile(srcPath, desPath) {
  return new Promise((resolve, reject) => {
    fs.copyFile(srcPath, desPath, (err) => {
      if (err) reject(err);
      resolve(desPath);
    });
  });
}
const createByName = (filePath, fileName, isImage = true) => {
  return new Promise((resolve, reject) => {
    let file = fs.createReadStream(filePath);
    file.on("error", (err) => {
      console.log(err);
      deleteFile(filePath);
      reject(FILE_MISSING);
    });
    if (isImage) {
      copyImageToStorage(filePath, fileName)
        .then((newFilePath) => {
          deleteFile(filePath);
          resolve(newFilePath);
        })
        .catch((err) => {
          console.log("Bucket is not exists or you dont have permission to access it.");
          console.log(err);
          deleteFile(filePath);
          reject(err);
        });
    } else {
      copyFileToStorage(filePath, fileName)
        .then((newFilePath) => {
          deleteFile(filePath);
          resolve(newFilePath);
        })
        .catch((err) => {
          console.log("Bucket is not exists or you dont have permission to access it.");
          console.log(err);
          deleteFile(filePath);
          reject(err);
        });
    }
  });
};
const removeFile = (fileName) => {
  return new Promise((resolve, reject) => {
    try {
      deleteFile(getFilePath(fileName, filesDir));
      resolve(fileName);
    } catch (e) {
      reject(e);
    }
  });
};
export {
  multipartMiddleware,
  getFileExtension,
  prepareTempFolder,
  checkTempFolder,
  formatFileName,
  convertFileName,
  sendImageFile,
  getUrlFileAPI,
  getUrlFileAPIHisSync,
  createByName,
  removeFile,
};
