import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { NOTIFICATION, USER, ARTICLE } from "../../constants/dbCollection";
import { NOTIFICATION_STATUS } from "./notification.constants";

const NotificantionSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: USER },
    recipient: { type: Schema.Types.ObjectId, ref: USER, required: true },
    title: { type: String },
    content: { type: String },
    article: { type: Schema.Types.ObjectId, ref: ARTICLE },
    type: { type: String },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: NOTIFICATION_STATUS.SENT },
    is_deleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  },
);
NotificantionSchema.plugin(mongoosePaginate);

export { NotificantionSchema as DocumentSchema };
export default mongoose.model(NOTIFICATION, NotificantionSchema, NOTIFICATION);
