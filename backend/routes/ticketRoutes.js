import express from "express";
import {
    vulnerableReq,
    sequreTicket,
    eventFinder,
    conCurrentUpdate,
    initEvent,
    testRace
} from "../controllers/ticketController.js";


const router = express.Router();
router.post('/api/book/vulnerable',vulnerableReq );

router.post('/api/book/secure',sequreTicket );


router.get('/api/seats/:eventId',eventFinder );


router.post('/api/reset/:eventId',conCurrentUpdate);


router.post('/api/init',initEvent);
router.get('/api/test',testRace); ;

export default router;