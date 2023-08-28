import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { NEWS, USER, NEWS_CATEGORY } from "../../constants/dbCollection";

const schema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    avatar: { type: String },
    status: { type: String },
    user: { type: Schema.Types.ObjectId, ref: USER, required: true },
    category: { type: Schema.Types.ObjectId, ref: NEWS_CATEGORY },
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

export default mongoose.model(NEWS, schema);
