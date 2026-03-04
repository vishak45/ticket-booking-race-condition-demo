# Ticket Booking Race Condition Demo

An interactive demonstration of race conditions in ticket booking systems, showing both the **problem** and the **solution**.

---

## What is a Race Condition?

A **race condition** is a software bug that occurs when two or more operations try to access and modify shared data at the same time, and the final result depends on the timing of their execution.

### Real-World Analogy

Imagine two people trying to withdraw the last $100 from a joint bank account at the same ATM moment:

1. Person A checks balance → sees $100
2. Person B checks balance → sees $100
3. Person A withdraws $100 → balance becomes $0
4. Person B withdraws $100 → **balance becomes -$100!**

Both saw $100 available, both withdrew, and the bank lost money. This is exactly what happens in ticket booking systems without proper handling.

---

## The Problem: Overbooking

In a ticket booking system, race conditions cause **overselling** — more tickets sold than actually available.

### How It Happens

```
Timeline:
─────────────────────────────────────────────────────────────────►

User A                          User B
  │                               │
  ├── Read: 1 seat available      │
  │                               ├── Read: 1 seat available
  │                               │
  ├── Book seat ✓                 │
  │                               ├── Book same seat ✓  ← BOTH SUCCEED!
  │                               │
  ▼                               ▼
        Database shows 1 booking, but 2 users have tickets!
```

### Vulnerable Code Pattern

```javascript
// ❌ VULNERABLE: Read-then-write pattern
const seat = await Seat.findOne({ eventId, isBooked: false });

// ⚠️ GAP: Another request can read the same seat here!
await new Promise(resolve => setTimeout(resolve, 50)); // Simulated delay

seat.isBooked = true;
seat.bookedBy = userId;
await seat.save();
```

The problem: Between reading (`findOne`) and writing (`save`), another request can slip in and read the same unbooked seat.

---

## The Solution: Atomic Operations

I fixed this using MongoDB's **atomic `findOneAndUpdate`** operation, which finds and updates a document in a single, uninterruptible step.

### Secure Code Pattern

```javascript
// ✅ SECURE: Atomic operation
const seat = await Seat.findOneAndUpdate(
  { eventId, isBooked: false },                    // Find condition
  { 
    $set: { 
      isBooked: true, 
      bookedBy: userId,
      bookedAt: new Date()
    } 
  },
  { new: true }                                     // Return updated doc
);

if (!seat) {
  return res.status(400).json({ error: 'No seats available' });
}
```

### Why This Works

| Vulnerable Approach | Secure Approach |
|---------------------|-----------------|
| 2 separate operations (read + write) | 1 atomic operation |
| Gap between read and write | No gap — instantaneous |
| Multiple users can "win" | Only one user can win |
| Overbooking possible | Overbooking impossible |

The database locks the document during `findOneAndUpdate`, ensuring only one request can book a given seat.

---

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
