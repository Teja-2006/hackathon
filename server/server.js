const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

// --- Middleware Setup ---
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5174",
      "https://*.ngrok-free.app",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'home' directory's 'dist' folder
app.use(express.static(path.join(__dirname, "..", "dist")));

// --- In-Memory Database ---
let donations = [
  {
    id: 1,
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 120.0,
    description: "High-quality clicky keys for comfortable typing.",
    details:
      "Switches: Brown, Connectivity: Wired/Bluetooth, Color: Black, Weight: 1.2kg",
    donorName: "Jane Doe",
    donorAddress: "123 Tech Lane",
    donorLocation: "Austin, TX",
    status: "available",
    dateAdded: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 2,
    name: "Vintage Leather Jacket",
    category: "Clothing",
    price: 85.0,
    description: "Classic brown leather jacket in excellent condition.",
    details:
      "Size: Medium, Material: Genuine Leather, Color: Brown, Vintage Style",
    donorName: "Michael Smith",
    donorAddress: "456 Fashion St",
    donorLocation: "New York, NY",
    status: "available",
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

let requests = [
  {
    id: "req-001",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    requesterName: "Local Food Bank",
    itemRequested: "Canned Goods",
    quantity: 50,
    status: "pending",
    priority: "high",
    location: "Austin, TX",
    category: "Food",
  },
  {
    id: "req-002",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    requesterName: "Homeless Shelter",
    itemRequested: "Winter Clothing",
    quantity: 25,
    status: "approved",
    priority: "urgent",
    location: "Seattle, WA",
    category: "Clothing",
  },
];

// --- API Endpoints ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/donations", (req, res) => {
  res.json(donations);
});

app.get("/api/requests", (req, res) => {
  res.json(requests);
});

app.get("/api/inventory", (req, res) => {
  res.json(donations.filter((d) => d.status === "available"));
});

app.get("/api/ngrok", async (req, res) => {
  try {
    const tunnels = await ngrok.getApi().listTunnels();
    res.json({ success: true, tunnels: tunnels.tunnels });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch ngrok tunnels." });
  }
});

// --- Route Handlers ---
// Serve the main frontend for any route not handled by the API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// --- Server Startup Logic ---
const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  try {
    const url = await ngrok.connect({ port: PORT, authtoken_from_env: true });
    console.log(`\n🌐 Ngrok tunnel active: ${url}`);
  } catch (error) {
    console.error(
      "⚠️ Could not start ngrok. Running in local mode only.",
      error
    );
  }

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
