import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { BLOG, USER, GROUP } from "../../constants/dbCollection";

const { Schema } = mongoose;
const schema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    status: { type: String },
    avatar: { type: String },
    user: { ref: USER, type: mongoose.Schema.Types.ObjectId },
    group: { ref: GROUP, type: mongoose.Schema.Types.ObjectId },
    rate_good: { type: Number },
    rate_great: { type: Number },
    rate_bad: { type: Number },
    is_deleted: { type: Boolean, default: false, select: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

schema.plugin(mongoosePaginate);

export default mongoose.model(BLOG, schema);
