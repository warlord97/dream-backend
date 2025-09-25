import Contact from "../models/Contact.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, enquiryType, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !enquiryType || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      enquiryType,
      message,
    });
    await newContact.save();

    // Send WhatsApp message
    const whatsappMessage = `
New Contact Form Submission:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Enquiry Type: ${enquiryType}
Message: ${message}
    `;

    await client.messages.create({
      body: whatsappMessage,
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:${process.env.ADMIN_PHONE}`,
    });

    res
      .status(200)
      .json({ success: true, message: "Form submitted successfully" });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ error: messages });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
