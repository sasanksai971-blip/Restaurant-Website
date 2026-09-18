# 🍕 PizzaRush — Full-Stack Pizza Restaurant Ordering Platform

A modern, full-stack, responsive food ordering web application crafted with **React 18 + TypeScript + Vite + Tailwind CSS** on the frontend, and **Node.js + Express + TypeScript + Prisma ORM** on the backend.

---

## 🌟 Key Features

### 1. 🔐 Authentication & OTP Flow
- Mobile phone number entry with auto-formatting (+91).
- 6-digit OTP verification interface with auto-focus, paste support & 60s resend timer.
- Development mode displays instantaneous OTP helpers for effortless local testing.
- Secure JWT-based session token storage with automatic request interceptors.

### 2. 📍 Location & Address System
- **Dark Blue Exact Location Bar**: *"Give us your exact location"* with real-time feedback.
- Browser GPS auto-detection with fallback to popular delivery zones (Indiranagar, Koramangala, Whitefield, etc.).
- Multi-address management (Home, Work, Other) with default address tagging.

### 3. 🛎️ Notification Prompt
- Sleek notification modal requesting permission: *"We would like to send you notifications"*.
- Red **Allow** button & White **Don't Allow** button.

### 4. 🛵 4 Primary Ordering Modes
1. **Delivery**: 30-minute hot delivery with live GPS rider tracking.
2. **Schedule Delivery**: Select custom date & time slots (e.g. 12:00 PM – 10:00 PM).
3. **Take Away**: Instant pickup from 5 nearby restaurant outlets with zero waiting.
4. **Dine In**: Full table reservation flow (date, time, number of guests) + food pre-ordering.

### 5. 🏷️ Offers & Promotional Coupons
- **Offers for you** section with signature green heading and vibrant Blue/Orange ribbon cards:
  - *Flat 50% OFF on first order* (`FIRST50`)
  - *Flat ₹249 OFF on Dine In* (`DINEIN249`)
  - *Flat ₹499 OFF on Take Away* (`TAKEAWAY499`)
- One-click coupon application with immediate cart discount calculation.

### 6. ⭐ Top 10 Best Sellers
- Gold-accented heading over an exclusive golden background section (`#FFF8E1`).
- Card displays product image, white title, small ingredient captions, and red **Add +** button.

### 7. 🍕 Full Menu & Dynamic Filtering
- **12 Craving Categories**: Cheese Lava, Big Big Pizza, Lunch Feast, Veg Pizza, Non-Veg Pizza, Deals, Chicken Feast, Cheese Burst, Cheese Volcano, Pizza Mania, Garlic Breads, Desserts.
- **Dynamic Instant Filtering**:
  - *Veg Only* toggle (Green indicator)
  - *Non Veg Only* toggle (Red indicator)
  - *Sort by Price* (Low to High / High to Low)
  - Real-time text search across product names, ingredients & descriptions.

### 8. 🥗 Nutritional & Allergen Information
- Detailed per-serving breakdown for all items: Calories (kcal), Protein (g), Carbohydrates (g), Total Fat (g), Sugar (g), Sodium (mg).
- Accessible from both individual product customization modal and dedicated nutrition page.

### 9. 🛒 Persistent Cart & Slide-in Checkout
- **Sticky Red Bottom Cart Bar**: Displays item count, total price and *"View Cart"* call-to-action.
- 3-Step Checkout Wizard:
  1. Address Selection / Store Confirmation
  2. Payment Method (UPI / QR, Cards, Pay on Delivery)
  3. Order Review & Submission
- Animated order confirmation with **sliding motion** and **celebratory green check mark**.

### 10. 📦 Real-Time Order Tracking & History
- Multi-state timeline tracker adapted for Delivery, Takeaway, or Dine-in orders.
- Visual satellite rider GPS map simulation.
- Order history with 1-click reorder capability.

### 11. 🤖 AI Customer Support & Bulk Catering
- Interactive 24/7 AI chat assistant with quick suggestion chips and live fallback to human care.
- Dedicated party & corporate bulk catering booking form.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Zustand, Lucide React, Framer Motion, Canvas Confetti |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, JSON Web Tokens (JWT), Express-Validator, Helmet, CORS |
| **Database** | SQLite for instant dev zero-config (`dev.db`), fully PostgreSQL-compatible schema |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server

```bash
cd backend
npm install
npx prisma generate
npx ts-node prisma/seed.ts
npm run dev
```
> The API server will start on `http://localhost:3001` with seed data pre-populated (39+ products, 17 categories, 5 stores, 3 offers, 5 coupons).

### 2. Start the Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```
> The Vite web application will open on `http://localhost:5173`.

---

## 📁 Project Structure

```
WEBSITE(R)/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # 14 Prisma database models
│   │   ├── seed.ts            # Extensive realistic seed dataset
│   │   └── dev.db             # SQLite database file
│   ├── src/
│   │   ├── routes/            # REST API route handlers
│   │   │   ├── addresses.ts   # User saved addresses
│   │   │   ├── auth.ts        # OTP sending & JWT verification
│   │   │   ├── bookings.ts    # Dine-in table reservations
│   │   │   ├── bulkOrders.ts  # Bulk catering requests
│   │   │   ├── cart.ts        # Cart operations
│   │   │   ├── offers.ts      # Deals & coupon validation
│   │   │   ├── orders.ts      # Order creation & tracking
│   │   │   ├── products.ts    # Menu catalog & categories
│   │   │   ├── stores.ts      # Outlet locations & distances
│   │   │   └── support.ts     # AI support assistant
│   │   ├── middleware/        # JWT auth validation
│   │   ├── lib/               # Prisma singleton client
│   │   └── index.ts           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # 20+ Reusable UI components
│   │   │   ├── BestSellerCard.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── BulkOrderModal.tsx
│   │   │   ├── CartBar.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── LocationBar.tsx
│   │   │   ├── LocationModal.tsx
│   │   │   ├── MenuFilters.tsx
│   │   │   ├── NotificationPopup.tsx
│   │   │   ├── NutritionModal.tsx
│   │   │   ├── OfferCard.tsx
│   │   │   ├── OrderConfirmationModal.tsx
│   │   │   ├── OrderingModeSelector.tsx
│   │   │   ├── OrderTracker.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductDetailsModal.tsx
│   │   │   ├── ProfileMenu.tsx
│   │   │   ├── ScheduleDeliveryModal.tsx
│   │   │   ├── StoreSelectorModal.tsx
│   │   │   ├── SupportChatModal.tsx
│   │   │   ├── TableBookingModal.tsx
│   │   │   └── TermsModal.tsx
│   │   ├── pages/             # Application Pages
│   │   │   ├── BulkOrderPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── DineInPage.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── NutritionPage.tsx
│   │   │   ├── OffersPage.tsx
│   │   │   ├── OrderHistoryPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   ├── OTPPage.tsx
│   │   │   ├── SupportPage.tsx
│   │   │   ├── TakeawayPage.tsx
│   │   │   └── TermsPage.tsx
│   │   ├── store/             # Zustand state management
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   ├── locationStore.ts
│   │   │   └── orderStore.ts
│   │   ├── types/             # TypeScript definitions
│   │   ├── lib/api.ts         # Axios client with interceptors
│   │   ├── App.tsx            # Routes configuration
│   │   ├── index.css          # Tailwind CSS styling
│   │   └── main.tsx           # React root
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── .env.example
└── README.md
```

---

## 🔒 Environment Variables

Refer to `.env.example` for environment variable templates.

---

## 📄 License
MIT License. Built for full-stack excellence.
