import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.use('/test-race-condition',async (req, res) => {});

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
