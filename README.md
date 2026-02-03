# LAYEDIN
> **Laid-Off Employee Talent Marketplace, Recruiters Browse Talents Profiles with Advanced Search &amp; Filtering Option, Real Time Direct Messaging with message persistent &amp; Hire Best Talents**

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101?logo=socket.io&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)


## Project Overview

LayedIn is a comprehensive talent marketplace that bridges the gap between **laid-off tech professionals** and **companies looking to hire exceptional talent**. Built with modern web technologies, it delivers a seamless experience for job seekers, recruiters, and hiring managers.

### The Problem It Solves
- **For Job Seekers**: Visibility gap after layoffs – hard to get noticed by recruiters
- **For Recruiters**: Scattered talent pool – no centralized platform for laid-off professionals
- **For Companies**: Missed opportunities to hire pre-vetted talent from top tech companies


## ✨ Key Features

### 🔍 Talent Discovery & Search
- **Multi-faceted filtering** with 8+ dimensions (skills, location, visa status, experience, remote preference)
- **Real-time search suggestions** with debounced API calls
- **Session-persisted pagination** – seamless browsing experience
- **Profile view tracking** – see who's interested in your profile

### 💬 Real-Time Communication
- **Bidirectional messaging** powered by Socket.io
- **Message persistence** with MongoDB
- **Conversation threading** with read receipts
- **Mute/Archive** conversation management

### 👥 Employee Referral Program
- **Offer referrals** – employees can help laid-off professionals
- **Request referrals** with structured email templates
- **Company-wise analytics** and referral tracking
- **30-day active referral lifecycle**

### 📊 Analytics Dashboard
- **Profile performance metrics** – views, messages, engagement
- **Industry insights** – layoff trends, recovery rates
- **Hiring activity tracking** for recruiters
- **Visual charts** powered by Recharts

### 🔐 Security & Authentication
- **JWT-based authentication** with secure token management
- **Password hashing** with bcrypt (10 salt rounds)
- **Role-based access control** for protected routes
- **Contact visibility controls** – users decide what's public

### 📱 Modern UI/UX
- **Responsive design** – mobile-first approach
- **Glassmorphism effects** with smooth animations (Framer Motion)
- **Dark theme** optimized for extended use
- **Skeleton loaders** for perceived performance


## 📦 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **MongoDB** running locally
- **npm** or **yarn** package manager

---

## Quick Start

### 1. Clone the Repository

```bash
gh repo clone Krishna-mishra-26/LAYEDIN
```

### 2. Set Up Backend

```bash
# Open a New Terminal & Start the MongoDB Service (Do Not Close This Terminal)
sudo net start MongoDB
mongod

# Open a New Terminal & Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Edit .env file with your settings (or use defaults for development)

# Seed the database with sample data (optional)
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Set Up Frontend

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Open in Browser

Visit `http://localhost:5173` to see the application!

## 📁 Project Structure

```
LayedIn/
├── backend/
│   ├── models/
│   │   ├── User.js           # Authentication & credentials
│   │   ├── Profile.js        # Professional profile schema
│   │   ├── Message.js        # Chat message schema
│   │   ├── Conversation.js   # Conversation threads
│   │   ├── HiringPost.js     # Job listings
│   │   └── Referral.js       # Employee referral program
│   ├── routes/
│   │   ├── auth.js           # Register, login, password
│   │   ├── profiles.js       # CRUD + advanced search
│   │   ├── messages.js       # Real-time messaging
│   │   ├── hiring.js         # Job posting management
│   │   └── referrals.js      # Referral workflows
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── utils/
│   │   └── externalJobs.js   # External job aggregation
│   ├── server.js             # Express + Socket.io setup
│   └── seed.js               # Database seeder (50+ profiles)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation with auth state
│   │   │   ├── Footer.jsx           # Responsive footer
│   │   │   ├── ProfileCard.jsx      # Talent display card
│   │   │   ├── SearchFilters.jsx    # Advanced filtering UI
│   │   │   ├── AnalyticsDashboard.jsx # Stats & insights
│   │   │   └── LoadingSpinner.jsx   # Skeleton loaders
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Landing + profile grid
│   │   │   ├── ProfilePage.jsx      # Detailed profile view
│   │   │   ├── DashboardPage.jsx    # User dashboard
│   │   │   ├── MessagesPage.jsx     # Real-time chat
│   │   │   ├── HiringPage.jsx       # Job listings
│   │   │   ├── ReferralsPage.jsx    # Referral marketplace
│   │   │   └── ...                  # Auth, create, edit pages
│   │   ├── store/
│   │   │   └── authStore.js         # Zustand auth state
│   │   ├── lib/
│   │   │   └── api.js               # Axios instance + interceptors
│   │   └── App.jsx                  # Routes + SEO titles
│   └── public/
│       ├── robots.txt               # SEO crawl rules
│       └── sitemap.xml              # Search engine sitemap
│
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/layedin
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18.2, Vite 5 | Component-based UI with fast HMR |
| **Styling** | Tailwind CSS 3.4, Framer Motion | Utility-first CSS + animations |
| **State** | Zustand 4.4 | Lightweight global state management |
| **Routing** | React Router 6 | Client-side navigation with guards |
| **Backend** | Node.js, Express 4 | RESTful API server |
| **Database** | MongoDB 6+, Mongoose 8 | Document-based data persistence |
| **Real-time** | Socket.io 4.6 | WebSocket messaging |
| **Auth** | JWT, bcryptjs | Secure token-based authentication |
| **Charts** | Recharts 3.7 | Data visualization |
| **HTTP** | Axios 1.6 | API client with interceptors |

---

## 🏗️ Architecture Highlights

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Zustand   │  │React Router │  │   Axios     │              │
│  │   (State)   │  │  (Routing)  │  │   (HTTP)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API + WebSocket
┌─────────────────────────────▼───────────────────────────────────┐
│                      BACKEND (Node.js + Express)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │     JWT     │  │  Socket.io  │  │  Mongoose   │              │
│  │   (Auth)    │  │ (Real-time) │  │   (ODM)     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                        MONGODB (Database)                        │
│  Users │ Profiles │ Messages │ Conversations │ Jobs │ Referrals │
└─────────────────────────────────────────────────────────────────┘
```



## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Get current user + profile |
| PUT | `/api/auth/password` | Change password |
| DELETE | `/api/auth/account` | Delete account |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles` | List with search & filters |
| GET | `/api/profiles/:id` | Get profile (tracks views) |
| GET | `/api/profiles/:id/viewers` | Who viewed your profile |
| POST | `/api/profiles` | Create profile |
| PUT | `/api/profiles/:id` | Update profile |
| GET | `/api/profiles/analytics` | Platform-wide analytics |
| GET | `/api/profiles/search-suggestions` | Autocomplete |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | All conversations |
| GET | `/api/messages/:conversationId` | Messages in thread |
| POST | `/api/messages` | Send message |
| PUT | `/api/messages/read/:id` | Mark as read |
| PUT | `/api/messages/:id` | Edit message |
| DELETE | `/api/messages/:id` | Delete message |

### Hiring Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hiring` | List job posts |
| GET | `/api/hiring/external` | External job aggregation |
| GET | `/api/hiring/my-posts` | User's posted jobs |
| POST | `/api/hiring` | Create job post |
| DELETE | `/api/hiring/:id` | Remove job post |

### Referrals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/referrals` | Browse referral offers |
| GET | `/api/referrals/stats` | Referral analytics |
| POST | `/api/referrals` | Offer a referral |
| POST | `/api/referrals/:id/request` | Request referral |


## 🔍 Advanced Search Capabilities

| Filter | Options | Implementation |
|--------|---------|----------------|
| **Text Search** | Name, headline, skills, bio | MongoDB text index |
| **Skills** | 40+ tech skills | Multi-select with chips |
| **Location** | Country, city | Dropdown with counts |
| **Visa Status** | Citizen, PR, Sponsorship needed | Status badges |
| **Experience** | 0-20+ years range | Min/max slider |
| **Remote Preference** | Remote, Hybrid, On-site | Toggle filters |
| **Company** | Ex-FAANG, startups | Company filter |
| **Availability** | Immediate, 2 weeks, 1 month | Date-based |


## 🎨 UI/UX Features

- **Glassmorphism Design** – Modern frosted glass effects with backdrop blur
- **Micro-interactions** – Hover states, button feedback, smooth transitions
- **Skeleton Loading** – Perceived performance during data fetches
- **Toast Notifications** – Success/error feedback with react-hot-toast
- **Responsive Breakpoints** – Mobile (sm), Tablet (md), Desktop (lg/xl)
- **Dark Theme** – Eye-friendly for extended browsing sessions

## 📈 Performance Optimizations

- **Vite Build** – Sub-second HMR, optimized production bundles
- **Code Splitting** – Lazy-loaded routes for faster initial load
- **API Caching** – Strategic caching with Axios interceptors
- **Debounced Search** – Reduced API calls during typing
- **Skeleton Loaders** – Improved perceived performance
- **Image Optimization** – Dicebear avatars, lazy loading

## 🔒 Security Features

- **JWT Authentication** – Stateless, scalable token auth
- **Password Hashing** – bcrypt with 10 salt rounds
- **Input Validation** – express-validator on all endpoints
- **CORS Configuration** – Whitelisted origins only
- **Rate Limiting Ready** – Middleware-ready architecture
- **XSS Prevention** – Sanitized user inputs

