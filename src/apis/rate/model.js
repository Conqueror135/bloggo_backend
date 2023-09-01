import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ARTICLE, RATE, USER } from "../../constants/dbCollection";

const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String },
    type: { type: String },
    article: { ref: ARTICLE, type: mongoose.Schema.Types.ObjectId },
    user: { ref: USER, type: mongoose.Schema.Types.ObjectId },
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

export default mongoose.model(RATE, schema);
