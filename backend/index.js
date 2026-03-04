import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Seat from "./models/seats.js";
import Event from "./models/event.js";
import mongoose from "mongoose";
const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Race condition demonstration backend");
})


app.post('/api/book/vulnerable', async (req, res) => {
    try {
        const { eventId } = req.body;
        

        const seat = await Seat.findOne({ eventId, isBooked: false });
        
        if (!seat) {
            return res.status(400).json({ success: false, error: 'No seats available' });
        }
        

        await new Promise(resolve => setTimeout(resolve, 50));
        

        seat.isBooked = true;
        seat.bookedAt = new Date();
        await seat.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Booking successful',
            seatNumber: seat.seatNumber 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.post('/api/book/secure', async (req, res) => {
    try {
        const { eventId } = req.body;
        
 
        const seat = await Seat.findOneAndUpdate(
            { eventId, isBooked: false },
            { 
                $set: { 
                    isBooked: true, 
                    bookedAt: new Date()
                } 
            },
            { new: true }
        );
        
        if (!seat) {
            return res.status(400).json({ success: false, error: 'No seats available' });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Booking successful',
            seatNumber: seat.seatNumber 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.get('/api/seats/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const seats = await Seat.find({ eventId }).sort({ seatNumber: 1 });
        const booked = seats.filter(s => s.isBooked).length;
        const available = seats.filter(s => !s.isBooked).length;
        
        res.status(200).json({ 
            total: seats.length,
            booked,
            available,
            seats 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/reset/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        
        await Seat.updateMany(
            { eventId },
            { $set: { isBooked: false, bookedBy: null, bookedAt: null } }
        );
        
        res.status(200).json({ success: true, message: 'All seats reset' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/init', async (req, res) => {
    try {
        const { name, date, totalSeats } = req.body;
        
      
        const event = await Event.create({
            name: name || "Demo Event",
            date: date || new Date(),
            totalSeats: totalSeats || 10
        });
        
  
        const seatDocs = [];
        for (let i = 1; i <= (totalSeats || 10); i++) {
            seatDocs.push({
                eventId: event._id,
                seatNumber: i,
                isBooked: false
            });
        }
        await Seat.insertMany(seatDocs);
        
        res.status(201).json({ 
            success: true, 
            eventId: event._id,
            message: `Event created with ${totalSeats || 10} seats` 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/test-race-condition',async (req, res) => {
    try{
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User found successfully' });

    }   
    catch(error){
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }

});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
