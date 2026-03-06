import express from "express";
import verifyToken from "../middleware/middleWare.js";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";
import {
    vulnerableReq,
    sequreTicket,
    eventFinder,
    conCurrentUpdate,
    initEvent,
    testRace,
    bookTicketAsync,
    checkBookingStatus
} from "../controllers/ticketController.js";


const router = express.Router();


router.post('/api/book/vulnerable', verifyToken, rateLimitMiddleware, vulnerableReq);
router.post('/api/book/secure', verifyToken, rateLimitMiddleware, sequreTicket);
router.post('/api/book/async', verifyToken, rateLimitMiddleware, bookTicketAsync);
router.get('/api/book/status/:jobId', verifyToken, checkBookingStatus);

router.get('/api/seats/:eventId', verifyToken, eventFinder);
router.post('/api/reset/:eventId', verifyToken, conCurrentUpdate);
router.post('/api/init', verifyToken, initEvent);
router.get('/api/test', verifyToken, rateLimitMiddleware, testRace);

export default router;