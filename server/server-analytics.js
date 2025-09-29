// All frontend code, including JSX, will live here.
import React, { useState, useEffect } from "react";
import {
  Search, Tag, Utensils, Apple, Cookie, BookOpen, Warehouse, Dumbbell, MessageSquare, Send, Monitor,
  Shirt, Book, Home, Zap, Heart, Wrench, Plus, ChevronLeft, CheckCircle, MapPin, User, Mail, Globe,
  AlertTriangle, LogIn, LogOut, Image, Settings, Building,
} from "lucide-react";

// --- Base Mock Data ---
const BASE_MOCK_INVENTORY = [
  { id: 1, name: "Ergonomic Mechanical Keyboard", category: "Electronics", price: 120.0, description: "High-quality clicky keys for comfortable typing.", details: "Switches: Brown, Connectivity: Wired/Bluetooth, Color: Black, Weight: 1.2kg", donorName: "Jane Doe", donorAddress: "123 Tech Lane", donorLocation: "Austin, TX", },
  { id: 2, name: '4K UltraWide Monitor 34"', category: "Electronics", price: 750.5, description: "Stunning visual fidelity and massive screen real estate.", details: "Resolution: 3440x1440, Refresh Rate: 100Hz, Ports: HDMI, DisplayPort", donorName: "John Smith", donorAddress: "45 Monitor Blvd", donorLocation: "San Francisco, CA", },
  { id: 3, name: "Wireless Gaming Mouse", category: "Electronics", price: 55.99, description: "Low latency, high precision sensor for competitive gaming.", details: "DPI: 16000, Weight: 90g, Battery Life: 70 hours, programmable buttons.", donorName: "Jane Doe", donorAddress: "123 Tech Lane", donorLocation: "Austin, TX", },
  { id: 4, name: "Noise-Cancelling Headphones", category: "Electronics", price: 299.0, description: "Immersive sound experience with industry-leading ANC.", details: "Battery: 30 hours, Noise Cancellation: Adaptive, Includes hard shell carrying case.", donorName: "Mike Jones", donorAddress: "789 Headset Way", donorLocation: "New York, NY", },
  { id: 5, name: "Portable SSD 1TB", category: "Electronics", price: 110.0, description: "Blazing fast external storage for large files.", details: "Read Speed: 540MB/s, Interface: USB 3.1 Gen 2, Durable, shock-resistant casing.", donorName: "John Smith", donorAddress: "45 Monitor Blvd", donorLocation: "San Francisco, CA", },
  { id: 6, name: "Adjustable LED Desk Lamp", category: "Home & Garden", price: 79.99, description: "Dimmable light for comfortable reading or working.", details: "Settings: 5 brightness levels, Color Temp: 3000K-6000K, Flexible neck, USB charging port.", donorName: "Sarah Connor", donorAddress: "101 Bright St", donorLocation: "Seattle, WA", },
  { id: 7, name: "Waterproof Gardening Gloves", category: "Home & Garden", price: 15.0, description: "Durable gloves for heavy-duty yard work.", details: "Material: Nitrile and Nylon blend, Size: Medium, Puncture resistant.", donorName: "Sarah Connor", donorAddress: "101 Bright St", donorLocation: "Seattle, WA", },
  { id: 8, name: "Classic Fit Cotton T-Shirt", category: "Clothing", price: 25.0, description: "Soft and breathable 100% cotton casual shirt.", details: "Material: 100% Organic Cotton, Color: Heather Gray, Available sizes: S, M, L, XL.", donorName: "David Lee", donorAddress: "202 Fashion Lane", donorLocation: "Los Angeles, CA", },
  { id: 9, name: "Best-Selling Thriller Novel", category: "Books", price: 14.99, description: "A gripping story with unexpected twists and turns.", details: "Author: J. D. Winters, Pages: 450, Format: Hardcover, Genre: Psychological Thriller.", donorName: "David Lee", donorAddress: "202 Fashion Lane", donorLocation: "Los Angeles, CA", },
  { id: 10, name: "Professional Yoga Mat", category: "Sports", price: 49.99, description: "Non-slip surface for perfect grip and balance.", details: "Thickness: 6mm, Material: TPE, Includes carrying strap, Easy to clean.", donorName: "Mike Jones", donorAddress: "789 Headset Way", donorLocation: "New York, NY", },
  { id: 11, name: "USB-C Docking Station", category: "Electronics", price: 150.0, description: "One cable solution for all your peripheral needs.", details: "Ports: 2x HDMI, 3x USB-A, 1x Ethernet, PD Charging, Aluminum casing.", donorName: "Sarah Connor", donorAddress: "101 Bright St", donorLocation: "Seattle, WA", },
];

const MOCK_FOOD_ITEMS = [
  { name: "Canned Vegetables", type: "Pantry", available: 85, details: "12-pack mixed veggies, shelf life 2 years.", },
  { name: "Trail Mix Packs", type: "Snack", available: 52, details: "Individual 100g packs, variety of nuts and dried fruit.", },
  { name: "Boxed Pasta", type: "Pantry", available: 120, details: "500g boxes, mix of spaghetti and penne.", },
  { name: "Fresh Apples", type: "Produce", available: 25, details: "Crisp Red Delicious variety, picked last week.", },
];

// Get unique categories and add 'All'
const categories = ["All", ...new Set(BASE_MOCK_INVENTORY.map((item) => item.category)), ];
const CONDITIONS = ["New", "Excellent", "Good", "Used", "Fair"];
const FOOD_TYPES = ["Produce", "Snack", "Pantry"];
const LOW_STOCK_THRESHOLD = 20;

/**
 * Helper function to return an appropriate icon component for the category.
 */
const getCategoryIcon = (category) => {
  const iconProps = { size: 60, className: "text-white drop-shadow-md" };
  switch (category) {
    case "Electronics": return <Zap {...iconProps} />;
    case "Clothing": return <Shirt {...iconProps} />;
    case "Books": return <Book {...iconProps} />;
    case "Home & Garden": return <Home {...iconProps} />;
    case "Sports": return <Dumbbell {...iconProps} />;
    default: return <Wrench {...iconProps} />; // Default Icon
  }
};

/**
 * Helper function to return a category-specific color class for the background.
 */
const getCategoryColor = (category) => {
  switch (category) {
    case "Electronics": return "bg-gray-500";
    case "Clothing": return "bg-red-500";
    case "Books": return "bg-green-500";
    case "Home & Garden": return "bg-amber-500";
    case "Sports": return "bg-cyan-500";
    default: return "bg-gray-500";
  }
};

/**
 * Helper function to return an appropriate icon for the food type.
 */
const getFoodIcon = (type) => {
  const iconSize = 14;
  const iconClass = "mr-1.5 text-gray-500 flex-shrink-0";
  switch (type) {
    case "Produce": return <Apple size={iconSize} className={iconClass} />;
    case "Snack": return <Cookie size={iconSize} className={iconClass} />;
    case "Pantry": return <Warehouse size={iconSize} className={iconClass} />;
    default: return <Utensils size={iconSize} className={iconClass} />;
  }
};

/**
 * ItemCard Component
 * Displays individual item information in a stylized card.
 */
const ItemCard = ({ item, onClick }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] hover:brightness-105 hover:bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => onClick(item)} >
    {/* Icon Slot - Replaces Image */}
    <div className={`w-full h-28 flex items-center justify-center rounded-md mb-3 border border-gray-100 ${getCategoryColor(item.category)}`}>
      {getCategoryIcon(item.category)}
    </div>
    <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
    <div className="space-y-1 text-xs">
      <div className="flex items-center text-gray-600">
        <Tag size={12} className="mr-1 text-gray-500" />
        <span className="font-medium">{item.category}</span>
      </div>
    </div>
  </div>
);

/**
 * FoodCard Component
 * Displays individual food item information in a smaller card.
 */
const FoodCard = ({ food }) => {
  // Determine if stock is critically low
  const isLowStock = food.available < LOW_STOCK_THRESHOLD;
  // Set dynamic color classes for the stock badge (Gray theme)
  const badgeBg = isLowStock ? "bg-red-500" : "bg-gray-50";
  const badgeBorder = isLowStock ? "border-red-700" : "border-gray-200";
  const badgeText = isLowStock ? "text-white" : "text-gray-700";
  return (
    <div className="flex justify-between items-center text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200 shadow-sm transition duration-150 hover:shadow-md transform hover:scale-[1.01] hover:bg-gray-50 cursor-pointer">
      <div className="flex flex-col">
        <div className="flex items-center">
          {/* Displaying the Icon */}
          {getFoodIcon(food.type)}
          <span className="font-bold text-gray-800">{food.name}