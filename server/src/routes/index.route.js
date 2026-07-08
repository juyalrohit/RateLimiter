import express from 'express'
import { rateLimiterMiddleware } from '../middleware/rateLimiter.middleware.js';
const route = express.Router();

export const sendRequestRouter = route.get("/", rateLimiterMiddleware, (req, res)=>{
    try {
        return res.status(200).send("Okay You can make request to the Server");
        
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
})