import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const modelName = process.env.NEXT_PUBLIC_ACHIEVEMENTS as string;
const Achievement =
  mongoose.models[modelName] || mongoose.model(modelName, achievementSchema);

export default Achievement;
