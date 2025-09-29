# Donation & Inventory Management Platform

This is a full-stack web application designed to streamline the process of donating and managing inventory for non-profit organizations (NGOs). It provides a user-friendly interface for individual donators to submit items and a dedicated hub for NGOs to review, accept, and manage incoming donations.

## ✨ Features

-   **Dual User Roles:** Separate login and functionality for **Individual Donators** and **NGOs**.
-   **Comprehensive Inventory System:**
    -   Categorizes donations into general goods (Electronics, Clothing, etc.) and food items.
    -   Dynamic search and filtering by category and keywords.
    -   Visually distinct cards for different item types.
-   **Donation Submission:**
    -   Easy-to-use forms for submitting both general products and food items.
    -   Mock image upload with "verification" to ensure quality.
    -   **Fuzzy Duplicate Detection:** Alerts users if they are submitting an item that is very similar to an existing one in the inventory.
-   **NGO Donation Hub:**
    -   A centralized dashboard for NGOs to view all pending donations.
    -   A "Critical Requirements" section to broadcast urgent needs to donators.
    -   A detailed review page to inspect donator and item information before accepting a donation.
-   **User Profiles:**
    -   Authenticated users have a profile page displaying their details.
    -   Functionality to edit user information.
-   **AI-Powered Chatbot:**
    -   An integrated AI assistant (powered by Google's Gemini) to answer questions about the inventory, categories, and donation process.

## 🛠️ Tech Stack

-   **Frontend:**
    -   **React:** A JavaScript library for building user interfaces.
    -   **Vite:** A fast build tool and development server for modern web projects.
    -   **Tailwind CSS:** A utility-first CSS framework for rapid UI development (used via CDN).
    -   **Lucide React:** A library of simply beautiful and consistent icons.
-   **Backend:**
    -   **Node.js:** A JavaScript runtime for building server-side applications.
    -   **Express.js:** A minimal and flexible Node.js web application framework.
    -   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
    -   **Body-Parser:** Middleware for parsing incoming request bodies.
-   **Deployment:**
    -   The Express server is configured to serve the static, built React application and provide a backend API from a single origin.

## 📂 Project Structure

The project is organized into two main parts within the `home` directory:
