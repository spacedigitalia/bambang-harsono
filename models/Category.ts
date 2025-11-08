import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Category =
  mongoose.models.Category ||
  mongoose.model(process.env.NEXT_PUBLIC_CATEGORY as string, categorySchema);
