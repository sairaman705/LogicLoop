import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bookmark: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        default: [],
      },
    ],
    readHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
