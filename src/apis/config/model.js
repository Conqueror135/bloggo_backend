import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { CONFIG } from "../../constants/dbCollection";

const { Schema } = mongoose;
const schema = new Schema(
  {
    name: {
      type: String,
    },
    item_per_page: {
      type: Number,
    },
    describe: {
      type: String,
    },
    total_images: {
      type: Number,
    },
    total_files: {
      type: Number,
    },
    process_time: {
      type: Number,
    },
    is_deleted: { type: Boolean, default: false, select: false },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

schema.plugin(mongoosePaginate);

export default mongoose.model(CONFIG, schema);
