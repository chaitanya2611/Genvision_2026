import Participant from "../models/Participant.js";
import Event from "../models/Event.js";

// 🧠 Get all participants
export const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find().populate("events", "name");
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add a new participant
export const addParticipant = async (req, res) => {
  try {
    const participant = new Participant({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      college: req.body.college,
      department: req.body.department,
      year: req.body.year,
      events: req.body.events, // array of event IDs
      social_link: req.body.social_link,
      accommodation_status: req.body.accommodation_status || "pending",
      travel_status: req.body.travel_status || "pending",
      registration_id:
        "GV" + Math.floor(100000 + Math.random() * 900000),
    });

    const savedParticipant = await participant.save();

    if (req.body.events && req.body.events.length > 0) {
      await Event.updateMany(
        { _id: { $in: req.body.events } },
        { $addToSet: { participants: savedParticipant._id } }
      );}

    res.status(201).json(savedParticipant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✏️ Update participant
export const updateParticipant = async (req, res) => {
  try {
    const updated = await Participant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Participant not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete participant
export const deleteParticipant = async (req, res) => {
  try {
    const deleted = await Participant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Participant not found" });
    res.json({ message: "Participant deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
