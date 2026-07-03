import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    desc: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String, // Store image as a Base64 string or URL
      required: [true, "Please provide an image"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["environments", "structures", "interiors", "models"],
    },
  },
  { timestamps: true }
);

// If the model exists, use it, otherwise create it.
export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
