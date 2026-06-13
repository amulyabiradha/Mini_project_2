const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (no deprecated options)
mongoose.connect("mongodb://127.0.0.1:27017/eventBooking");

// ✅ Connection check
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB successfully!");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Schema & Model
const BookingSchema = new mongoose.Schema({
  hour: { type: String, required: true, unique: true },
});
const Booking = mongoose.model("Booking", BookingSchema);

// ✅ Get all bookings
app.get("/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// ✅ Book a slot
app.post("/bookings", async (req, res) => {
  const { hour } = req.body;

  const existing = await Booking.findOne({ hour });
  if (existing) {
    return res.status(400).json({ message: "Slot already booked!" });
  }

  const booking = new Booking({ hour });
  await booking.save();
  res.json({ message: "Slot booked successfully!", booking });
});

// ✅ Clear all bookings (optional feature)
app.delete("/clear", async (req, res) => {
  await Booking.deleteMany({});
  res.json({ message: "All bookings cleared!" });
});

// ✅ Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
