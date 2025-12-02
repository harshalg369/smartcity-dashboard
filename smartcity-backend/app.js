const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sensors", require("./routes/sensors"));
app.use("/api/readings", require("./routes/readings"));
app.use("/api/admin", require("./routes/admin"));

// Test API
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend working" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
