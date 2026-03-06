import Queue from 'bull';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

export const bookingQueue = new Queue('ticket-booking', redisConfig);

// Process booking jobs
bookingQueue.process(async (job) => {
  const { eventId, userId, Seat } = job.data;
  
  try {
    // Atomic seat booking with MongoDB
    const seat = await Seat.findOneAndUpdate(
      { eventId, isBooked: false },
      { 
        isBooked: true, 
        bookedAt: new Date(), 
        userId 
      },
      { new: true }
    );
    
    if (!seat) throw new Error('No seats available');
    
    return { success: true, seatNumber: seat.seatNumber, eventId, userId };
  } catch (error) {
    throw new Error(error.message);
  }
});

bookingQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
});

bookingQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

// Clean up stalled jobs
bookingQueue.clean(0, 'completed');

export default bookingQueue;
