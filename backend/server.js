const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB()

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", require("./routes/authRoutes.js"))
app.use("/api/org", require("./routes/organizationRoutes.js"));
app.use("/api/attendance", require("./routes/attendanceRoutes.js"));
app.use("/api/admin", require("./routes/adminStatsRoutes.js"))

app.get('/', (req,res)=> {
    res.send("Backend Running 🚀 !!")
})


const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log("Server is running on PORT 5000");
});