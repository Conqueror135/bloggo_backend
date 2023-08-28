import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ROLE } from "../../constants/dbCollection";

const { Schema } = mongoose;

const rolesSchema = new Schema(
  {
    name: { type: String },
    is_deleted: { type: Boolean, default: false },
    fields: {},
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);
rolesSchema.plugin(mongoosePaginate);
export default mongoose.model(ROLE, rolesSchema);
