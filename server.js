const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Initial resettable state
const initialExperiences = [
  {
    id: "1",
    title: "Goa Beach Retreat",
    description: "Enjoy the sun and sand in Goa.",
    image: "/images/goa.jpg",
    slots: [
      { date: "2025-11-01", time: "10:00 AM", available: true },
      { date: "2025-11-02", time: "02:00 PM", available: true },
    ],
  },
  {
    id: "2",
    title: "Jaipur Heritage Tour",
    description: "Discover the palaces of Jaipur.",
    image: "/images/jaipur.jpg",
    slots: [
      { date: "2025-11-03", time: "09:00 AM", available: true },
      { date: "2025-11-04", time: "11:00 AM", available: false },
    ],
  },
];

// Working copy for runtime changes
let experiences = JSON.parse(JSON.stringify(initialExperiences));

const promoCodes = {
  SAVE10: 10,
  SAVE20: 20,
};

let bookings = [];

// List all experiences (basic info, for home display)
app.get("/api/experiences", (req, res) => {
  // Send all, or remove slot info if you want a summary listing only
  res.json(experiences.map(({ slots, ...rest }) => rest));
});

// Get experience details (full info, with slots)
app.get("/api/experiences/:id", (req, res) => {
  const exp = experiences.find((e) => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: "Experience not found" });
  res.json(exp);
});

// Validate promo code
app.post("/api/promo/validate", (req, res) => {
  const { code } = req.body;
  if (!code || !promoCodes.hasOwnProperty(code)) {
    return res.status(400).json({ valid: false, discount: 0 });
  }
  res.json({ valid: true, discount: promoCodes[code] });
});

// Create a booking
app.post("/api/bookings", (req, res) => {
  const { experienceId, slot, name, email, promoCode } = req.body;

  if (!experienceId || !slot || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const exp = experiences.find((e) => e.id === experienceId);
  if (!exp) return res.status(400).json({ error: "Experience not found" });

  const slotEntry = exp.slots.find(
    (s) => s.date === slot.date && s.time === slot.time
  );
  if (!slotEntry || !slotEntry.available) {
    return res.status(400).json({ error: "Selected slot is not available" });
  }

  let discount = 0;
  if (promoCode && promoCodes.hasOwnProperty(promoCode)) {
    discount = promoCodes[promoCode];
  }

  bookings.push({
    id: bookings.length + 1,
    experienceId,
    slot,
    name,
    email,
    promoCode: promoCode || null,
    discount,
  });

  // Mark the slot as unavailable
  slotEntry.available = false;

  res.json({
    message: "Booking successful",
    bookingId: bookings.length,
    discount,
  });
});

// Admin endpoint to reset slots and bookings
app.post("/api/admin/reset-slots", (req, res) => {
  experiences = JSON.parse(JSON.stringify(initialExperiences));
  bookings = [];
  res.json({ success: true, message: "Slots and bookings reset successfully" });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST_IP = "192.168.1.35"; // Or use '0.0.0.0'
app.listen(PORT, HOST_IP, () => {
  console.log(`Booking API server started on http://${HOST_IP}:${PORT}`);
});
