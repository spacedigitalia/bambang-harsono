import mongoose from "mongoose";

const frameworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const projectsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      ref: "Category",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String],
      default: [],
    },
    previewLink: {
      type: String,
      required: false,
    },
    frameworks: {
      type: [frameworkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to log the document
projectsSchema.pre("save", function (next) {
  next();
});

// Prevent OverwriteModelError by checking if model already exists
const modelName = process.env.NEXT_PUBLIC_PROJECTS as string;

const Projects =
  mongoose.models[modelName] || mongoose.model(modelName, projectsSchema);
export default Projects;
