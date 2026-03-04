import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  seatNumber: {
    type: Number,
    required: true,
  },

  isBooked: {
    type: Boolean,
    default: false,
  },

  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  bookedAt: {
    type: Date,
    default: null,
  }

}, { timestamps: true });

seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
const Seat = mongoose.model("Seat", seatSchema);


export default Seat;