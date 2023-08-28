import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import logger from "./stuff/logger";
import argv from "./stuff/argv";
import port from "./stuff/port";
import connect from "./config/db";
import restRouter from "./apis/index";
import { initNotificationService } from "./apis/notification/notification.service";
import userController from "./apis/user/controller";

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connect();
app.use("/api", restRouter);

const customHost = argv.host || process.env.HOST;
const host = customHost || null;
const prettyHost = customHost || "localhost";

userController
  .createSystemAdminAccout()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("An error occurred while creating the syadmin account: ", err);
  });

const server = app.listen(port, host, async (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
  return true;
});

initNotificationService(server);
