# Ticket Booking Race Condition Demo

An interactive demonstration of race conditions in ticket booking systems, showing both the **problem** and the **solution**.

## What This Demonstrates

Race conditions occur when multiple users try to book the same resource simultaneously. This project shows:

- **Vulnerable Approach**: Read-then-write pattern that allows double bookings
- **Secure Approach**: Atomic operations using MongoDB's `findOneAndUpdate`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ticket-booking-race-condition-demo
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   
   Create `backend/.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017/race-condition
   PORT=5000
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## How It Works

### The Race Condition Problem

```javascript
// VULNERABLE: Read-then-write pattern
const seat = await Seat.findOne({ eventId, isBooked: false });
// ⚠️ Another request can read the same seat here!
await new Promise(resolve => setTimeout(resolve, 50));
seat.isBooked = true;
await seat.save();
```

When two users check availability simultaneously, both see the same seat as available and both book it — resulting in overbooking.

### The Solution

```javascript
// SECURE: Atomic operation
const seat = await Seat.findOneAndUpdate(
  { eventId, isBooked: false },
  { $set: { isBooked: true, bookedBy: userId, bookedAt: new Date() } },
  { new: true }
);
```

`findOneAndUpdate` is atomic — it finds and updates in a single operation, preventing race conditions.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/book/vulnerable` | Book with race condition vulnerability |
| POST | `/api/book/secure` | Book with atomic operation (safe) |
| POST | `/api/init` | Initialize event with seats |
| GET | `/api/seats/:eventId` | Get seat status for an event |
| POST | `/api/reset/:eventId` | Reset all seats for an event |
| GET | `/api/events` | List all events |

## Project Structure

```
├── backend/
│   ├── index.js          # Express server & routes
│   ├── models/
│   │   ├── event.js      # Event schema
│   │   ├── seats.js      # Seat schema
│   │   └── userSchema.js # User schema
│   └── .env              # Environment config
│
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── BookingDemo.jsx           # Main demo interface
            ├── RaceConditionAnimation.jsx # Step-by-step explanation
            ├── Header.jsx
            └── ...
```

## Future Enhancements

### Redis Integration
- **Distributed Locking**: Use Redis `SETNX` for locks across multiple server instances
- **Rate Limiting**: Implement sliding window rate limiting with Redis
- **Caching**: Cache seat availability to reduce database queries
- **Pub/Sub**: Real-time seat updates across connected clients

```javascript
// Example: Redis distributed lock
const lockKey = `lock:seat:${seatId}`;
const acquired = await redis.set(lockKey, odUserId, 'NX', 'EX', 5);
if (!acquired) {
  return res.status(409).json({ error: 'Seat is being booked by another user' });
}
// ... perform booking ...
await redis.del(lockKey);
```

### Other Improvements
| Feature | Description |
|---------|-------------|
| **WebSocket Updates** | Real-time seat status via Socket.io |
| **Queue System** | BullMQ for handling booking requests sequentially |
| **Optimistic Locking** | Version field (`__v`) for conflict detection |
| **Database Transactions** | MongoDB transactions for multi-document operations |
| **Authentication** | JWT-based user authentication |
| **Input Validation** | Zod/Joi schema validation |
| **API Rate Limiting** | express-rate-limit middleware |
| **Structured Logging** | Pino or Winston for production logs |
| **Testing** | Jest + Supertest for API tests |
| **Docker** | Containerized deployment |

## License

MIT
