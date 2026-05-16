import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true, unique: true },
    urlToImage: { type: String },
    source: { type: String },
    publishedAt: { type: Date },
    category: { type: String, default: "General" },
    summary: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Article", ArticleSchema);
