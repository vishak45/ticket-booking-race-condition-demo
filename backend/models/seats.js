import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: true,
    },
    

});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;