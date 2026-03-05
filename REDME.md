<div align="center">

<img src="https://img.shields.io/badge/CivicSense-AI%20Grievance%20Platform-1A56DB?style=for-the-badge&logoColor=white" />

# CivicSense

### AI-Powered Civic Grievance Intelligence Platform

*Submit · Analyze · Prioritize · Resolve*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203-F55036?style=flat-square)](https://groq.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[Live Demo](https://civicsense.vercel.app)** · **[Report Bug](https://github.com/YOUR_USERNAME/civicsense/issues)** · **[Request Feature](https://github.com/YOUR_USERNAME/civicsense/issues)**

</div>

---

## What is CivicSense?

CivicSense is an AI-powered civic grievance platform that bridges the gap between citizens and government. Citizens submit complaints in plain language. Our AI instantly categorizes the issue, scores its urgency from 1 to 10, routes it to the correct government department, and generates a plain-English summary — all in under one second.

Government officials get a real-time dashboard where complaints are automatically sorted by urgency, so the most critical issues are never buried. Citizens get a tracking ID and can follow their complaint's resolution journey in real time.

> India processes over 2 million CPGRAMS complaints every year. 40% are never resolved. 90% of citizens abandon follow-up. CivicSense fixes the triage layer.

---

## Features

### Citizen Portal
- **Smart Complaint Submission** — Submit in plain language, AI handles categorization
- **Live AI Analysis** — Urgency score, department routing, and summary appear instantly
- **Unique Tracking ID** — Every complaint gets a `CSV-XXXX-XXXX` ID for public tracking
- **My Complaints** — Full history with status badges and urgency indicators
- **AI Chat Assistant** — Ask questions about your complaint in natural language
- **Public Tracker** — Track any complaint without logging in

### Admin & Officer Portal
- **Urgency-Sorted Dashboard** — Critical complaints always surface to the top
- **Color-Coded Priority System** — Red / Orange / Yellow / Green at a glance
- **One-Click Status Updates** — With full immutable audit trail
- **Officer Assignment** — Route complaints to specific officers
- **Analytics Dashboard** — Live KPIs, category breakdown, resolution trends

### AI Intelligence Layer
- Automatic complaint categorization across 10 civic categories
- Urgency scoring 1–10 with Critical / High / Medium / Low labels
- Department routing based on complaint context
- Sentiment detection — Frustrated / Neutral / Urgent / Angry
- Natural language chatbot with complaint context awareness

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + shadcn/ui |
| **Backend** | Node.js + Express 4 (Modular Monolith) |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **AI / LLM** | Groq API — LLaMA 3-8B-8192 |
| **Auth** | JWT + bcryptjs (Stateless, RBAC) |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Toasts** | react-hot-toast |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## Project Structure
```
civicsense/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Complaint.model.js
│   │   ├── ai/
│   │   │   └── groq.service.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── complaints/
│   │   │   ├── admin/
│   │   │   └── analytics/
│   │   └── seed.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── UrgencyBadge.jsx
    │   │   ├── StatusTimeline.jsx
    │   │   ├── AIResultCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Spinner.jsx
    │   └── pages/
    │       ├── auth/
    │       ├── citizen/
    │       ├── admin/
    │       └── public/
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas account (free M0 cluster)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/civicsense.git
cd civicsense
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create your `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create your `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Seed demo data
```bash
cd backend
npm run seed
```

This creates 20 realistic complaints and 3 demo accounts.

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Citizen | citizen@civicsense.com | demo123 |
| Officer | officer@civicsense.com | demo123 |
| Admin | admin@civicsense.com | demo123 |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Complaints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/complaints` | Submit complaint + AI analysis | Citizen |
| GET | `/api/complaints/my` | Get own complaints | Citizen |
| GET | `/api/complaints/track/:id` | Public tracking | None |
| POST | `/api/complaints/chat` | AI chatbot | Citizen |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/complaints` | All complaints, sorted by urgency | Admin/Officer |
| PUT | `/api/admin/complaints/:id/status` | Update status | Admin/Officer |
| GET | `/api/admin/analytics` | Analytics aggregation | Admin |

---

## Urgency System

| Score | Label | Color | Row Style |
|---|---|---|---|
| 8 – 10 | Critical | 🔴 Red | `border-l-4 border-red-600` |
| 6 – 7 | High | 🟠 Orange | `border-l-4 border-orange-500` |
| 4 – 5 | Medium | 🟡 Yellow | `border-l-4 border-yellow-500` |
| 1 – 3 | Low | 🟢 Green | `border-l-4 border-green-500` |

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set **Root Directory** to `backend`
5. Set **Start Command** to `node server.js`
6. Add all environment variables from your `.env`
7. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy

---

## Architecture

CivicSense uses a **Modular Monolith** pattern on the backend. Each feature domain — Auth, Complaints, Admin, Analytics — lives in its own isolated module with its own routes, controller, and service layer. Modules share only the database models and middleware. Every module boundary is a future microservice extraction point.
```
Request → API Gateway (rate limit · CORS · JWT)
        → Domain Module (routes → controller → service)
        → AI Layer (groq.service.js) [complaints only]
        → MongoDB Atlas
        → Response
```

---

## Contributing

This project was built during **CodeCraze 3.0** at RCPIT Shirpur.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Team

**Team Tech_Exchangers — CodeCraze 3.0, RCPIT Shirpur**

| Member | Role |
|---|---|
| Bhushan | Tech Lead · Backend · AI |
| Member 2 | Backend Support · Database |
| Member 3 | Frontend · Citizen Portal |
| Member 4 | Frontend · Admin Dashboard · Presenter |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ at CodeCraze 3.0 · RCPIT Shirpur

**CivicSense** — *Every complaint deserves to be heard.*

</div>