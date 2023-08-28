import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { BLOG, RESOURCE } from "../../constants/dbCollection";

const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String },
    file_name: { type: String },
    url: { type: String },
    type: { type: String },
    blog: { ref: BLOG, type: mongoose.Schema.Types.ObjectId },
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

export default mongoose.model(RESOURCE, schema);
