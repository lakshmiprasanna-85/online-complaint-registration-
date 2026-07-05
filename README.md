# ResolveHub — Complaint Management System

A full-stack **MERN** application for complaint handling with role-based dashboards, real-time chat, feedback, and admin analytics.

![Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Stack](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## Features

- **User Registration & JWT Authentication** — Secure login with bcrypt password hashing
- **Complaint Submission & Tracking** — Create, view, and track complaint status
- **Agent Assignment Workflow** — Admins assign agents; agents update progress
- **Real-time Chat** — Socket.io messaging between users and agents
- **Feedback System** — Star ratings and comments after resolution
- **Admin Analytics Dashboard** — Charts, stats, user/agent management
- **Role-Based Access** — USER, AGENT, ADMIN with protected routes
- **100% Free Stack** — No paid services required (MongoDB local, MUI, Recharts, Socket.io)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Material UI, Axios, React Router, Recharts, React Toastify, Socket.io Client |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, Helmet, CORS, Morgan, express-validator, Nodemailer |
| Database | MongoDB |

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Community Server](https://www.mongodb.com/try/download/community))
- **npm**

## Quick Start

### 1. Clone & install

```bash
cd backend
npm install
cp .env.example .env   # Edit MONGODB_URI and JWT_SECRET

cd ../frontend
npm install
cp .env.example .env
```

### 2. Start MongoDB

Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`

### 3. Seed demo data (optional)

```bash
cd backend
npm run seed
```

### 4. Run the app

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@resolvehub.com   | admin123  |
| Agent | agent@resolvehub.com   | agent123  |
| User  | user@resolvehub.com    | user123   |

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user/agent |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Auth | Current user |
| POST | `/api/complaints` | User | Create complaint |
| GET | `/api/complaints/my` | User | My complaints |
| GET | `/api/complaints/agent` | Agent | Assigned complaints |
| GET | `/api/complaints` | Admin | All complaints |
| PUT | `/api/complaints/:id/assign` | Admin | Assign agent |
| GET/POST | `/api/messages/:complaintId` | Auth | Chat messages |
| POST | `/api/feedback/:complaintId` | User | Submit feedback |
| GET | `/api/admin/stats` | Admin | Dashboard analytics |

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resolvehub
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional — email notifications (skipped if not set)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, validation, errors
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Email, seed, JWT
│   └── server.js       # Entry point + Socket.io
├── frontend/
│   └── src/
│       ├── components/ # Reusable UI
│       ├── context/    # Auth & Complaint state
│       ├── pages/      # Route pages
│       ├── services/   # API & Socket
│       └── theme/      # MUI theme
└── README.md
```

## Security

- JWT bearer token authentication
- bcrypt password hashing (12 rounds)
- Helmet HTTP headers
- CORS configuration
- Role-based route protection
- express-validator input validation
- MongoDB indexes on email, status, and frequently queried fields

## License

ISC — Free for educational and personal use.
