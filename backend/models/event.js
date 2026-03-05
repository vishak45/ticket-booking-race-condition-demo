import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: "Virtual Event",
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100,
  },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
