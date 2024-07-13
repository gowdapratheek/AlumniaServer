import { Schema, model } from "mongoose";

const resourceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String },
  file: { type: String },
  keywords: [{ type: String }],
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Resource = model("Resource", resourceSchema);
export default Resource;
