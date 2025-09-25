import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    type: {
      type: String,
      enum: ["Commercial", "Residential", "Plot"],
      required: [true, "Type is required"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String, // needed for deleting from Cloudinary
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
