import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { STATUS_COMMENT } from "../../constants/CONSTANTS";
import { COMMENT, ARTICLE, USER } from "../../constants/dbCollection";

const CommentSchema = new Schema(
  {
    content: { type: String },
    status: { type: String, default: STATUS_COMMENT.PENDING.status },
    user: { type: Schema.Types.ObjectId, ref: USER, required: true },
    article: { type: Schema.Types.ObjectId, ref: ARTICLE, required: true },
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
CommentSchema.plugin(mongoosePaginate);

export { CommentSchema as DocumentSchema };
export default mongoose.model(COMMENT, CommentSchema);
