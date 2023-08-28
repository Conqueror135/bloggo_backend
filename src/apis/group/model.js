import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { GROUP } from "../../constants/dbCollection";

const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String },
    description: { type: String },
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

export default mongoose.model(GROUP, schema);
