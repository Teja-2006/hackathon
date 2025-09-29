//
// dashboard.js
//
// Description:
// This file contains a self-contained React component for a visually stunning
// analytics dashboard. It fetches data from a local Express.js API to display
// real-time metrics, a pie chart of donations by category, and a line chart
// of activity over time.
//
// To use this file, ensure your Express.js server with the analytics API
// endpoints is running.
//

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Package, Users, TrendingUp, Clock, Link, Copy } from "lucide-react";

// The base URL for the API. This will be the ngrok URL in production.
const API_BASE = window.location.origin;

/**
 * StatCard Component
 * Displays a single key metric with an icon and color.
 */
const StatCard = ({ title, value, icon, color }) => {
  const IconComponent = lucide[icon];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <IconComponent className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

/**
 * NgrokPanel Component
 * Displays the public ngrok URL with a copy-to-clipboard button.
 */
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
            <a
              href={url}
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              {url}
            </a>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
        >
          <Copy size={14} className="mr-2" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

/**
 * Main Dashboard Component
 * Fetches and displays all the analytics data.
 */
const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [ngrokUrl, setNgrokUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, categoryRes, activityRes, ngrokRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/analytics/summary`),
            fetch(`${API_BASE}/api/analytics/donations-by-category`),
            fetch(`${API_BASE}/api/analytics/activity-over-time`),
            fetch(`${API_BASE}/api/ngrok`),
          ]);

        const summaryData = await summaryRes.json();
        const categoryData = await categoryRes.json();
        const activityData = await activityRes.json();
        const ngrokData = await ngrokRes.json();

        setSummary(summaryData.data);
        setCategoryData(categoryData.data);
        setActivityData(activityData.data);
        if (ngrokData.success && ngrokData.tunnels.length > 0) {
          setNgrokUrl(ngrokData.tunnels[0].public_url);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Analytics Dashboard
      </h1>
      <p className="text-gray-500 mb-8">
        Real-time insights into your donation system.
      </p>

      <NgrokPanel url={ngrokUrl} />

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Donations"
            value={summary.totalDonations}
            icon="Package"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Requests"
            value={summary.totalRequests}
            icon="Users"
            color="bg-green-500"
          />
          <StatCard
            title="Pending Requests"
            value={summary.pendingRequests}
            icon="Clock"
            color="bg-yellow-500"
          />
          <StatCard
            title="Uptime (seconds)"
            value={summary.uptime}
            icon="TrendingUp"
            color="bg-purple-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Donations & Requests Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Donations"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Requests"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Donations by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

export default Dashboard;
