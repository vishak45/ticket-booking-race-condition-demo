import express from "express";
import verifyToken from "../middleware/middleWare.js";
import {
    vulnerableReq,
    sequreTicket,
    eventFinder,
    conCurrentUpdate,
    initEvent,
    testRace
} from "../controllers/ticketController.js";


const router = express.Router();
router.post('/api/book/vulnerable',verifyToken,vulnerableReq );

router.post('/api/book/secure',verifyToken,sequreTicket );


router.get('/api/seats/:eventId',verifyToken,eventFinder );


router.post('/api/reset/:eventId',verifyToken,conCurrentUpdate);


router.post('/api/init',verifyToken,initEvent);
router.get('/api/test',verifyToken,testRace); ;

export default router;