import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Race condition demonstration backend");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
