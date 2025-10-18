import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  college: { type: String },
  department: { type: String },
  year: { type: String },

  // 🎯 Linking participant to a specific event
 

  createdAt: { type: Date, default: Date.now },
  social_link: String,

  accommodation_status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending"
  },

  travel_status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending"
  },

  registration_id: {
    type: String,
    unique: true
  },

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ]
});

export default mongoose.model("Participant", participantSchema);
