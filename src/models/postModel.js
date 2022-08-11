const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    media: { type: String },
    user_id: { type: String, ref: "user", required: true },
    statuss: { type: String, required: true, enum: ["Public", "Private"] },
    hashTag: { type: String, trim: true },
    friendTag: { type: Array, trim: true },
    comment: { type: Array, trim: true },
    likes: { type: Number, trim: true, default: 0 },
    likedBy: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false, trim: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
