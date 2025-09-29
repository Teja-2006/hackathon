import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Server,
  Wifi,
  MapPin,
  Calendar,
  Filter,
  Search,
  Eye,
  Bell,
  Activity,
  Database,
  Link2,
} from "lucide-react";

// Mock data for dashboard metrics - This will be replaced by API calls
// const MOCK_REQUESTS = [ ... ];

const CHART_COLORS = ["#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6"];

// Analytics data - This will be dynamically generated
// const categoryData = [ ... ];
// const weeklyData = [ ... ];

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "Pending",
        };
      case "approved":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "Approved" };
      case "fulfilled":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Fulfilled",
        };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
    }
  };

  const config = getStatusConfig();
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case "urgent":
        return { bg: "bg-red-500", text: "text-white", label: "Urgent" };
      case "high":
        return { bg: "bg-orange-500", text: "text-white", label: "High" };
      case "medium":
        return { bg: "bg-yellow-500", text: "text-white", label: "Medium" };
      case "low":
        return { bg: "bg-green-500", text: "text-white", label: "Low" };
      default:
        return { bg: "bg-gray-500", text: "text-white", label: "Normal" };
    }
  };

  const config = getPriorityConfig();
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const NgrokConnectionStatus = ({ connected, tunnelUrl }) => {
  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
        connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span>{connected ? "Ngrok Connected" : "Ngrok Disconnected"}</span>
      {connected && tunnelUrl && (
        <span className="text-xs text-gray-600">({tunnelUrl})</span>
      )}
    </div>
  );
};

const DonationDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [ngrokConnected, setNgrokConnected] = useState(true);
  const [tunnelUrl, setTunnelUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = "http://localhost:3002/api"; // Assuming your server runs on 3002

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [requestsRes, donationsRes, inventoryRes, ngrokRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/requests`),
          fetch(`${API_BASE_URL}/donations`),
          fetch(`${API_BASE_URL}/inventory`),
          fetch(`${API_BASE_URL}/ngrok`),
        ]);

      const requestsData = await requestsRes.json();
      const donationsData = await donationsRes.json();
      const inventoryData = await inventoryRes.json();
      const ngrokData = await ngrokRes.json();

      setRequests(requestsData);
      setDonations(donationsData);
      setInventory(inventoryData);

      if (ngrokData.tunnels && ngrokData.tunnels.length > 0) {
        setNgrokConnected(true);
        setTunnelUrl(ngrokData.tunnels[0].public_url);
      } else {
        setNgrokConnected(false);
        setTunnelUrl("");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Handle error state in UI
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter requests based on status and search
  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.itemRequested.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const fulfilledRequests = requests.filter(
    (r) => r.status === "fulfilled"
  ).length;
  const rejectedRequests = requests.filter(
    (r) => r.status === "rejected"
  ).length;

  // Dynamic chart data generation
  const categoryData = React.useMemo(() => {
    const categoryCounts = donations.reduce((acc, donation) => {
      acc[donation.category] =
        (acc[donation.category] || 0) + donation.quantity;
      return acc;
    }, {});
    return Object.entries(categoryCounts).map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [donations]);

  const weeklyData = React.useMemo(() => {
    const dataByDay = Array(7)
      .fill(0)
      .map(() => ({ requests: 0, fulfilled: 0 }));
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();

    requests.forEach((req) => {
      const reqDate = new Date(req.timestamp);
      const dayIndex = reqDate.getDay();
      if (reqDate >= new Date(today.setDate(startOfWeek))) {
        dataByDay[dayIndex].requests++;
        if (req.status === "fulfilled") {
          dataByDay[dayIndex].fulfilled++;
        }
      }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dataByDay.map((d, i) => ({ day: days[i], ...d }));
  }, [requests]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredRequests, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "donation_requests.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="mr-3 text-gray-600" size={32} />
                Donation Request Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage donation requests across all channels
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <NgrokConnectionStatus
                connected={ngrokConnected}
                tunnelUrl={tunnelUrl}
              />
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-150 ${
                  refreshing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw
                  className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                  size={16}
                />
                {refreshing ? "Syncing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRequests}
                </p>
              </div>
              <Package className="text-gray-400" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <TrendingUp className="inline mr-1" size={14} />
              +12% from last week
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingRequests}
                </p>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-500">Awaiting approval</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-2xl font-bold text-green-600">
                  {fulfilledRequests}
                </p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Successfully completed
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedRequests}
                </p>
              </div>
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            <div className="mt-2 text-sm text-gray-500">Unable to fulfill</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Request Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stackId="1"
                  stroke="#4B5563"
                  fill="#4B5563"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="fulfilled"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Requests by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Integration Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="mr-2 text-gray-600" size={20} />
            External System Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Globe className="mr-2 text-blue-500" size={16} />
                Ngrok Tunnel
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                External API access via secure tunnel
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Tunnel URL:</div>
                <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                  {tunnelUrl}
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Database className="mr-2 text-green-500" size={16} />
                API Status
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Real-time connection monitoring
              </p>
              <div className="flex items-center space-x-2">
                <Activity className="text-green-500" size={16} />
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Link2 className="mr-2 text-purple-500" size={16} />
                Endpoints
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Available API endpoints
              </p>
              <div className="text-xs space-y-1">
                <div>POST /api/requests</div>
                <div>GET /api/requests</div>
                <div>PUT /api/requests/:id</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Requests
              </h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={handleExportData}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-150 text-sm"
                >
                  <Download className="mr-2" size={14} />
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="mr-2 text-gray-400" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.requesterName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.itemRequested}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="mr-1 text-gray-400" size={14} />
                        {request.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-600 hover:text-gray-900">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No requests found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDashboard;
