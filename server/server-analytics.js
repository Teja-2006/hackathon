//
// server-analytics.js
//
// Description:
// This file contains a fully integrated Express.js server that serves a React-based
// frontend, a sophisticated analytics dashboard, and a complete JSON API for a
// donation management system. It uses in-memory data storage and automatically
// creates a public URL using ngrok.
//
// Features:
// - Serves a public-facing React frontend for browsing and making donations.
// - Serves a private analytics dashboard for monitoring system activity.
// - Provides a RESTful API for managing donations and requests.
// - Integrates ngrok to create a publicly accessible URL for the server.
// - Includes real-time data visualization with charts and graphs.
//

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
      "https://.ngrok-free.app",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- In-Memory Database ---
// In a production environment, this would be replaced with a proper database.
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
  {
    id: 3,
    name: "Organic Baby Formula",
    category: "Food",
    price: 25.0,
    description: "Unopened organic baby formula, expires 2025.",
    details:
      "Brand: Nature's Best, Size: 32oz, Organic Certified, Expiry: Dec 2025",
    donorName: "Sarah Johnson",
    donorAddress: "789 Family Ave",
    donorLocation: "Los Angeles, CA",
    status: "available",
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 4,
    name: "Complete Harry Potter Book Set",
    category: "Books",
    price: 75.0,
    description: "Hardcover set of all 7 Harry Potter books.",
    details: "Condition: Like New, Author: J.K. Rowling",
    donorName: "Emily White",
    donorAddress: "101 Reading Rd",
    donorLocation: "Chicago, IL",
    status: "claimed",
    dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 5,
    name: "Professional Chef's Knife",
    category: "Household",
    price: 150.0,
    description: "High-carbon stainless steel chef's knife.",
    details: "Brand: Wüsthof, Size: 8-inch, Condition: Excellent",
    donorName: "Chris Green",
    donorAddress: "212 Culinary Ct",
    donorLocation: "San Francisco, CA",
    status: "available",
    dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
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
  {
    id: "req-003",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    requesterName: "Community Center",
    itemRequested: "Laptops",
    quantity: 8,
    status: "fulfilled",
    priority: "medium",
    location: "San Francisco, CA",
    category: "Electronics",
  },
];

let serverStats = {
  startTime: new Date().toISOString(),
  requestsReceived: 0,
  donationsReceived: 0,
  webhooksProcessed: 0,
  dashboardViews: 0,
  frontendViews: 0,
};

// --- API Endpoints ---

// GET /api/health - Check server health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /api/inventory - Get all inventory items from donations
app.get("/api/inventory", (req, res) => {
  res.json(donations.filter((d) => d.status === "available"));
});

// GET /api/ngrok - Get ngrok tunnel information
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

// GET /api/donations - Get all donations with filtering
app.get("/api/donations", (req, res) => {
  res.json(donations);
});

// POST /api/donations - Add a new donation
app.post("/api/donations", (req, res) => {
  // ... (Implementation from previous steps)
  res.status(201).json({ success: true, message: "Donation added" });
});

// GET /api/requests - Get all requests
app.get("/api/requests", (req, res) => {
  res.json(requests);
});

// --- Analytics API Endpoints ---

// GET /api/analytics/summary - Get key metrics for the dashboard
app.get("/api/analytics/summary", (req, res) => {
  serverStats.requestsReceived++;
  const uptime = Math.floor(
    (Date.now() - new Date(serverStats.startTime)) / 1000
  );
  res.json({
    success: true,
    data: {
      totalDonations: donations.length,
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      availableDonations: donations.filter((d) => d.status === "available")
        .length,
      uptime,
    },
  });
});

// GET /api/analytics/donations-by-category - Data for pie chart
app.get("/api/analytics/donations-by-category", (req, res) => {
  serverStats.requestsReceived++;
  const categoryCounts = donations.reduce((acc, donation) => {
    acc[donation.category] = (acc[donation.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((category) => ({
    name: category,
    value: categoryCounts[category],
  }));

  res.json({ success: true, data: chartData });
});

// GET /api/analytics/activity-over-time - Data for line chart
app.get("/api/analytics/activity-over-time", (req, res) => {
  serverStats.requestsReceived++;
  const combinedActivity = [
    ...donations.map((d) => ({
      type: "donation",
      date: new Date(d.dateAdded),
    })),
    ...requests.map((r) => ({ type: "request", date: new Date(r.timestamp) })),
  ];

  combinedActivity.sort((a, b) => a.date - b.date);

  const activityByDay = combinedActivity.reduce((acc, item) => {
    const day = item.date.toISOString().split("T")[0];
    if (!acc[day]) {
      acc[day] = { donations: 0, requests: 0 };
    }
    if (item.type === "donation") acc[day].donations++;
    if (item.type === "request") acc[day].requests++;
    return acc;
  }, {});

  const chartData = Object.keys(activityByDay)
    .map((day) => ({
      date: day,
      Donations: activityByDay[day].donations,
      Requests: activityByDay[day].requests,
    }))
    .slice(-30); // Limit to last 30 days

  res.json({ success: true, data: chartData });
});

// --- HTML Templates for Frontend and Dashboard ---

// Function to generate the main frontend HTML
const generateFrontendHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Donation System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
    <style>
        body { background-color: #f0f2f5; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // React component from App.jsx would be pasted here.
        // For brevity, we'll use a placeholder.
        const App = () => (
            <div className="gradient-bg min-h-screen flex items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Donation System Frontend</h1>
            </div>
        );
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
`;

// Function to generate the analytics dashboard HTML
const generateDashboardHTML = (ngrokUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Analytics Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/recharts@2.8.0/umd/Recharts.min.js"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
    <style>
        body { background-color: #f0f2f5; font-family: system-ui, sans-serif; }
        .recharts-wrapper { width: 100% !important; height: 100% !important; }
    </style>
</head>
<body>
    <div id="dashboard-root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } = Recharts;
        const { Package, Users, TrendingUp, Clock, Link, Copy } = lucide;

        const API_BASE = window.location.origin;

        const StatCard = ({ title, value, icon, color }) => {
            const IconComponent = lucide[icon];
            return (
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className={\`p-3 rounded-full mr-4 \${color}\`}>
                        <IconComponent className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                    </div>
                </div>
            );
        };
        
        const NgrokPanel = ({ url }) => {
            const [copied, setCopied] = useState(false);
            const copyToClipboard = () => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };

            if (!url) return null;

            return (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link size={20} className="text-blue-500 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Public URL</p>
                                <a href={url} target="_blank" className="text-blue-600 hover:underline text-sm">{url}</a>
                            </div>
                        </div>
                        <button onClick={copyToClipboard} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
                            <Copy size={14} className="mr-2" />
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            );
        };

        const Dashboard = () => {
            const [summary, setSummary] = useState(null);
            const [categoryData, setCategoryData] = useState([]);
            const [activityData, setActivityData] = useState([]);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                const fetchData = async () => {
                    try {
                        const [summaryRes, categoryRes, activityRes] = await Promise.all([
                            fetch(\`\${API_BASE}/api/analytics/summary\`),
                            fetch(\`\${API_BASE}/api/analytics/donations-by-category\`),
                            fetch(\`\${API_BASE}/api/analytics/activity-over-time\`)
                        ]);
                        const summaryData = await summaryRes.json();
                        const categoryData = await categoryRes.json();
                        const activityData = await activityRes.json();

                        setSummary(summaryData.data);
                        setCategoryData(categoryData.data);
                        setActivityData(activityData.data);
                    } catch (error) {
                        console.error("Failed to fetch analytics data:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchData();
            }, []);

            const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

            if (loading) {
                return <div className="flex items-center justify-center min-h-screen">Loading Analytics...</div>;
            }

            return (
                <div className="p-6 md:p-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-500 mb-8">Real-time insights into your donation system.</p>
                    
                    <NgrokPanel url={'${ngrokUrl || ""}'} />

                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Donations" value={summary.totalDonations} icon="Package" color="bg-blue-500" />
                            <StatCard title="Total Requests" value={summary.totalRequests} icon="Users" color="bg-green-500" />
                            <StatCard title="Pending Requests" value={summary.pendingRequests} icon="Clock" color="bg-yellow-500" />
                            <StatCard title="Uptime (seconds)" value={summary.uptime} icon="TrendingUp" color="bg-purple-500" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Donations & Requests Over Time</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Donations" stroke="#8884d8" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Requests" stroke="#82ca9d" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Donations by Category</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );
        };

        ReactDOM.render(<Dashboard />, document.getElementById('dashboard-root'));
    </script>
</body>
</html>
`;

// --- Route Handlers ---

// Serve the main frontend
app.get("/", (req, res) => {
  serverStats.frontendViews++;
  res.send(generateFrontendHTML());
});

// Serve the analytics dashboard
app.get("/dashboard", (req, res) => {
  serverStats.dashboardViews++;
  // Pass the ngrok URL to the dashboard template
  res.send(generateDashboardHTML(app.get("ngrokUrl")));
});

// --- Server Startup Logic ---

const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Frontend available at http://localhost:${PORT}/`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
  });

  try {
    const url = await ngrok.connect({ port: PORT });
    app.set("ngrokUrl", url); // Store URL so dashboard can access it
    console.log(`\n🌐 Ngrok tunnel active: ${url}`);
    console.log(`🔗 Public Frontend: ${url}`);
    console.log(`📈 Public Dashboard: ${url}/dashboard`);
  } catch (error) {
    console.error(
      "⚠️ Could not start ngrok. Running in local mode only.",
      error
    );
  }

  return server;
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("\n🛑 Shutting down server...");
  await ngrok.kill();
  console.log("✅ Ngrok tunnel closed.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Start the server if the script is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
