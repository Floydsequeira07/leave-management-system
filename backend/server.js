const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Leave Management API is running"
    });
});
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});