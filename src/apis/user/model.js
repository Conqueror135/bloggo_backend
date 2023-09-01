import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { USER, ROLE } from "../../constants/dbCollection";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    fullname: { type: String },
    bio: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    avatar: { type: String },
    status: { type: String },
    phone: { type: String },
    point: { type: Number },
    type: { type: String },
    role: { ref: ROLE, type: mongoose.Schema.Types.ObjectId },
    is_sysadmin: { type: Boolean, default: false },
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

userSchema.plugin(mongoosePaginate);

export default mongoose.model(USER, userSchema);
