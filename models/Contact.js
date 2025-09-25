import mongoose from "mongoose";

const enquiryTypes = ["Commercial", "Residential", "Plot", "Other"];

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters"],
    maxlength: [50, "First name can be maximum 50 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [2, "Last name must be at least 2 characters"],
    maxlength: [50, "Last name can be maximum 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [
      /^(\+91)?[6-9][0-9]{9}$/,
      "Please enter a valid Indian phone number (10 digits, optionally with +91)",
    ],
  },

  enquiryType: {
    type: String,
    enum: {
      values: enquiryTypes,
      message:
        "Enquiry type must be one of Commercial, Residential, Plot, Other",
    },
    default: "Commercial", // default value if empty
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"],
    maxlength: [1000, "Message can be maximum 1000 characters"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
