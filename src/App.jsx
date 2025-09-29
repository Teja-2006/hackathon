import React, { useState, useEffect } from "react";
import {
  Search,
  Tag,
  Utensils,
  Apple,
  Cookie,
  BookOpen,
  Warehouse,
  Dumbbell,
  MessageSquare,
  Send,
  Monitor,
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
} from "lucide-react";

// --- Base Mock Data ---
const BASE_MOCK_INVENTORY = [
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
  },
  {
    id: 2,
    name: '4K UltraWide Monitor 34"',
    category: "Electronics",
    price: 750.5,
    description: "Stunning visual fidelity and massive screen real estate.",
    details:
      "Resolution: 3440x1440, Refresh Rate: 100Hz, Ports: HDMI, DisplayPort",
    donorName: "John Smith",
    donorAddress: "45 Monitor Blvd",
    donorLocation: "San Francisco, CA",
  },
  {
    id: 3,
    name: "Wireless Gaming Mouse",
    category: "Electronics",
    price: 55.99,
    description: "Low latency, high precision sensor for competitive gaming.",
    details:
      "DPI: 16000, Weight: 90g, Battery Life: 70 hours, programmable buttons.",
    donorName: "Jane Doe",
    donorAddress: "123 Tech Lane",
    donorLocation: "Austin, TX",
  },
  {
    id: 4,
    name: "Noise-Cancelling Headphones",
    category: "Electronics",
    price: 299.0,
    description: "Immersive sound experience with industry-leading ANC.",
    details:
      "Battery: 30 hours, Noise Cancellation: Adaptive, Includes hard shell carrying case.",
    donorName: "Mike Jones",
    donorAddress: "789 Headset Way",
    donorLocation: "New York, NY",
  },
  {
    id: 5,
    name: "Portable SSD 1TB",
    category: "Electronics",
    price: 110.0,
    description: "Blazing fast external storage for large files.",
    details:
      "Read Speed: 540MB/s, Interface: USB 3.1 Gen 2, Durable, shock-resistant casing.",
    donorName: "John Smith",
    donorAddress: "45 Monitor Blvd",
    donorLocation: "San Francisco, CA",
  },
  {
    id: 6,
    name: "Adjustable LED Desk Lamp",
    category: "Home & Garden",
    price: 79.99,
    description: "Dimmable light for comfortable reading or working.",
    details:
      "Settings: 5 brightness levels, Color Temp: 3000K-6000K, Flexible neck, USB charging port.",
    donorName: "Sarah Connor",
    donorAddress: "101 Bright St",
    donorLocation: "Seattle, WA",
  },
  {
    id: 7,
    name: "Waterproof Gardening Gloves",
    category: "Home & Garden",
    price: 15.0,
    description: "Durable gloves for heavy-duty yard work.",
    details:
      "Material: Nitrile and Nylon blend, Size: Medium, Puncture resistant.",
    donorName: "Sarah Connor",
    donorAddress: "101 Bright St",
    donorLocation: "Seattle, WA",
  },
  {
    id: 8,
    name: "Classic Fit Cotton T-Shirt",
    category: "Clothing",
    price: 25.0,
    description: "Soft and breathable 100% cotton casual shirt.",
    details:
      "Material: 100% Organic Cotton, Color: Heather Gray, Available sizes: S, M, L, XL.",
    donorName: "David Lee",
    donorAddress: "202 Fashion Lane",
    donorLocation: "Los Angeles, CA",
  },
  {
    id: 9,
    name: "Best-Selling Thriller Novel",
    category: "Books",
    price: 14.99,
    description: "A gripping story with unexpected twists and turns.",
    details:
      "Author: J. D. Winters, Pages: 450, Format: Hardcover, Genre: Psychological Thriller.",
    donorName: "David Lee",
    donorAddress: "202 Fashion Lane",
    donorLocation: "Los Angeles, CA",
  },
  {
    id: 10,
    name: "Professional Yoga Mat",
    category: "Sports",
    price: 49.99,
    description: "Non-slip surface for perfect grip and balance.",
    details:
      "Thickness: 6mm, Material: TPE, Includes carrying strap, Easy to clean.",
    donorName: "Mike Jones",
    donorAddress: "789 Headset Way",
    donorLocation: "New York, NY",
  },
  {
    id: 11,
    name: "USB-C Docking Station",
    category: "Electronics",
    price: 150.0,
    description: "One cable solution for all your peripheral needs.",
    details:
      "Ports: 2x HDMI, 3x USB-A, 1x Ethernet, PD Charging, Aluminum casing.",
    donorName: "Sarah Connor",
    donorAddress: "101 Bright St",
    donorLocation: "Seattle, WA",
  },
];

const MOCK_FOOD_ITEMS = [
  {
    name: "Canned Vegetables",
    type: "Pantry",
    available: 85,
    details: "12-pack mixed veggies, shelf life 2 years.",
  },
  {
    name: "Trail Mix Packs",
    type: "Snack",
    available: 52,
    details: "Individual 100g packs, variety of nuts and dried fruit.",
  },
  {
    name: "Boxed Pasta",
    type: "Pantry",
    available: 120,
    details: "500g boxes, mix of spaghetti and penne.",
  },
  {
    name: "Fresh Apples",
    type: "Produce",
    available: 25,
    details: "Crisp Red Delicious variety, picked last week.",
  },
];

// Get unique categories and add 'All'
const categories = [
  "All",
  ...new Set(BASE_MOCK_INVENTORY.map((item) => item.category)),
];

const CONDITIONS = ["New", "Excellent", "Good", "Used", "Fair"];
const FOOD_TYPES = ["Produce", "Snack", "Pantry"];
const LOW_STOCK_THRESHOLD = 20;

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
      return <Wrench {...iconProps} />; // Default Icon
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
 * ItemCard Component
 * Displays individual item information in a stylized card.
 * NOW TAKES onClick PROP
 */
const ItemCard = ({ item, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] hover:brightness-105 hover:bg-gray-50 border border-gray-100 cursor-pointer"
    onClick={() => onClick(item)}
  >
    {/* Icon Slot - Replaces Image */}
    <div
      className={`w-full h-28 flex items-center justify-center rounded-md mb-3 border border-gray-100 ${getCategoryColor(
        item.category
      )}`}
    >
      {getCategoryIcon(item.category)}
    </div>

    <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
      {item.name}
    </h3>
    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
      {item.description}
    </p>
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
          <span className="font-bold text-gray-800">{food.name}</span>
        </div>
        <span className="text-xs text-gray-500 mt-0.5 ml-5">{food.type}</span>
      </div>

      {/* Small Display Box for Stock - Dynamic Styling */}
      <div
        className={`flex items-center justify-center p-1.5 border rounded-md shadow-inner ${badgeBg} ${badgeBorder}`}
      >
        <span className={`text-xs font-extrabold ${badgeText}`}>
          {food.available}
        </span>
      </div>
    </div>
  );
};

/**
 * Splash Screen Component
 */
const SplashScreen = ({ gradientStyle }) => {
  const TAGLINE = "Be the light in their darkest chapter";

  // GSAP animation for the title (Pulse) and tagline (Typing)
  useEffect(() => {
    // Ensure gsap is loaded before trying to use it
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
      // Initially set all characters to hidden
      window.gsap.set(".tagline-char", { opacity: 0, y: 5 });

      // Animate them in sequentially
      window.gsap.to(".tagline-char", {
        opacity: 1,
        y: 0,
        stagger: 0.03, // Controls the speed of the typing effect
        duration: 0.05,
        ease: "none",
        delay: 0.5, // Start after a slight delay
      });

      // Removed exit timer logic as CSS exit animation is removed
    }
  }, []);

  // Function to split the tagline into individual character spans
  const splitTagline = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="tagline-char"
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}{" "}
        {/* Replace space with non-breaking space for layout */}
      </span>
    ));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen font-sans`}
      style={gradientStyle}
    >
      <h1
        id="splash-title" // ID needed for GSAP targeting
        className="text-6xl font-extrabold text-white tracking-widest uppercase drop-shadow-xl mb-4"
      >
        Home
      </h1>
      <div className="text-xl font-medium text-white drop-shadow-lg flex flex-wrap justify-center">
        {/* Apply typing effect to the entire tagline */}
        {splitTagline(TAGLINE)}
      </div>
    </div>
  );
};

/**
 * Item Detail Page Component
 */
const ItemDetailPage = ({ item, setCurrentPage }) => {
  const handleMapClick = () => {
    if (item.donorLocation) {
      // Encode the location string for use in a URL query
      const mapQuery = encodeURIComponent(
        item.donorLocation + " " + item.donorAddress
      );
      // Open Google Maps link in a new tab
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
        "_blank"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center content-panel">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150"
        >
          <ChevronLeft size={24} className="mr-2" />
          <span className="font-semibold text-lg">Back to Inventory</span>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Item Details
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 content-panel">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Image/Icon */}
          <div
            className={`w-full md:w-1/3 h-56 flex items-center justify-center rounded-lg border border-gray-200 ${getCategoryColor(
              item.category
            )} shadow-lg flex-shrink-0`}
          >
            {getCategoryIcon(item.category)}
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
                <Tag size={20} className="mr-2 text-gray-500" />
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

              {/* --- DONOR DETAILS SECTION --- */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-xl font-bold text-gray-700">
                  Donor Information
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span className="font-bold w-24">Donor:</span>
                    <span>{item.donorName || "N/A"}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <MapPin
                      size={16}
                      className="mr-2 mt-1 text-gray-500 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">Address:</span>
                      <span>{item.donorAddress || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe size={16} className="mr-2 text-gray-500" />
                    <span className="font-bold w-24">Location:</span>
                    <span>{item.donorLocation || "N/A"}</span>
                  </div>
                </div>

                {/* Map Button */}
                {item.donorLocation && (
                  <button
                    onClick={handleMapClick}
                    className="mt-3 flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
                  >
                    <MapPin size={16} className="mr-2" />
                    View on Map
                  </button>
                )}
              </div>
              {/* --- END DONOR DETAILS SECTION --- */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Add Item Page Component (The new page)
 * Now accepts a callback function to add the new item.
 */
// Define the Mock API key outside the component (as a real key would be)
const MOCK_IMAGGA_KEY = "acc_1611ccc4a20d56a";

/**
 * Simplified fuzzysort-like function to check for duplicates.
 * Returns the best match object if the score is above a threshold.
 * Score is a negative integer (closer to 0 is better).
 */
const FUZZY_THRESHOLD = -2500;
const checkFuzzyDuplicates = (query, inventory) => {
  let bestMatch = null;
  let highestScore = FUZZY_THRESHOLD;

  // Normalize and pre-process the query
  const queryLower = query.toLowerCase();

  for (const item of inventory) {
    const target = item.name.toLowerCase();
    let score = 0;

    // Simple fuzzy logic: base penalty on length difference
    const lenDiff = Math.abs(queryLower.length - target.length);
    score -= lenDiff * 100;

    // Check for common prefix/suffix
    if (target.includes(queryLower) || queryLower.includes(target)) {
      score += 1500; // Strong match if one contains the other
    } else {
      // Check for character matches and position penalty (basic version of Levenshtein/FuzzySort idea)
      let matchCount = 0;
      for (let i = 0; i < queryLower.length; i++) {
        if (target.includes(queryLower[i])) {
          matchCount++;
        }
      }
      score += matchCount * 100;
    }

    // Check for exact word matches (ignoring order)
    const queryWords = queryLower.split(" ").filter((w) => w.length > 2);
    const targetWords = target.split(" ").filter((w) => w.length > 2);
    for (const qWord of queryWords) {
      if (targetWords.includes(qWord)) {
        score += 500;
      }
    }

    // Final score should be negative, lower magnitude is better.
    // We invert the score logic to return a negative score similar to fuzzysort convention for simplicity.
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

const AddItemPage = ({
  setCurrentPage,
  handleAddItem,
  inventory,
  currentUser,
}) => {
  // Auto-fill donor details if the user is logged in
  const initialDonorDetails = {
    donorName: currentUser ? currentUser.name : "",
    donorAddress: currentUser ? currentUser.address : "",
    donorLocation: currentUser ? currentUser.location : "",
  };

  const [newItem, setNewItem] = useState({
    name: "",
    category: categories[1], // Skip 'All'
    condition: CONDITIONS[0],
    description: "", // Capture description for display on card
    details: "", // Capture details for display on detail page
    picture: null,
    // DONOR FIELDS (Initialized with currentUser details)
    ...initialDonorDetails,
  });

  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [duplicateAlert, setDuplicateAlert] = useState(null); // Holds best match item if duplicate is found

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      const file = files[0];
      setNewItem((prev) => ({ ...prev, [name]: file }));
      setVerificationStatus("idle"); // Reset verification on new file selection
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
      setVerificationStatus("error");
      setMessage("Please upload a file before attempting verification.");
      return;
    }

    setVerificationStatus("pending");
    setMessage("Verifying image quality and content via Imagga...");

    console.log(`Simulating API call to Imagga with key: ${MOCK_IMAGGA_KEY}`);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (newItem.picture.name.includes("test_fail")) {
      setVerificationStatus("error");
      setMessage(
        "Verification failed. Image quality is too low or content is inappropriate."
      );
    } else {
      setVerificationStatus("success");
      setMessage("Image successfully verified and approved.");
    }
  };

  const finalizeSubmission = () => {
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      price: 0,
      description: newItem.description || "No description provided.",
      details: newItem.details || "No additional details provided.",
    };

    handleAddItem(itemToAdd);

    setMessage(
      `Item "${newItem.name}" submitted successfully and added to inventory!`
    );
    setDuplicateAlert(null); // Close the alert if it was open

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

    // 1. FUZZY DUPLICATE CHECK
    const duplicateResult = checkFuzzyDuplicates(newItem.name, inventory);

    if (duplicateResult) {
      setDuplicateAlert(duplicateResult.item);
      setMessage(
        "Warning: A similar item was found in the inventory. Please confirm submission."
      );
      // Prevent immediate submission. User must click "Submit Anyway" in the modal.
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

  // Button content based on status
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
                onClick={finalizeSubmission} // Bypass duplicate check this time
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
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150"
        >
          <ChevronLeft size={24} className="mr-2" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          Donate Item
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
          {/* --- Donor Details Section --- */}
          <h2 className="text-xl font-bold text-gray-700 pt-4 border-t border-gray-200">
            Donor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Name */}
            <div>
              <label
                htmlFor="donorName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donor Name
              </label>
              <input
                type="text"
                name="donorName"
                id="donorName"
                value={newItem.donorName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                // If logged in, field is read-only and styled differently
                readOnly={Boolean(currentUser)}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {/* Donor Location (City/State) */}
            <div>
              <label
                htmlFor="donorLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City / State
              </label>
              <input
                type="text"
                name="donorLocation"
                id="donorLocation"
                value={newItem.donorLocation}
                onChange={handleChange}
                required
                placeholder="City, State/Province"
                readOnly={Boolean(currentUser)}
                className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                  currentUser
                    ? "bg-gray-100 border-gray-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
          {/* Donor Address */}
          <div>
            <label
              htmlFor="donorAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Street Address
            </label>
            <input
              type="text"
              name="donorAddress"
              id="donorAddress"
              value={newItem.donorAddress}
              onChange={handleChange}
              required
              placeholder="Street address, Apt, etc."
              readOnly={Boolean(currentUser)}
              className={`w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500 transition duration-150 ${
                currentUser ? "bg-gray-100 border-gray-300" : "border-gray-300"
              }`}
            />
          </div>
          {/* --- End Donor Details Section --- */}

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
                className={`absolute bottom-3 right-3 z-10 flex items-center text-xs font-semibold px-3 py-1 rounded-full transition duration-150 shadow-md ${buttonClasses} ${
                  isPending || !newItem.picture ? "opacity-70" : ""
                }`}
              >
                {buttonContent}
              </button>
              {/* End Verification Button */}

              <div className="space-y-1 text-center relative z-0">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m30-10V12a4 4 0 00-4-4H20L4 32h16l4 8 16-24z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
 * Donor Login Page Component
 */
const DonorLoginPage = ({ setCurrentPage, setLoggedIn, setCurrentUser }) => {
  const [userType, setUserType] = useState("individual"); // 'individual' or 'ngo'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleVerify = async () => {
    if (!name || !email || !address || !location) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setIsPending(true);
    setMessage(
      `Verifying ${
        userType === "individual" ? "ID" : "NGO details"
      } and address...`
    );

    // Simulate external verification process
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

    // Mock login: Set the user and redirect
    const user = {
      name,
      email,
      address,
      location,
      userType, // Store the type
      profilePicture:
        "https://placehold.co/100x100/4B5563/FFF?text=" +
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
    };
    setCurrentUser(user);
    setLoggedIn(true);
    setCurrentPage("add"); // Direct to donation form after successful login
  };

  // UI variables based on user type
  const nameLabel =
    userType === "individual" ? "Full Name" : "Organization Name";
  const namePlaceholder =
    userType === "individual" ? "John Doe" : "Example Foundation";
  const verifyButtonText =
    userType === "individual" ? "Verify ID & Proceed" : "Verify NGO Status";
  const verifyIcon =
    userType === "individual" ? (
      <User size={16} className="mr-2" />
    ) : (
      <Building size={16} className="mr-2" />
    );

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 content-panel">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150"
        >
          <ChevronLeft size={24} className="mr-2" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase text-center">
          Donor Login
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500">
        {/* --- User Type Selection --- */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => {
              setUserType("individual");
              setIsIdVerified(false);
              setMessage("");
            }}
            className={`flex-1 py-3 px-4 rounded-lg shadow-md font-semibold text-sm transition duration-150 ${
              userType === "individual"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <User size={16} className="mr-2 inline" /> Donor / Individual
          </button>
          <button
            onClick={() => {
              setUserType("ngo");
              setIsIdVerified(false);
              setMessage("");
            }}
            className={`flex-1 py-3 px-4 rounded-lg shadow-md font-semibold text-sm transition duration-150 ${
              userType === "ngo"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Building size={16} className="mr-2 inline" /> NGO / Organization
          </button>
        </div>
        {/* --- End User Type Selection --- */}

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
          {/* Name/Organization Name */}
          <div>
            <label
              htmlFor="loginName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {nameLabel}
            </label>
            <input
              type="text"
              id="loginName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={namePlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          {/* Email */}
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
          {/* Address */}
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
          {/* Location */}
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
                {verifyIcon}
                {verifyButtonText}
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
 * Donor Profile Page Component
 */
const DonorProfilePage = ({
  currentUser,
  setCurrentPage,
  setLoggedIn,
  setCurrentUser,
}) => {
  if (!currentUser) {
    setCurrentPage("home"); // Redirect if no user is logged in
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
    setCurrentPage("home");
  };

  // Mock profile picture URL (using initials)
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const profilePicUrl = `https://placehold.co/150x150/4B5563/FFFFFF?text=${initials}`;

  // Helper for profile details based on user type
  const nameLabel =
    currentUser.userType === "individual" ? "Donor Name" : "Organization Name";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 content-panel">
      <header className="mb-6 p-3 bg-white/90 rounded-xl shadow-lg flex justify-between items-center border-b border-gray-200">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-150"
        >
          <ChevronLeft size={24} className="mr-2" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight font-sans uppercase">
          My Profile
        </h1>
      </header>

      <div className="p-8 bg-white/90 rounded-xl shadow-2xl border-t-4 border-gray-500 space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center border-b border-gray-200 pb-6">
          <img
            src={profilePicUrl}
            alt="Profile Picture"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-300 shadow-xl"
          />
          <h2 className="text-4xl font-bold text-gray-800 mt-4">
            {currentUser.name}
          </h2>
          <p className="text-gray-500">{currentUser.email}</p>

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
              <span className="text-gray-600">{currentUser.name}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">User Type:</span>
              <span className="text-gray-600 capitalize">
                {currentUser.userType}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Email:</span>
              <span className="text-gray-600">{currentUser.email}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Verification Status:</span>
              <span className="text-green-600 font-bold flex items-center">
                <CheckCircle size={16} className="mr-1" /> Verified Donor
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3 flex items-center">
              <MapPin size={20} className="mr-2 text-gray-500" /> Contact &
              Location
            </h3>
            <div className="text-gray-700">
              <span className="font-semibold block">Address:</span>
              <span className="text-gray-600">{currentUser.address}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold block">Location:</span>
              <span className="text-gray-600">{currentUser.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => alert("Simulating Edit Profile...")}
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

/**
 * Chatbot Component (omitted for brevity)
 */
const Chatbot = () => {
  // ... (Chatbot implementation remains unchanged)
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Hello! I am your Inventory Assistant. How can I help you search or manage your stock today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = { sender: "User", text: input.trim() };
    setMessages([...messages, newMessage]);
    setInput("");

    // Mock Bot Response Logic
    setTimeout(() => {
      const botResponse = {
        sender: "Bot",
        text: `Thanks for asking about "${input.trim()}." I can look that up for you!`,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
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
            Inventory Support Chat
            <span className="text-xs bg-green-400 px-2 py-0.5 rounded-full font-medium">
              Online
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
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-gray-500 focus:border-gray-500 text-sm"
              />
              <button
                onClick={handleSend}
                className="ml-2 w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition duration-150"
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
 * Home View Component
 * The original inventory search and display page.
 */
const HomeView = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filteredItems,
  loading,
  categories,
  setCurrentPage,
  setSelectedItem,
  isLoggedIn, // NEW PROP
  currentUser, // NEW PROP
}) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle clicking an ItemCard
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentPage("detail");
  };

  const handleDonateClick = () => {
    if (isLoggedIn) {
      setCurrentPage("add");
    } else {
      setCurrentPage("login");
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
          {/* User Profile / Login Button */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setCurrentPage("profile")}
                className="flex items-center justify-center p-2 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-50 transition duration-150"
                title="My Profile"
              >
                <img
                  src={currentUser.profilePicture}
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
              onClick={() => setCurrentPage("login")}
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 transform hover:scale-105"
            >
              <LogIn size={20} className="mr-2" />
              Donor Login
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
            <h2 className="text-xl font-bold text-gray-800 mb-5 p-2 bg-gray-100 rounded-lg flex items-center">
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
                <Tag size={16} className="mr-2 text-gray-500" />
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

          {/* 2. Available Food Items Window (RESTORED) */}
          <div className="p-5 bg-white/90 rounded-xl shadow-xl border-t-4 border-gray-500 content-panel">
            <h3 className="xl font-bold text-gray-800 mb-5 p-2 bg-gray-100 rounded-lg flex items-center">
              <Utensils size={20} className="mr-2 text-gray-500" />
              Available Food Items
            </h3>
            <div className="space-y-3">
              {MOCK_FOOD_ITEMS.map((food, index) => (
                <FoodCard key={index} food={food} />
              ))}
            </div>
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
                  {" "}
                  {/* Reduced gap */}
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onClick={handleItemClick}
                    />
                  ))}
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

/**
 * Main App Component
 * Handles state, searching, and layout.
 */
const App = () => {
  // 1. CONVERTED TO STATE
  const [inventory, setInventory] = useState(BASE_MOCK_INVENTORY);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState(BASE_MOCK_INVENTORY);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);

  // --- NEW AUTHENTICATION STATES ---
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Stores donor name, email, address, location, profilePicture

  // 2. NEW HANDLER FUNCTION
  const handleAddItem = (newItem) => {
    // Add the new item to the inventory state
    setInventory((prevInventory) => [newItem, ...prevInventory]);
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
    // Check for window.gsap to ensure the library is loaded
    if (!showSplash && window.gsap) {
      // Initialize GSAP timeline
      const tl = window.gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      // 1. Target the top header and move it in from the top
      tl.from("header.content-panel", { y: -30, opacity: 0 });

      // 2. Target the main content panels (.content-panel)
      tl.from(
        ".content-panel",
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          scale: 0.98,
        },
        "<0.1"
      );
    }
  }, [showSplash]);

  // Use a derived state (useEffect) to handle filtering logic whenever the search term, category, OR INVENTORY changes.
  useEffect(() => {
    // Basic debounce simulation for a smoother feel
    setLoading(true);
    const delaySearch = setTimeout(() => {
      let results = inventory; // Use state here

      // 1. Filter by Search Term
      if (searchTerm.trim()) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        results = results.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerCaseSearch) ||
            item.description.toLowerCase().includes(lowerCaseSearch) ||
            item.category.toLowerCase().includes(lowerCaseSearch)
        );
      }

      // 2. Filter by Category
      if (selectedCategory !== "All") {
        results = results.filter((item) => item.category === selectedCategory);
      }

      setFilteredItems(results);
      setLoading(false);
    }, 300); // 300ms delay

    // Cleanup function to clear the timeout if the effect runs again
    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, inventory]); // IMPORTANT: Add inventory to dependencies

  const gradientStyle = {
    // Current gradient reflecting the light green/gray to gray/darker gray theme
    background:
      "linear-gradient(159deg, rgba(223, 237, 227, 1) 14%, rgba(100, 100, 100, 1) 43%, rgba(150, 150, 150, 1) 80%)",
  };

  // Conditional Rendering of Pages
  let content;

  if (showSplash) {
    content = <SplashScreen gradientStyle={gradientStyle} />;
  } else if (currentPage === "login") {
    content = (
      <DonorLoginPage
        setCurrentPage={setCurrentPage}
        setLoggedIn={setLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    );
  } else if (currentPage === "profile") {
    content = (
      <DonorProfilePage
        currentUser={currentUser}
        setCurrentPage={setCurrentPage}
        setLoggedIn={setLoggedIn}
        setCurrentUser={setCurrentUser}
      />
    );
  } else if (currentPage === "add") {
    // Pass inventory and currentUser to AddItemPage
    content = (
      <AddItemPage
        setCurrentPage={setCurrentPage}
        handleAddItem={handleAddItem}
        inventory={inventory}
        currentUser={currentUser}
      />
    );
  } else if (currentPage === "detail" && selectedItem) {
    content = (
      <ItemDetailPage item={selectedItem} setCurrentPage={setCurrentPage} />
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
        categories={categories}
        setCurrentPage={setCurrentPage}
        setSelectedItem={setSelectedItem}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
    );
  }

  return (
    <>
      {/* Load GSAP library for animations */}
      <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
      <div>{content}</div>

      {/* Floating Chatbot at Bottom Right */}
      {!showSplash && <Chatbot />}
    </>
  );
};

export default App;
