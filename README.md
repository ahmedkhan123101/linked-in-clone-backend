# LinkedIn Clone — Backend

A RESTful API backend for the LinkedIn Clone project, built with **Node.js** and **Express.js**, following a professional layered architecture with JWT authentication, file uploads, and MongoDB as the database.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Passport.js |
| Password Hashing | bcrypt |
| File Uploads | Multer + Cloudinary |
| Validation | Joi + validator |
| Dev Server | Nodemon |

---

## ✨ Features

- JWT-based authentication with Passport.js strategy
- Secure password hashing with bcrypt
- File/image uploads via Multer, stored on Cloudinary
- Request validation using Joi schemas
- Centralized error handling with `http-status`
- Environment-based configuration with dotenv
- CORS support for frontend integration
- Clean layered architecture (routes → controllers → services → models)

---

## 📁 Project Structure

```
linked-in-clone-backend/
├── config/           # DB connection and Passport config
├── controllers/      # Route handler logic
├── middlewares/      # Auth guards, error handlers, upload middleware
├── models/           # Mongoose schemas (User, Post, etc.)
├── routes/
│   └── v1/           # Versioned API routes
├── services/         # Business logic layer
├── utils/            # Helper utilities (ApiError, catchAsync, etc.)
├── validations/      # Joi validation schemas
├── app.js            # Express app entry point
├── package.json
└── .gitignore
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB instance (local or Atlas)
- Cloudinary account (for media uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/Caseyvlogger/linked-in-clone-backend.git

# Navigate into the project directory
cd linked-in-clone-backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000` (or the port set in `.env`).

---

## 📡 API Overview

All routes are prefixed with `/api/v1`.

| Resource | Base Path |
|---|---|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Posts | `/api/v1/posts` |

> Full API documentation coming soon.

---

## 📦 Dependencies

### Runtime
- `express` — HTTP server framework
- `mongoose` — MongoDB ODM
- `jsonwebtoken` — JWT generation and verification
- `passport` & `passport-jwt` — Authentication middleware
- `bcrypt` — Password hashing
- `multer` & `multer-storage-cloudinary` — File upload handling
- `cloudinary` — Cloud media storage
- `joi` & `validator` — Input validation
- `http-status` — HTTP status code constants
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variable management
- `moment` — Date formatting utilities

### Dev
- `nodemon` — Auto-restart on file changes

---

## 🔗 Related

- **Frontend:** [LinkedInClone](https://github.com/Caseyvlogger/LinkedInClone) — React + Vite frontend

---

> Built by [Ahmed](https://github.com/Caseyvlogger) — MERN Stack Developer
