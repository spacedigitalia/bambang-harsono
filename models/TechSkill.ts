import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
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

const modelName = process.env.NEXT_PUBLIC_TECH_SKILL as string;
const Skill =
  mongoose.models[modelName] || mongoose.model(modelName, skillSchema);

export default Skill;
