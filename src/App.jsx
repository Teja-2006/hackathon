import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Tag as TagIcon,
  Utensils,
  Apple,
  Cookie,
  Warehouse,
  Dumbbell,
  MessageSquare,
  Send,
  Shirt,
  Book,
  Home,
  Zap,
  Heart,
  Wrench,
  Plus,
  ChevronLeft,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Globe,
  AlertTriangle,
  LogIn,
  LogOut,
  Image,
  Settings,
  Building,
  Clock,
  Map,
  ClipboardList,
  Info,
  ListChecks,
  ArrowRight,
  X,
  DollarSign,
  Phone,
} from "lucide-react";

// --- MOCK DATA FOR LOCAL STATE ---
const MOCK_INVENTORY = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    condition: "New",
    description: "Ergonomic, black, unopened.",
    details: "Brand: Logitech, Model M300.",
    donatorName: "Alice Smith",
    donatorAddress: "123 Main St",
    donatorLocation: "Austin, TX",
    timestamp: Date.now() - 500000,
    price: 15,
    imageURL: "https://placehold.co/400x200/4B5563/FFFFFF?text=Wireless+Mouse",
  },
  {
    id: 2,
    name: "Men's Denim Jeans",
    category: "Clothing",
    condition: "Excellent",
    description: "Size 32x32, light wear.",
    details: "Brand: Levi's, 501 fit.",
    donatorName: "Bob Johnson",
    donatorAddress: "45 Elm Rd",
    donatorLocation: "Austin, TX",
    timestamp: Date.now() - 400000,
    price: 30,
    imageURL: "https://placehold.co/400x200/DC2626/FFFFFF?text=Denim+Jeans",
  },
  {
    id: 3,
    name: "Hardcover Novel",
    category: "Books",
    condition: "Good",
    description: "Sci-fi classic, minor damage on spine.",
    details: "Title: Dune, Author: Frank Herbert.",
    donatorName: "Charlie Brown",
    donatorAddress: "7 Pine Ln",
    donatorLocation: "Dallas, TX",
    timestamp: Date.now() - 300000,
    price: 5,
    imageURL: "https://placehold.co/400x200/059669/FFFFFF?text=Hardcover+Novel",
  },
  {
    id: 4,
    name: "Gardening Trowel Set",
    category: "Home & Garden",
    condition: "New",
    description: "Set of 3 stainless steel tools.",
    details: "Includes trowel, transplanter, and cultivator.",
    donatorName: "Dana Scully",
    donatorAddress: "10 X-File St",
    donatorLocation: "Houston, TX",
    timestamp: Date.now() - 200000,
    price: 10,
    imageURL: "https://placehold.co/400x200/F59E0B/FFFFFF?text=Trowel+Set",
  },
  {
    id: 5,
    name: "Yoga Mat",
    category: "Sports",
    condition: "Used",
    description: "Blue, thick foam, good grip.",
    details: "Thickness: 6mm, includes carrying strap.",
    donatorName: "Fox Mulder",
    donatorAddress: "11 Eerie Way",
    donatorLocation: "Austin, TX",
    timestamp: Date.now() - 100000,
    price: 20,
    imageURL: "https://placehold.co/400x200/06B6D4/FFFFFF?text=Yoga+Mat",
  },
];

const MOCK_FOOD_ITEMS = [
  {
    id: "f1",
    name: "Canned Vegetables (Case)",
    type: "Pantry",
    available: 85,
    details: "12-pack mixed veggies, shelf life 2 years.",
    storageLocation: "Pantry",
    specificLocation: "Shelf 1A",
    timestamp: Date.now() - 90000,
    donatorName: "Farm Co.",
    phone: "555-0001",
  },
  {
    id: "f2",
    name: "Trail Mix Packs",
    type: "Snack",
    available: 52,
    details: "Individual 100g packs, variety of nuts and dried fruit.",
    storageLocation: "Cool/Dry",
    specificLocation: "Storage Bin 5",
    timestamp: Date.now() - 80000,
    donatorName: "Snack Inc.",
    phone: "555-0002",
  },
  {
    id: "f3",
    name: "Fresh Apples (Box)",
    type: "Produce",
    available: 25,
    details: "Crisp Red Delicious variety, picked last week.",
    storageLocation: "Refrigerated",
    specificLocation: "Fridge Unit 3",
    timestamp: Date.now() - 70000,
    donatorName: "Local Farmer",
    phone: "555-0003",
  },
];

const NGO_REQUIREMENTS = [
  {
    name: "Non-Perishable Canned Goods",
    quantity: "300 units",
    status: "High Priority",
  },
  {
    name: "New/Gently Used Children's Books",
    quantity: "50 units",
    status: "Medium Priority",
  },
  {
    name: "First Aid Supplies (Unopened)",
    quantity: "20 kits",
    status: "Medium Need",
  },
  {
    name: "Warm Winter Coats (Adult S/M/L)",
    quantity: "75 coats",
    status: "Critical Need",
  },
];

// --- Global Constants ---
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
];
const CONDITIONS = ["New", "Excellent", "Good", "Used", "Fair"];
const FOOD_TYPES = ["Produce", "Snack", "Pantry"];
const LOW_STOCK_THRESHOLD = 20;
const FOOD_STORAGE_OPTIONS = ["Pantry", "Refrigerated", "Frozen", "Cool/Dry"];

// Mock API Constants
const MOCK_IMAGGA_KEY = "acc_1611ccc4a20d56a";
const FUZZY_THRESHOLD = -2500;
const API_KEY = "AIzaSyAe7tKwBLy2MopVGm3N8SDOsRlrKQ7wSiU"; // Placeholder for Gemini API Key

// ====================================================================
// SECTION 1: UTILITY FUNCTIONS
// ====================================================================

/**
 * Helper function to return an appropriate icon component for the category.
 */
const getCategoryIcon = (category) => {
  const iconProps = { size: 60, className: "text-white drop-shadow-md" };

  switch (category) {
    case "Electronics":
      return <Zap {...iconProps} />;
    case "Clothing":
      return <Shirt {...iconProps} />;
    case "Books":
      return <Book {...iconProps} />;
    case "Home & Garden":
      return <Home {...iconProps} />;
    case "Sports":
      return <Dumbbell {...iconProps} />;
    default:
      return <Wrench {...iconProps} />;
  }
};

/**
 * Helper function to return a category-specific color class for the background.
 */
const getCategoryColor = (category) => {
  switch (category) {
    case "Electronics":
      return "bg-gray-500";
    case "Clothing":
      return "bg-red-500";
    case "Books":
      return "bg-green-500";
    case "Home & Garden":
      return "bg-amber-500";
    case "Sports":
      return "bg-cyan-500";
    default:
      return "bg-gray-500";
  }
};

/**
 * Helper function to return an appropriate icon for the food type.
 */
const getFoodIcon = (type) => {
  const iconSize = 14;
  const iconClass = "mr-1.5 text-gray-500 flex-shrink-0";

  switch (type) {
    case "Produce":
      return <Apple size={iconSize} className={iconClass} />;
    case "Snack":
      return <Cookie size={iconSize} className={iconClass} />;
    case "Pantry":
      return <Warehouse size={iconSize} className={iconClass} />;
    default:
      return <Utensils size={iconSize} className={iconClass} />;
  }
};

/**
 * Custom fuzzy matching function for duplicate checking.
 */
const checkFuzzyDuplicates = (query, inventory) => {
  let bestMatch = null;
  let highestScore = FUZZY_THRESHOLD;
  const queryLower = query.toLowerCase();

  for (const item of inventory) {
    if (item.type && item.storageLocation) continue;

    const target = item.name.toLowerCase();
    let score = 0;
    const lenDiff = Math.abs(queryLower.length - target.length);
    score -= lenDiff * 100;
    if (target.includes(queryLower) || queryLower.includes(target)) {
      score += 1500;
    } else {
      let matchCount = 0;
      for (let i = 0; i < queryLower.length; i++) {
        if (target.includes(queryLower[i])) {
          matchCount++;
        }
      }
      score += matchCount * 100;
    }
    const queryWords = queryLower.split(" ").filter((w) => w.length > 2);
    const targetWords = target.split(" ").filter((w) => w.length > 2);
    for (const qWord of queryWords) {
      if (targetWords.includes(qWord)) {
        score += 500;
      }
    }
    const finalScore = score > 0 ? -Math.max(100, 5000 - score) : -5000;
    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestMatch = item;
    }
  }

  if (highestScore > FUZZY_THRESHOLD) {
    return { item: bestMatch, score: highestScore };
  }
  return null;
};

// ====================================================================
// SECTION 2: INVENTORY CARD COMPONENTS
// ====================================================================

/**
 * ItemCard Component
 */
const ItemCard = ({ item, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] hover:brightness-105 hover:bg-gray-50 border border-gray-100 cursor-pointer"
    onClick={() => onClick(item)}
  >
    {/* Icon Slot / Image Display (Updated to prioritize imageURL) */}
    <div
      className={`w-full h-28 flex items-center justify-center rounded-md mb-3 border border-gray-100 ${
        !item.imageURL ? getCategoryColor(item.category) : "bg-gray-200"
      } overflow-hidden`}
    >
      {item.imageURL ? (
        <img
          src={item.imageURL}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        getCategoryIcon(item.category)
      )}
    </div>

    <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
      {item.name}
    </h3>
    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
      {item.description}
    </p>
    <div className="space-y-1 text-xs">
      <div className="flex items-center text-gray-600">
        <TagIcon size={12} className="mr-1 text-gray-500" />
        <span className="font-medium">{item.category}</span>
      </div>
    </div>
  </div>
);

/**
 * FoodCard Component
 */
const FoodCard = ({ food, onClick }) => {
  const availableQuantity = food.available || 0;
  const isLowStock = availableQuantity < LOW_STOCK_THRESHOLD;

  const badgeBg = isLowStock ? "bg-red-500" : "bg-gray-50";
  const badgeBorder = isLowStock ? "border-red-700" : "border-gray-200";
  const badgeText = isLowStock ? "text-white" : "text-gray-700";

  return (
    <div
      className="flex justify-between items-center text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200 shadow-sm transition duration-150 hover:shadow-md transform hover:scale-[1.01] hover:bg-gray-50 cursor-pointer"
      onClick={onClick ? () => onClick(food) : undefined}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          {getFoodIcon(food.type)}
          <span className="font-bold text-gray-800">{food.name}</span>
        </div>
        <span className="text-xs text-gray-500 mt-0.5 ml-5">{food.type}</span>
      </div>

      <div
        className={`flex items-center justify-center p-1.5 border rounded-md shadow-inner ${badgeBg} ${badgeBorder}`}
      >
        <span className={`text-xs font-extrabold ${badgeText}`}>
          {availableQuantity}
        </span>
      </div>
    </div>
  );
};

// ====================================================================
// SECTION 3: HOME VIEW AND DETAIL PAGES
// ====================================================================

/**
 * Chatbot Component
 */
const Chatbot = ({ inventory, foodItems, categories }) => {
  // Pass inventory data
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Hello! I am your Inventory AI Assistant. Ask me anything about our stock, categories, or how to donate!",
      isAnimated: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const inventoryContext = useMemo(() => {
    // Prepare a summary of the current inventory for the AI context
    const allItems = [...inventory, ...foodItems];
    if (allItems.length === 0) return "The inventory is currently empty.";

    const summary = allItems
      .slice(0, 5)
      .map(
        (item) =>
          `Item: ${item.name}, Category: ${
            item.category || item.type
          }, Condition: ${item.condition || "N/A"}`
      )
      .join("; ");

    return `Current total inventory count: ${
      allItems.length
    }. Sample items: ${summary}. Available categories: ${categories.join(
      ", "
    )}.`;
  }, [inventory, foodItems, categories]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userQuery = input.trim();
    const newMessage = { sender: "User", text: userQuery };

    // 1. Update state immediately with user message and reset input
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // 2. Add 'Typing...' message placeholder
    setMessages((prev) => [
      ...prev,
      { sender: "Bot", text: "Typing...", isTyping: true },
    ]);

    try {
      const systemPrompt = `You are an Inventory AI Assistant for a donation platform. Your goal is to be helpful, concise, and professional. Use the following context about the inventory to answer user questions, especially regarding availability, categories, or donation process: ${inventoryContext}`;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const botText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I encountered an error and cannot process your request right now.";

      // 3. Update state, removing 'Typing...' and adding the final response
      setMessages((prev) => {
        const updatedMessages = prev.slice(0, -1); // Remove the 'Typing...' message
        return [
          ...updatedMessages,
          { sender: "Bot", text: botText, isAnimated: true },
        ];
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      // 3. Update state with error message
      setMessages((prev) => {
        const updatedMessages = prev.slice(0, -1); // Remove the 'Typing...' message
        return [
          ...updatedMessages,
          {
            sender: "Bot",
            text: "Apologies, I could not connect to the AI service. Please try again later.",
            isError: true,
            isAnimated: true,
          },
        ];
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Inject CSS for the animation */}
      <style>
        {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.3s ease-out;
                }
                `}
      </style>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-2xl flex items-center justify-center transition duration-300 transform hover:scale-105"
        title={isOpen ? "Close Chat" : "Open Chat"}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gray-600 p-3 text-white font-bold flex justify-between items-center shadow-md">
            Inventory Support AI
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isTyping ? "bg-red-400" : "bg-green-400"
              }`}
            >
              {isTyping ? "Thinking..." : "Online"}
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "User" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                    msg.sender === "User"
                      ? "bg-gray-500 text-white rounded-br-none"
                      : msg.isTyping
                      ? "bg-yellow-100 text-gray-600 italic border border-yellow-300 rounded-tl-none"
                      : msg.isError
                      ? "bg-red-100 text-red-700 rounded-tl-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  } ${msg.isAnimated ? "animate-fadeInUp" : ""}`}
                >
                  {msg.isTyping ? (
                    <div className="flex items-center space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {/* Scroll to bottom placeholder */}
            <div
              ref={(el) => {
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isTyping && handleSend()
                }
                placeholder={
                  isTyping
                    ? "AI is thinking..."
                    : "Ask about inventory or donation..."
                }
                className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-gray-500 focus:border-gray-500 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition duration-150 ${
                  isTyping
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
                title="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Item Detail Page Component (For General Products)
 */
const ItemDetailPage = ({ item, setCurrentPage }) => {
  const handleMapClick = () => {
    if (item.donatorLocation) {
      const mapQuery = encodeURIComponent(
        item.donatorLocation + " " + item.donatorAddress
      );
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
        "_blank"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Inventory"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Item Details
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Image/Icon (Updated to display imageURL) */}
          <div
            className={`w-full md:w-1/3 h-56 flex items-center justify-center rounded-lg border border-gray-200 ${
              !item.imageURL ? getCategoryColor(item.category) : "bg-gray-200"
            } shadow-lg flex-shrink-0 overflow-hidden`}
          >
            {item.imageURL ? (
              <img
                src={item.imageURL}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              getCategoryIcon(item.category)
            )}
          </div>

          {/* Right: Details */}
          <div className="md:w-2/3">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">{item.description}</p>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              {/* General Item Details */}
              <div className="flex items-center text-gray-700">
                <TagIcon size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">Category:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.category}
                </span>
              </div>

              <div className="text-gray-700">
                <span className="font-bold block mb-1">
                  Specifications/Notes:
                </span>
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  {item.details}
                </p>
              </div>

              {/* --- DONATOR DETAILS SECTION --- */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-xl font-bold text-gray-700">
                  Donator Information
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span className="font-bold w-24">Donator:</span>
                    <span>{item.donatorName || "N/A"}</span>
                  </div>
                  {/* Phone Number Display */}
                  <div className="flex items-center text-gray-700">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span className="font-bold w-24">Phone:</span>
                    <span>{item.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <MapPin
                      size={16}
                      className="mr-2 mt-1 text-gray-500 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">Address:</span>
                      <span>{item.donatorAddress || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe size={16} className="mr-2 text-gray-500" />
                    <span className="font-bold w-24">Location:</span>
                    <span>{item.donatorLocation || "N/A"}</span>
                  </div>
                </div>

                {/* Map Button */}
                {item.donatorLocation && (
                  <button
                    onClick={handleMapClick}
                    className="mt-3 flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
                  >
                    <MapPin size={16} className="mr-2" />
                    View on Map
                  </button>
                )}
              </div>
              {/* --- END DONATOR DETAILS SECTION --- */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Food Item Detail Page Component (For Food Products)
 */
const FoodItemDetailPage = ({ item, setCurrentPage }) => {
  // Convert expiryDate string to locale string
  const expiryDate = item.expiryDate
    ? new Date(item.expiryDate).toLocaleDateString()
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Inventory"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Food Item Details
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Icon/Placeholder */}
          <div
            className={`w-full md:w-1/3 h-56 flex items-center justify-center rounded-lg border border-gray-200 bg-green-500 shadow-lg flex-shrink-0`}
          >
            <Utensils size={60} className="text-white drop-shadow-md" />
          </div>

          {/* Right: Details */}
          <div className="md:w-2/3">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">{item.details}</p>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              {/* Food Specific Details: Type */}
              <div className="flex items-center text-gray-700">
                <TagIcon size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">Type:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.type}
                </span>
              </div>

              {/* Food Specific Details: General Storage Location */}
              <div className="flex items-center text-gray-700">
                <Warehouse size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">General Storage:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.storageLocation}
                </span>
              </div>

              {/* Food Specific Details: Specific Location (New Field) */}
              <div className="flex items-center text-gray-700">
                <MapPin size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">Specific Location:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.specificLocation || "N/A"}
                </span>
              </div>

              {/* Food Specific Details: Expiry Date */}
              <div className="flex items-center text-gray-700">
                <Clock size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">Expiry Date:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {expiryDate}
                </span>
              </div>

              {/* Food Specific Details: Quantity */}
              <div className="flex items-center text-gray-700">
                <Plus size={20} className="mr-2 text-gray-500" />
                <span className="font-bold">Quantity:</span>
                <span className="ml-2 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.quantity} units
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- New Component for Money Donation ---

const MoneyDonationPage = ({ setCurrentPage }) => {
  const [amount, setAmount] = useState(25);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Mock payment processing
    console.log(`Processing mock payment of $${amount} from ${name}...`);
    setMessage(
      `Thank you, ${name}! Your donation of $${amount} has been successfully processed (Mock).`
    );

    setTimeout(() => {
      setCurrentPage("home");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Money Donation
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        <div className="flex flex-col items-center mb-6">
          <DollarSign size={48} className="text-green-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Support Our Mission
          </h2>
          <p className="text-sm text-gray-600 text-center mt-1">
            Your financial gift helps cover operational costs and critical
            needs.
          </p>
        </div>

        {message && (
          <div
            className="px-4 py-3 rounded relative mb-4 border bg-green-100 border-green-400 text-green-700"
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Donation Amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 25, 50, 100, 250, "Other"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val === "Other" ? "" : val)}
                  className={`p-3 rounded-lg font-semibold transition duration-150 border-2 ${
                    (val === amount && val !== "Other") ||
                    (val === "Other" && typeof amount !== "number")
                      ? "bg-green-600 text-white border-green-700 shadow-lg"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {val === "Other" ? "Other" : `$${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          {typeof amount !== "number" && (
            <div>
              <label
                htmlFor="customAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom Amount ($)
              </label>
              <input
                type="number"
                id="customAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                placeholder="Enter amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
          )}

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || amount <= 0}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 ${
              !amount || amount <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            }`}
          >
            <Heart size={20} className="mr-2" />
            Donate ${amount} Now
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Review Donation Page Component
 * Displays item and donator details before final NGO acceptance.
 */
const ReviewDonationPage = ({ item, setCurrentPage }) => {
  if (!item) {
    setCurrentPage("ngoDonation");
    return null;
  }

  const isFood = item.type && item.storageLocation;

  const handleConfirmAcceptance = () => {
    // Mock final acceptance logic
    alert(
      `NGO Confirmed Acceptance of: ${item.name} from ${item.donatorName}. (Action mocked)`
    );
    setCurrentPage("ngoDonation");
  };

  const ItemSpecificDetails = () => {
    if (isFood) {
      const expiryDate = item.expiryDate
        ? new Date(item.expiryDate).toLocaleDateString()
        : "N/A";
      return (
        <>
          <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mt-4 flex items-center">
            <Utensils size={20} className="mr-2" /> Food Specifications
          </h3>
          <DetailRow label="Food Type" value={item.type} icon={TagIcon} />
          <DetailRow
            label="General Storage"
            value={item.storageLocation}
            icon={Warehouse}
          />
          <DetailRow
            label="Specific Location"
            value={item.specificLocation || "N/A"}
            icon={MapPin}
          />
          <DetailRow label="Expiry Date" value={expiryDate} icon={Clock} />
          <DetailRow
            label="Quantity"
            value={`${item.quantity} units`}
            icon={Plus}
          />
        </>
      );
    } else {
      return (
        <>
          <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mt-4 flex items-center">
            <Wrench size={20} className="mr-2" /> Product Details
          </h3>
          <DetailRow label="Category" value={item.category} icon={TagIcon} />
          <DetailRow
            label="Condition"
            value={item.condition}
            icon={CheckCircle}
          />
          <DetailRow label="Notes" value={item.details || "N/A"} icon={Info} />
        </>
      );
    }
  };

  const DetailRow = ({ label, value, icon: _Icon }) => (
    <div className="flex items-start text-gray-700 mt-2">
      <Icon size={16} className="mr-3 mt-1 text-gray-500 flex-shrink-0" />
      <div className="flex-grow">
        <span className="font-semibold block">{label}:</span>
        <span className="text-gray-600">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("ngoDonation")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Donation Hub"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Review Donation
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-600 content-panel space-y-6">
        <div className="flex justify-between items-start border-b pb-4">
          <h2 className="text-4xl font-extrabold text-gray-800">{item.name}</h2>
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              isFood ? "bg-green-500" : getCategoryColor(item.category)
            } shadow-lg`}
          >
            {isFood ? (
              <Utensils size={30} className="text-white" />
            ) : (
              getCategoryIcon(item.category)
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Donator Details */}
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 flex items-center">
              <User size={20} className="mr-2" /> Donator Details
            </h3>
            <DetailRow
              label="Name"
              value={item.donatorName || "N/A"}
              icon={User}
            />
            <DetailRow label="Phone" value={item.phone || "N/A"} icon={Phone} />
            <DetailRow
              label="Location"
              value={item.donatorLocation || "N/A"}
              icon={Globe}
            />
            <DetailRow
              label="Address"
              value={item.donatorAddress || "N/A"}
              icon={MapPin}
            />
            <p className="text-xs text-gray-500 pt-2">
              Contact donator using provided details if needed.
            </p>
          </div>

          {/* Column 2: Item Details */}
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 flex items-center">
              <Info size={20} className="mr-2" /> General Description
            </h3>
            <p className="text-gray-600 italic">
              "{item.description || "No short description provided."}"
            </p>

            {ItemSpecificDetails()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => setCurrentPage("ngoDonation")}
            className="flex items-center py-3 px-6 rounded-lg shadow-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition duration-150"
          >
            <X size={20} className="mr-2" />
            Cancel / Return to Hub
          </button>
          <button
            onClick={handleConfirmAcceptance}
            className="flex items-center py-3 px-6 rounded-lg shadow-md font-medium text-white bg-green-600 hover:bg-green-700 transition duration-150 transform hover:scale-[1.01]"
          >
            <CheckCircle size={20} className="mr-2" />
            Confirm Acceptance
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Home View Component
 */
const HomeView = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filteredItems,
  loading,
  setCurrentPage,
  setSelectedItem,
  isLoggedIn,
  currentUser,
  foodItems, // Pass foodItems separately for the sidebar
}) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle clicking an ItemCard (Product)
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentPage("detail");
  };

  // Function to handle clicking a FoodCard
  const handleFoodClick = (food) => {
    setSelectedItem(food);
    setCurrentPage("detail");
  };

  // Handler to navigate to the Add Food Item page
  const handleAddFoodClick = () => {
    if (isLoggedIn && currentUser.userType === "individual") {
      setCurrentPage("addFood");
    } else if (isLoggedIn && currentUser.userType === "ngo") {
      // NGO users cannot submit items directly, they go to the NGO Hub
      setCurrentPage("ngoDonation");
    } else {
      // Non-logged-in users must log in first
      setCurrentPage("selectLogin");
    }
  };

  const handleDonateClick = () => {
    if (isLoggedIn) {
      // Check if logged in user is an NGO (Mock)
      if (currentUser.userType === "ngo") {
        setCurrentPage("ngoDonation"); // Navigate to NGO-specific view (Acceptance Hub)
      } else {
        setCurrentPage("add"); // Navigate to Individual Donator form
      }
    } else {
      setCurrentPage("selectLogin");
    }
  };

  return (
    <>
      {/* Top Bar for Header and Add Item Button */}
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Home
        </h1>

        <div className="flex items-center space-x-3">
          {/* Money Donation Button */}
          <button
            onClick={() => setCurrentPage("donateMoney")}
            className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 transform hover:scale-105"
          >
            <DollarSign size={20} className="mr-2" />
            Donate Money
          </button>

          {/* User Profile / Login Button */}
          {isLoggedIn ? (
            <>
              <div className="bg-gray-100 px-3 py-1 text-sm rounded-full text-gray-600 border border-gray-300">
                User:{" "}
                <span className="font-mono font-semibold capitalize">
                  {currentUser?.userType || "N/A"}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage("profile")}
                className="flex items-center justify-center p-2 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-50 transition duration-150"
                title="My Profile"
              >
                <img
                  src={currentUser?.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              <button
                onClick={handleDonateClick}
                className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 transform hover:scale-105"
              >
                <Heart size={20} className="mr-2" />
                Donate Item
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentPage("selectLogin")}
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 transform hover:scale-105"
            >
              <LogIn size={20} className="mr-2" />
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Layout: TWO-COLUMN Layout on large screens */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Column 1 (Left): Search, Category Filter, AND FOOD ITEMS */}
        <div className="lg:w-1/3 w-full space-y-6 h-fit lg:sticky top-6">
          {/* 1. Search Box and Category Filter Panel */}
          <div className="p-5 bg-white/90 rounded-xl shadow-xl border-t-4 border-gray-500 content-panel">
            {/* Search & Filter Title with Background */}
            <h2 className="xl font-bold text-gray-800 mb-5 p-2 bg-gray-100 flex items-center">
              <Search className="mr-2 text-gray-500" size={20} />
              Search & Filter
            </h2>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by name, category, or keyword..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 text-sm text-gray-700"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* Filter by Category Title with Background */}
              <h3 className="text-base font-bold text-gray-800 mb-3 p-1 bg-gray-100 rounded-md flex items-center">
                <TagIcon size={16} className="mr-2 text-gray-500" />
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition duration-150 ${
                        selectedCategory === cat
                          ? "bg-gray-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 hover:scale-[1.03] transform"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition duration-150 ${
                    selectedCategory === "All"
                      ? "bg-gray-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 hover:scale-[1.03] transform"
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* 2. Available Food Items Window (UPDATED) */}
          <div className="p-5 bg-white/90 rounded-xl shadow-xl border-t-4 border-gray-500 content-panel">
            <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded-lg">
              <h3 className="xl font-bold text-gray-800 flex items-center">
                <Utensils size={20} className="mr-2 text-gray-500" />
                Available Food Items
              </h3>
              {/* Only show Add Food button if logged in as Individual (Donator) */}
              {isLoggedIn && currentUser?.userType === "individual" && (
                <button
                  onClick={handleAddFoodClick}
                  className="flex items-center text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full transition duration-150 shadow-md"
                  title="Add a New Food Donation"
                >
                  <Plus size={14} className="mr-1" />
                  Add Food
                </button>
              )}
            </div>

            {foodItems.length > 0 ? (
              <div className="space-y-3">
                {foodItems.map((food, index) => (
                  <FoodCard
                    key={food.id || index}
                    food={food}
                    onClick={handleFoodClick}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No food items available in inventory.
              </p>
            )}
          </div>
        </div>

        {/* Column 2 (Right): Main Item Window (Products) */}
        <div className="lg:w-2/3 w-full p-5 bg-white/90 rounded-xl shadow-xl border-t-4 border-gray-500 content-panel">
          {/* Combined Heading with Category and Count */}
          <div className="flex justify-between items-baseline mb-5 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Available Items</h2>
            <div className="text-right">
              <span className="text-lg font-extrabold text-gray-600">
                {filteredItems.length}
              </span>
              <span className="text-gray-500 ml-1 text-sm">item(s) found</span>
              <p className="text-xs text-gray-500 mt-1">
                Showing results for:{" "}
                <span className="font-semibold text-gray-600">
                  {selectedCategory}
                </span>
              </p>
            </div>
          </div>

          {/* Loading/Status Indicators */}
          {loading && (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg mb-4">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600 font-medium text-sm">
                Searching inventory...
              </span>
            </div>
          )}

          {/* Results Grid */}
          {!loading && (
            <>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map(
                    (item) =>
                      // Ensure only non-food items are displayed in the main grid
                      !(item.type && item.storageLocation) && (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onClick={handleItemClick}
                        />
                      )
                  )}
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Search size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-lg font-semibold text-gray-700">
                    No items match your criteria.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting the search term or category filter.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ====================================================================
// SECTION 4: AUTHENTICATION COMPONENTS
// ====================================================================

/**
 * Select Login Type Page
 */
const SelectLoginPage = ({ setCurrentPage }) => {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 content-panel">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Login
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        <p className="text-center text-lg font-semibold text-gray-700">
          How would you like to access the donation system?
        </p>

        <div className="space-y-4">
          {/* Donator Login Option */}
          <button
            onClick={() => setCurrentPage("donatorLogin")}
            className="w-full py-4 px-4 rounded-lg shadow-md font-bold text-lg transition duration-150 bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center"
          >
            <User size={24} className="mr-3" /> Individual Donator
          </button>

          {/* NGO Login Option */}
          <button
            onClick={() => setCurrentPage("ngoLogin")}
            className="w-full py-4 px-4 rounded-lg shadow-md font-bold text-lg transition duration-150 border-2 border-gray-600 bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center"
          >
            <Building size={24} className="mr-3" /> NGO / Organization
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Dedicated Donator Login Page
 */
const DonatorLoginPage = ({ setCurrentPage, setLoggedIn, setCurrentUser }) => {
  const userType = "individual";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // NEW FIELD
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleVerify = async () => {
    if (!name || !email || !address || !location || !phone) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setIsPending(true);
    setMessage(`Verifying ID and address...`);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsPending(false);
    setIsIdVerified(true);
    setMessage("Verification successful! You can now access the form.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isIdVerified) {
      setMessage("Please verify your details before proceeding.");
      return;
    }

    // Mock login data for authenticated user context
    const user = {
      name,
      email,
      phone,
      address,
      location,
      userType, // Added phone
      profilePicture:
        "https://placehold.co/100x100/4B5563/FFF?text=" +
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
      uid: "mock_donator_uid", // Local Mock ID
    };
    setCurrentUser(user);
    setLoggedIn(true);
    setCurrentPage("add"); // Direct to donation form
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 content-panel">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("selectLogin")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Login Select"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Individual Donator Login
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500">
        {message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 border ${
              isIdVerified
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Individual Specific Fields */}
          <div>
            <label
              htmlFor="loginName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="loginName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          {/* New Phone Field */}
          <div>
            <label
              htmlFor="loginPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="loginPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="555-123-4567"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="loginAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="123 Main St"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City / State
            </label>
            <input
              type="text"
              id="loginLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Austin, TX"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>

          {/* Verification Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isPending || isIdVerified}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-150 ${
              isIdVerified
                ? "bg-green-600"
                : isPending
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            }`}
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying Details...
              </>
            ) : isIdVerified ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Details Verified
              </>
            ) : (
              <>
                <User size={16} className="mr-2" />
                Verify ID & Proceed
              </>
            )}
          </button>

          {/* Login Button (Submit) */}
          <button
            type="submit"
            disabled={!isIdVerified}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 ${
              !isIdVerified
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            }`}
          >
            Access Donation Form
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Dedicated NGO Login Page
 */
const NgoLoginPage = ({ setCurrentPage, setLoggedIn, setCurrentUser }) => {
  const userType = "ngo";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // NEW FIELD
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [registrationId, setRegistrationId] = useState(""); // NGO specific field
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleVerify = async () => {
    if (!name || !email || !phone || !address || !location || !registrationId) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setIsPending(true);
    setMessage(`Verifying NGO details and registration ID...`);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsPending(false);
    setIsIdVerified(true);
    setMessage("Verification successful! You can now access the hub.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isIdVerified) {
      setMessage("Please verify your details before proceeding.");
      return;
    }

    // Mock login data for authenticated user context
    const user = {
      name,
      email,
      phone,
      address,
      location,
      userType,
      registrationId, // Added phone
      profilePicture:
        "https://placehold.co/100x100/4B5563/FFF?text=" +
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
      uid: "mock_ngo_uid", // Local Mock ID
    };
    setCurrentUser(user);
    setLoggedIn(true);
    setCurrentPage("ngoDonation"); // Direct to NGO Donation View/Hub
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 content-panel">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("selectLogin")} // Back to selection page
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Login Select"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          NGO Login
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500">
        {message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 border ${
              isIdVerified
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* NGO Specific Fields */}
          <div>
            <label
              htmlFor="loginName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="loginName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Example Foundation"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="registrationId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Registration/Tax ID
            </label>
            <input
              type="text"
              id="registrationId"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              required
              placeholder="e.g., 501(c)(3) number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contact@ngo.org"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          {/* New Phone Field */}
          <div>
            <label
              htmlFor="loginPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="loginPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="555-123-4567"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Office Address
            </label>
            <input
              type="text"
              id="loginAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="456 Corporate Ave"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="loginLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City / State
            </label>
            <input
              type="text"
              id="loginLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Houston, TX"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>

          {/* Verification Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isPending || isIdVerified}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-150 ${
              isIdVerified
                ? "bg-green-600"
                : isPending
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            }`}
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying Details...
              </>
            ) : isIdVerified ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                Details Verified
              </>
            ) : (
              <>
                <Building size={16} className="mr-2" />
                Verify NGO Status
              </>
            )}
          </button>

          {/* Login Button (Submit) */}
          <button
            type="submit"
            disabled={!isIdVerified}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 ${
              !isIdVerified
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            }`}
          >
            Access Hub
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Donator Profile Page Component
 */
const DonatorProfilePage = ({
  currentUser,
  setCurrentPage,
  setLoggedIn,
  setCurrentUser,
}) => {
  if (!currentUser) {
    setCurrentPage("home");
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
    setCurrentPage("home");
  };

  // Mock profile picture URL (using initials)
  const initials =
    currentUser.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      ?.toUpperCase() || "AN"; // Safely handle null/undefined name
  const profilePicUrl = `https://placehold.co/150x150/4B5563/FFFFFF?text=${initials}`;

  // Helper for profile details based on user type
  const nameLabel =
    currentUser.userType === "individual"
      ? "Donator Name"
      : "Organization Name";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          My Profile
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center border-b border-gray-200 pb-6">
          <img
            src={profilePicUrl}
            alt="Profile Picture"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 shadow-xl"
          />
          <h2 className="text-4xl font-bold text-gray-800 mt-4">
            {currentUser.name || "Anonymous Donator"}
          </h2>
          <p className="text-gray-500">{currentUser.email || "N/A"}</p>

          {/* Mock Profile Picture Uploader */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <Image size={16} className="text-gray-500" />
            <span>Upload/Change Picture (Mock)</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3 flex items-center">
              <User size={20} className="mr-2 text-gray-500" /> Personal Details
            </h3>
            <div className="text-gray-700">
              <span className="font-semibold block">{nameLabel}:</span>
              <span className="text-gray-600">{currentUser.name || "N/A"}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">User ID:</span>
              <span className="text-gray-600 font-mono">
                {currentUser.uid || "N/A"}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">User Type:</span>
              <span className="text-gray-600 capitalize">
                {currentUser.userType || "N/A"}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Email:</span>
              <span className="text-gray-600">
                {currentUser.email || "N/A"}
              </span>
            </div>
            {/* Phone Number Display */}
            <div className="text-gray-700">
              <span className="font-semibold block">Phone:</span>
              <span className="text-gray-600">
                {currentUser.phone || "N/A"}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Verification Status:</span>
              <span className="text-green-600 font-bold flex items-center">
                <CheckCircle size={16} className="mr-1" /> Verified Donator
              </span>
            </div>
            {currentUser.registrationId && (
              <div className="text-gray-700">
                <span className="font-semibold block">Registration ID:</span>
                <span className="text-gray-600">
                  {currentUser.registrationId}
                </span>
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3 flex items-center">
              <MapPin size={20} className="mr-2 text-gray-500" /> Contact &
              Location
            </h3>
            <div className="text-gray-700">
              <span className="font-semibold block">Address:</span>
              <span className="text-gray-600">
                {currentUser.address || "N/A"}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Location:</span>
              <span className="text-gray-600">
                {currentUser.location || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => console.log("Simulating Edit Profile...")}
            className="flex items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
          >
            <Settings size={18} className="mr-2" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// SECTION 5: DONATION FORMS
// ====================================================================

/**
 * NEW: NGO Donation Acceptance/Requirements View
 * This view is shown to logged-in NGO users when they click "Donate Item".
 */
const NgoDonationView = ({
  setCurrentPage,
  inventory,
  foodItems,
  setSelectedItem,
}) => {
  // Combine all available inventory for review
  const allAvailableItems = [...inventory, ...foodItems].sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );

  // Handler to initiate the review process
  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setCurrentPage("reviewDonation");
  };

  // Handler for NGO accepting a pending donation (mock action, now only called from ReviewPage)
  const _handleAcceptDonation = (itemId, itemName) => {
    console.log(`NGO Accepted Donation: ${itemName} (ID: ${itemId})`);
    alert(`Successfully reviewed and accepted the donation: ${itemName}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical Need":
        return "bg-red-500 text-white";
      case "High Priority":
        return "bg-orange-500 text-white";
      case "Medium Priority":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          NGO Donation Hub
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: NGO REQUIREMENTS LIST */}
        <div className="lg:col-span-1 p-6 bg-white/90 rounded-xl shadow-2xl border-t-4 border-red-500 content-panel space-y-4">
          <h2 className="text-2xl font-bold text-red-700 flex items-center border-b pb-3 mb-4">
            <ListChecks size={24} className="mr-3" />
            Our Critical Requirements
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            This list guides **Donators** on our most urgent needs right now.
          </p>

          <div className="space-y-3">
            {NGO_REQUIREMENTS.map((req, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg bg-red-50 hover:bg-red-100 transition duration-150"
              >
                <p className="font-semibold text-gray-800">{req.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">
                    Quantity Needed: {req.quantity}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: PENDING DONATIONS LIST */}
        <div className="lg:col-span-2 p-6 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel space-y-4">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center border-b pb-3 mb-4">
            <ClipboardList size={24} className="mr-3" />
            Available Donations to Accept ({allAvailableItems.length})
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Review items submitted by **Donators**. Click "**Review**" to
            confirm receipt.
          </p>

          {allAvailableItems.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <Info size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-semibold text-gray-700">
                No Pending Donations.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                All inventory has been processed or none have been submitted
                yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allAvailableItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        item.type ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {item.type
                        ? getFoodIcon(item.type)
                        : getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        **Donator**: {item.donatorName} &bull; Type:{" "}
                        {item.category || item.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setCurrentPage("detail");
                      }}
                      className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleReviewClick(item)} // UPDATED to go to Review Page
                      className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-150 flex items-center"
                    >
                      Review <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Add Item Page Component (General Products)
 * This is the primary donation form for Individual Donators.
 */
const AddItemPage = ({
  setCurrentPage,
  handleAddItem,
  inventory,
  currentUser,
}) => {
  // Auto-fill donator details if the user is logged in
  const initialDonatorDetails = {
    donatorName: currentUser?.name || "",
    donatorAddress: currentUser?.address || "",
    donatorLocation: currentUser?.location || "",
    phone: currentUser?.phone || "", // NEW FIELD
  };

  const [newItem, setNewItem] = useState({
    name: "",
    category: categories[1],
    condition: CONDITIONS[0],
    description: "",
    details: "",
    picture: null,
    imageURL: "", // NEW FIELD for permanent image link
    ...initialDonatorDetails,
  });

  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      const file = files[0];
      setNewItem((prev) => ({ ...prev, [name]: file }));
      setVerificationStatus("idle");
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewItem((prev) => ({ ...prev, category: selectedCategory }));
  };

  /**
   * Mocks the Imagga API call for picture verification.
   */
  const verifyPicture = async () => {
    if (!newItem.picture) {
      setMessage("Please upload a file before attempting verification.");
      return;
    }

    setVerificationStatus("pending");
    setMessage("Verifying image quality and content via Imagga...");

    console.log(`Simulating API call to Imagga with key: ${MOCK_IMAGGA_KEY}`);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (newItem.picture && newItem.picture.name.includes("test_fail")) {
      setVerificationStatus("error");
      setMessage(
        "Verification failed. Image quality is too low or content is inappropriate."
      );
    } else {
      // Mock image URL generation based on category (to simulate upload)
      const mockImageURL = `https://placehold.co/400x200/${getCategoryColor(
        newItem.category
      ).replace("bg-", "")}/FFFFFF?text=${newItem.name.replace(/ /g, "+")}`;
      setNewItem((prev) => ({ ...prev, imageURL: mockImageURL }));
      setVerificationStatus("success");
      setMessage("Image successfully verified and approved.");
    }
  };

  const finalizeSubmission = async () => {
    const itemToAdd = {
      id: "p" + Date.now(), // Mock ID
      name: newItem.name,
      category: newItem.category,
      condition: newItem.condition,
      description: newItem.description || "No description provided.",
      details: newItem.details || "No additional details provided.",
      donatorName: newItem.donatorName,
      donatorAddress: newItem.donatorAddress,
      donatorLocation: newItem.donatorLocation,
      phone: newItem.phone, // ADDED PHONE
      imageURL: newItem.imageURL, // ADDED IMAGE URL
      timestamp: Date.now(),
    };

    try {
      await handleAddItem(itemToAdd); // Adds to local state
      setMessage(
        `Item "${newItem.name}" submitted successfully and added to inventory!`
      );
    } catch (error) {
      setMessage(`Error saving item: ${error.message}`);
      return;
    }

    setDuplicateAlert(null);

    setTimeout(() => {
      setCurrentPage("home");
      setMessage("");
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (verificationStatus !== "success") {
      setMessage("Error: Please verify the item picture before submission.");
      return;
    }

    // 1. FUZZY DUPLICATE CHECK (only against non-food items)
    const nonFoodInventory = inventory.filter(
      (i) => !(i.type && i.storageLocation)
    );
    const duplicateResult = checkFuzzyDuplicates(
      newItem.name,
      nonFoodInventory
    );

    if (duplicateResult) {
      setDuplicateAlert(duplicateResult.item);
      setMessage(
        "Warning: A similar item was found in the inventory. Please confirm submission."
      );
      return;
    }

    // 2. No duplicate found, proceed with final submission
    finalizeSubmission();
  };

  const productCategories = categories.filter((c) => c !== "All");

  // Determine button text and styling based on verification status
  const isPending = verificationStatus === "pending";
  const isSuccess = verificationStatus === "success";
  const isError = verificationStatus === "error";

  // Button content and classes
  let buttonContent;
  let buttonClasses;

  if (isPending) {
    buttonContent = (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Verifying...
      </>
    );
    buttonClasses = "bg-gray-500 text-white cursor-not-allowed";
  } else if (isSuccess) {
    buttonContent = (
      <>
        <CheckCircle size={14} className="mr-1" />
        Verified
      </>
    );
    buttonClasses = "bg-green-500 text-white hover:bg-green-600";
  } else if (isError) {
    buttonContent = (
      <>
        <AlertTriangle size={14} className="mr-1" />
        Failed (Retry)
      </>
    );
    buttonClasses = "bg-red-500 text-white hover:bg-red-600";
  } else {
    buttonContent = (
      <>
        <Wrench size={14} className="mr-1" />
        Verify Picture
      </>
    );
    buttonClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* --- DUPLICATE ALERT MODAL --- */}
      {duplicateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle size={24} className="mr-3" />
              <h3 className="text-xl font-bold">
                Potential Duplicate Item Detected!
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              The item you are attempting to submit ("
              <span className="font-semibold">{newItem.name}</span>") is highly
              similar to an existing item:
            </p>

            <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
              <p className="font-bold text-red-800">{duplicateAlert.name}</p>
              <p className="text-sm text-red-700">
                {duplicateAlert.description}
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to proceed with adding this new entry?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDuplicateAlert(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={finalizeSubmission}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END DUPLICATE ALERT MODAL --- */}

      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Submit Donation (Donator)
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        {/* Global Message Alert */}
        {message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 border ${
              isError
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Donator Details Section --- */}
          <h2 className="text-xl font-bold text-gray-700 pt-4 border-t border-gray-200">
            Donator Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donator Name */}
            <div>
              <label
                htmlFor="donatorName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donator Name
              </label>
              <input
                type="text"
                name="donatorName"
                id="donatorName"
                value={newItem.donatorName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {/* Donator Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={newItem.phone}
                onChange={handleChange}
                required
                placeholder="555-123-4567"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donator Address */}
            <div>
              <label
                htmlFor="donatorAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                type="text"
                name="donatorAddress"
                id="donatorAddress"
                value={newItem.donatorAddress}
                onChange={handleChange}
                required
                placeholder="Street address, Apt, etc."
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {/* Donator Location (City/State) */}
            <div>
              <label
                htmlFor="donatorLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City / State
              </label>
              <input
                type="text"
                name="donatorLocation"
                id="donatorLocation"
                value={newItem.donatorLocation}
                onChange={handleChange}
                required
                placeholder="City, State/Province"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
          {/* --- End Donator Details Section --- */}

          {/* --- Item Details Section --- */}
          <h2 className="text-xl font-bold text-gray-700 pt-4 border-t border-gray-200">
            Item Details
          </h2>

          {/* Item Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newItem.name}
              onChange={handleChange}
              required
              placeholder="e.g., Wireless Headset"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          {/* Item Description (New Field) */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Short Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={newItem.description}
              onChange={handleChange}
              required
              placeholder="Briefly describe the item (e.g., used once, new condition)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          {/* Item Details (New Field) */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Details/Specs (Optional)
            </label>
            <textarea
              name="details"
              id="details"
              value={newItem.details}
              onChange={handleChange}
              placeholder="Add specific details like size, color, condition notes, etc."
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Category
              </label>
              <select
                name="category"
                id="category"
                value={newItem.category}
                onChange={handleCategoryChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 transition duration-150"
              >
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Selection */}
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Item Condition
              </label>
              <select
                name="condition"
                id="condition"
                value={newItem.condition}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 transition duration-150"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Picture Upload (with Verification) */}
          <div>
            <label
              htmlFor="picture"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Picture (Optional)
            </label>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-500 transition duration-150 relative">
              {/* Verification Button inside the dashed box */}
              <button
                type="button"
                onClick={verifyPicture}
                disabled={isPending || !newItem.picture}
                className={`absolute bottom-3 right-3 z-10 flex items-center text-xs font-semibold px-3 py-1 rounded-full transition duration-150 ${buttonClasses} ${
                  isPending || !newItem.picture ? "opacity-70" : ""
                }`}
              >
                {buttonContent}
              </button>
              {/* End Verification Button */}

              <div className="space-y-1 text-center relative z-0">
                {/* Display preview if imageURL is mocked/available */}
                {newItem.imageURL && isSuccess ? (
                  <img
                    src={newItem.imageURL}
                    alt="Item Preview"
                    className="mx-auto h-12 w-auto object-contain rounded-md"
                  />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m30-10V12a4 4 0 00-4-4H20L4 32h16l4 8 16-24z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="picture"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {newItem.picture && (
              <p className="text-sm text-green-600 mt-2">
                File selected: {newItem.picture.name}
              </p>
            )}
          </div>
          {/* END Picture Upload */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verificationStatus !== "success"}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 ${
              verificationStatus !== "success"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            }`}
          >
            <Heart size={20} className="mr-2" />
            Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Add Food Item Page Component
 */
const AddFoodItemPage = ({ setCurrentPage, handleAddItem, currentUser }) => {
  // Auto-fill donator details if the user is logged in
  const initialDonatorDetails = {
    donatorName: currentUser?.name || "",
    donatorAddress: currentUser?.address || "",
    donatorLocation: currentUser?.location || "",
    phone: currentUser?.phone || "", // NEW FIELD
  };

  const [newFoodItem, setNewFoodItem] = useState({
    name: "",
    type: FOOD_TYPES[0],
    quantity: 1,
    expiryDate: "",
    storageLocation: FOOD_STORAGE_OPTIONS[0],
    specificLocation: "",
    details: "",
    ...initialDonatorDetails,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFoodItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const itemToAdd = {
      id: "f" + Date.now(), // Mock Food ID
      name: newFoodItem.name,
      type: newFoodItem.type,
      quantity: parseInt(newFoodItem.quantity, 10),
      expiryDate: newFoodItem.expiryDate,
      storageLocation: newFoodItem.storageLocation,
      specificLocation: newFoodItem.specificLocation,
      details: newFoodItem.details || "No details provided.",
      donatorName: newFoodItem.donatorName,
      donatorAddress: newFoodItem.donatorAddress,
      donatorLocation: newFoodItem.donatorLocation,
      phone: newFoodItem.phone, // ADDED PHONE
      timestamp: Date.now(),
      available: parseInt(newFoodItem.quantity, 10), // Mock available count
    };

    try {
      await handleAddItem(itemToAdd);
      setMessage(`Food item "${newFoodItem.name}" submitted successfully!`);
    } catch (error) {
      setMessage(`Error saving food item: ${error.message}`);
      return;
    }

    setTimeout(() => {
      setCurrentPage("home");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        {/* Back Button Icon Only */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150 p-2 rounded-full hover:bg-gray-100"
          title="Back to Home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Donate Food Item (Donator)
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        {message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 border bg-green-100 border-green-400 text-green-700`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donator Details Section */}
          <h2 className="text-xl font-bold text-gray-700 pt-4 border-t border-gray-200">
            Donator Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donator Name */}
            <div>
              <label
                htmlFor="donatorName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donator Name
              </label>
              <input
                type="text"
                name="donatorName"
                id="donatorName"
                value={newFoodItem.donatorName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {/* Donator Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={newFoodItem.phone}
                onChange={handleChange}
                required
                placeholder="555-123-4567"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donator Address */}
            <div>
              <label
                htmlFor="donatorAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                type="text"
                name="donatorAddress"
                id="donatorAddress"
                value={newFoodItem.donatorAddress}
                onChange={handleChange}
                required
                placeholder="Street address, Apt, etc."
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {/* Donator Location */}
            <div>
              <label
                htmlFor="donatorLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City / State
              </label>
              <input
                type="text"
                name="donatorLocation"
                id="donatorLocation"
                value={newFoodItem.donatorLocation}
                onChange={handleChange}
                required
                placeholder="City, State/Province"
                readOnly={currentUser}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Food Details Section */}
          <h2 className="text-xl font-bold text-gray-700 pt-4 border-t border-gray-200">
            Food Item Details
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Food Item Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newFoodItem.name}
              onChange={handleChange}
              required
              placeholder="e.g., Canned Black Beans"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Food Type
              </label>
              <select
                name="type"
                id="type"
                value={newFoodItem.type}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 transition duration-150"
              >
                {FOOD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity (Units)
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={newFoodItem.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 12"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
              />
            </div>
            {/* Expiry Date */}
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                id="expiryDate"
                value={newFoodItem.expiryDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 transition duration-150"
              />
            </div>
          </div>

          {/* Storage Location (General Type) */}
          <div>
            <label
              htmlFor="storageLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              General Storage Type
            </label>
            <select
              name="storageLocation"
              id="storageLocation"
              value={newFoodItem.storageLocation}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            >
              {FOOD_STORAGE_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Location (NEW FIELD) */}
          <div>
            <label
              htmlFor="specificLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Specific Location (e.g., Shelf/Aisle/Fridge)
            </label>
            <input
              type="text"
              name="specificLocation"
              id="specificLocation"
              value={newFoodItem.specificLocation}
              onChange={handleChange}
              required
              placeholder="Aisle 3, Shelf B"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          {/* Details */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes/Details (e.g., Brand, package size)
            </label>
            <textarea
              name="details"
              id="details"
              value={newFoodItem.details}
              onChange={handleChange}
              placeholder="Add specific brand or size information."
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-150 bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Heart size={20} className="mr-2" />
            Submit Food Donation
          </button>
        </form>
      </div>
    </div>
  );
};

// ====================================================================
// SECTION 6: MAIN APP COMPONENT
// ====================================================================

/**
 * Splash Screen Component
 */
const SplashScreen = ({ gradientStyle }) => {
  const TAGLINE = "Be the light in their darkest chapter";

  // GSAP animation for the title (Pulse) and tagline (Typing)
  useEffect(() => {
    if (window.gsap) {
      const tl = window.gsap.timeline();

      // 1. Home Title Animation (Pulse)
      tl.to("#splash-title", {
        opacity: 0.2,
        scale: 0.95,
        duration: 0.75,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 2. Tagline Word-Typing Effect
      window.gsap.set(".tagline-char", { opacity: 0, y: 5 });

      window.gsap.to(".tagline-char", {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.05,
        ease: "none",
        delay: 0.5,
      });
    }
  }, []);

  const splitTagline = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="tagline-char"
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen font-sans`}
      style={gradientStyle}
    >
      <h1
        id="splash-title"
        className="text-6xl font-extrabold text-white tracking-widest uppercase drop-shadow-xl mb-4"
      >
        Home
      </h1>
      <div className="text-xl font-medium text-white drop-shadow-lg flex flex-wrap justify-center">
        {splitTagline(TAGLINE)}
      </div>
    </div>
  );
};

/**
 * Main App Component
 * Handles state, searching, and layout.
 */
const App = () => {
  // --- LOCAL STATE RESTORATION ---
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [foodItems, setFoodItems] = useState(MOCK_FOOD_ITEMS);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState(MOCK_INVENTORY);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);

  // --- AUTHENTICATION STATES ---
  const [isLoggedIn, setLoggedIn] = useState(false);
  // Mock user now only stores details provided by the mock login pages
  // Note: userType 'individual' is now 'Donator'
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthReady = true;

  // --- LOCAL ADD ITEM HANDLER (REPLACING FIREBASE) ---
  const handleAddItem = async (newItem) => {
    if (newItem.type && newItem.storageLocation) {
      // Food item: Add to foodItems state
      setFoodItems((prev) => [newItem, ...prev]);
    } else {
      // General item: Add to inventory state
      setInventory((prev) => [newItem, ...prev]);
    }
    return Promise.resolve();
  };

  // Effect to hide the splash screen after 2 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  // Use GSAP for staggered content entry when the main app loads
  useEffect(() => {
    if (!showSplash && window.gsap) {
      const tl = window.gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      tl.from("header.content-panel", { y: -30, opacity: 0 });

      tl.from(
        ".content-panel",
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.05,
          ease: "none",
          delay: 0.5,
        },
        "<0.1"
      );
    }
  }, [showSplash]);

  // Effect to handle filtering logic whenever the search term, category, OR INVENTORY changes.
  useEffect(() => {
    setLoading(true);
    const delaySearch = setTimeout(() => {
      // Start with only non-food items for the main grid
      let results = inventory.filter(
        (item) => !(item.type && item.storageLocation)
      );

      // 1. Filter by Search Term
      if (searchTerm.trim()) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        results = results.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerCaseSearch) ||
            item.description?.toLowerCase().includes(lowerCaseSearch) ||
            item.category?.toLowerCase().includes(lowerCaseSearch)
        );
      }

      // 2. Filter by Category
      if (selectedCategory !== "All") {
        results = results.filter((item) => item.category === selectedCategory);
      }

      setFilteredItems(results);
      setLoading(false);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, inventory]);

  const gradientStyle = {
    background:
      "linear-gradient(159deg, rgba(223, 237, 227, 1) 14%, rgba(100, 100, 100, 1) 43%, rgba(150, 150, 150, 1) 80%)",
  };

  // Conditional Rendering of Pages
  let content;

  if (showSplash || !isAuthReady) {
    content = (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen font-sans`}
        style={gradientStyle}
      >
        <h1 className="text-6xl font-extrabold text-white tracking-widest uppercase drop-shadow-xl mb-4">
          Loading...
        </h1>
        <svg
          className="animate-spin h-8 w-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  } else if (currentPage === "selectLogin") {
    content = <SelectLoginPage setCurrentPage={setCurrentPage} />;
  } else if (currentPage === "donatorLogin") {
    content = (
      <DonatorLoginPage
        setCurrentPage={setCurrentPage}
        setLoggedIn={setLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    );
  } else if (currentPage === "ngoLogin") {
    content = (
      <NgoLoginPage
        setCurrentPage={setCurrentPage}
        setLoggedIn={setLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    );
  } else if (currentPage === "profile") {
    content = (
      <DonatorProfilePage
        currentUser={currentUser}
        setCurrentPage={setCurrentPage}
        setLoggedIn={setLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    );
  } else if (currentPage === "ngoDonation") {
    // NGO Hub
    content = (
      <NgoDonationView
        setCurrentPage={setCurrentPage}
        inventory={inventory}
        foodItems={foodItems}
        setSelectedItem={setSelectedItem}
      />
    );
  } else if (currentPage === "reviewDonation" && selectedItem) {
    // NEW ROUTE
    content = (
      <ReviewDonationPage item={selectedItem} setCurrentPage={setCurrentPage} />
    );
  } else if (currentPage === "donateMoney") {
    // NEW ROUTE
    content = <MoneyDonationPage setCurrentPage={setCurrentPage} />;
  } else if (currentPage === "add") {
    // General Item Add (Donator only)
    // Check for 'individual' userType before rendering item form
    if (currentUser?.userType === "individual") {
      content = (
        <AddItemPage
          setCurrentPage={setCurrentPage}
          handleAddItem={handleAddItem}
          inventory={inventory}
          currentUser={currentUser}
        />
      );
    } else {
      content = (
        <HomeView
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredItems={filteredItems}
          loading={loading}
          setCurrentPage={setCurrentPage}
          setSelectedItem={setSelectedItem}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          foodItems={foodItems}
        />
      );
    }
  } else if (currentPage === "addFood") {
    // Food Item Add (Donator only)
    // Check for 'individual' userType before rendering food form
    if (currentUser?.userType === "individual") {
      content = (
        <AddFoodItemPage
          setCurrentPage={setCurrentPage}
          handleAddItem={handleAddItem}
          currentUser={currentUser}
        />
      );
    } else {
      content = (
        <HomeView
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredItems={filteredItems}
          loading={loading}
          setCurrentPage={setCurrentPage}
          setSelectedItem={setSelectedItem}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          foodItems={foodItems}
        />
      );
    }
  } else if (currentPage === "detail" && selectedItem) {
    if (selectedItem.type && selectedItem.storageLocation) {
      content = (
        <FoodItemDetailPage
          item={selectedItem}
          setCurrentPage={setCurrentPage}
        />
      );
    } else {
      content = (
        <ItemDetailPage item={selectedItem} setCurrentPage={setCurrentPage} />
      );
    }
  } else {
    content = (
      <HomeView
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredItems={filteredItems}
        loading={loading}
        setCurrentPage={setCurrentPage}
        setSelectedItem={setSelectedItem}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        foodItems={foodItems}
      />
    );
  }

  return (
    <>
      {/* Load GSAP library for animations */}
      <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
      {/* Load Tailwind CSS */}
      <script src="https://cdn.tailwindcss.com"></script>
      <div className={`min-h-screen font-sans`} style={gradientStyle}>
        {content}
      </div>

      {/* Floating Chatbot at Bottom Right */}
      {!showSplash && (
        <Chatbot
          inventory={inventory}
          foodItems={foodItems}
          categories={categories}
        />
      )}
    </>
  );
};

export default App;
