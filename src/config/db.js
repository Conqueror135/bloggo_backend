import mongoose from "mongoose";
import getConfig from "./config";

const config = getConfig(process.env.NODE_ENV);
mongoose.Promise = global.Promise;

const connect = () =>
  mongoose
    .connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .catch((err) => {
      console.log("err ", err);
      setTimeout(connect, 5000);
    });
export default connect;
