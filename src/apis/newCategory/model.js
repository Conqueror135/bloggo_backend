import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { NEWS_CATEGORY, USER } from "../../constants/dbCollection";

const schema = new Schema(
  {
    name: { type: String },
    describe: { type: String },
    status: { type: String },
    user: { type: Schema.Types.ObjectId, ref: USER, required: true },
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

export default mongoose.model(NEWS_CATEGORY, schema);
