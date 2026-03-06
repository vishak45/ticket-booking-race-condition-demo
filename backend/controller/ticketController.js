import Seat from "../models/seats.js";
import Event from "../models/event.js";
import { bookingQueue } from "../redis/bookingQueue.js";

const bookTicketAsync = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        
        // Add job to queue (returns immediately)
        const job = await bookingQueue.add(
            { eventId, userId, Seat },
            { 
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000
                },
                removeOnComplete: true
            }
        );
        
        res.status(202).json({
            success: true,
            message: 'Booking request queued',
            jobId: job.id,
            linkedJob: `Check status with jobId: ${job.id}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const checkBookingStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await bookingQueue.getJob(jobId);
        
        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }
        
        const isCompleted = await job.isCompleted();
        const isFailed = await job.isFailed();
        const progress = job.progress();
        
        res.status(200).json({
            success: true,
            jobId,
            status: isCompleted ? 'completed' : isFailed ? 'failed' : 'processing',
            progress,
            result: isCompleted ? job.returnvalue : null,
            failedReason: isFailed ? job.failedReason : null
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const vulnerableReq=async (req, res) => {
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
}

const sequreTicket=async (req, res) => {
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
}

const eventFinder=async (req, res) => {
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
}

const conCurrentUpdate= async (req, res) => {
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
}

const initEvent=async (req, res) => {
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
}

const testRace=async (req, res) => {
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

}

module.exports={vulnerableReq,sequreTicket,eventFinder,conCurrentUpdate,initEvent,testRace,bookTicketAsync,checkBookingStatus}

export { vulnerableReq, sequreTicket, eventFinder, conCurrentUpdate, initEvent, testRace, bookTicketAsync, checkBookingStatus };