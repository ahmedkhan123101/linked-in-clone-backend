# LinkedIn Clone — Backend

REST API for the LinkedIn Clone project, built with **Node.js**, **Express** and **MongoDB**. It uses a layered architecture (routes → controllers → services → models), JWT access tokens with a rotating httpOnly refresh-token cookie, and Cloudinary for image uploads.

**Frontend repo:** [LinkedInClone](https://github.com/ahmedkhan123101/LinkedInClone) (React + Vite)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (>= 20.19) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 9 |
| Authentication | JWT + Passport (`passport-jwt`) |
| Password Hashing | bcrypt |
| File Uploads | Multer (memory storage) + Cloudinary |
| Validation | Joi + validator |
| Dev Server | Nodemon |

---

## Features

- Register / login with hashed passwords
- Short-lived access token (sent as `Bearer` header) and refresh token stored in an httpOnly cookie, with rotation on refresh
- Posts with up to 5 images, likes, and comments
- Profile editing: intro, skills, experience, education, avatar
- Connections: send, cancel, accept, ignore, and remove
- Centralized error handling with `ApiError` and `http-status`
- Request validation with Joi

---

## Project Structure

```
linked-in-clone-backend/
├── config/           # Environment config, Passport JWT strategy, token types
├── controllers/      # Route handler logic
├── middlewares/      # auth, validate, upload, error handler
├── models/           # Mongoose schemas (User, Post, Comment, Connection, Token)
├── routes/v1/        # Versioned API routes
├── services/         # Business logic
├── utils/            # ApiError, catchAsync, pick
├── validations/      # Joi schemas
├── app.js            # Express entry point (also opens the MongoDB connection)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.19
- A MongoDB database (local or Atlas)
- A Cloudinary account

### Installation

```bash
git clone https://github.com/ahmedkhan123101/linked-in-clone-backend.git
cd linked-in-clone-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXP_MIN=15
JWT_REFRESH_EXPIRATION_MINUTES=10080
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
NODE_ENV=development
# PORT is optional locally (defaults to 3000); hosts like Railway inject it automatically
```

Set `NODE_ENV=production` when deployed. It turns on `Secure` and `SameSite=None` on the refresh cookie, which is required for a frontend and backend on different domains.

### Running

```bash
npm run dev    # development with nodemon
npm start      # production
```

The server listens on `http://localhost:3000` unless `PORT` is set.

---

## API Overview

All routes are prefixed with `/v1`. Protected routes need `Authorization: Bearer <accessToken>`.

**Auth** (`/v1/auth`)

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Log in |
| POST | `/logout` | Log out (clears refresh cookie) |
| POST | `/refresh-token` | Get a new access token using the refresh cookie |
| GET | `/me` | Current user |
| PATCH | `/me/avatar` | Upload avatar (`image` field) |

**Users** (`/v1/users`)

| Method | Path | Description |
|---|---|---|
| GET | `/` | List other users |
| PATCH | `/me` | Update profile |
| POST | `/me/experience` | Add experience |
| DELETE | `/me/experience/:expId` | Remove experience |
| POST | `/me/education` | Add education |
| DELETE | `/me/education/:eduId` | Remove education |

**Posts** (`/v1/posts`)

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create post (`content`, up to 5 `files`) |
| GET | `/` | Feed (other users' posts) |
| GET | `/my-posts` | Current user's posts |
| PATCH | `/:postId` | Edit own post |
| DELETE | `/:postId` | Delete own post |
| POST | `/:postId/like` | Toggle like |
| GET / POST | `/:postId/comments` | List / add comments |

**Connections** (`/v1/connections`)

| Method | Path | Description |
|---|---|---|
| GET | `/` | All connection records for the current user |
| GET | `/my-connections` | Accepted connections |
| POST | `/request/:recipientId` | Send request |
| PATCH | `/accept/:connectionId` | Accept request |
| DELETE | `/ignore/:senderId` | Ignore incoming request |
| DELETE | `/cancel/:recipientId` | Cancel a sent request |
| DELETE | `/remove/:connectionId` | Remove connection |

---

## Deployment Notes

- Deployed on Railway; the frontend is on Vercel.
- CORS allowed origins are set in `app.js` (localhost on any port plus the Vercel URL). Add your own frontend URL there if it changes.
- The MongoDB Atlas IP allowlist must permit the host's outbound IPs (e.g. `0.0.0.0/0`).

---

Built by [Ahmed](https://github.com/ahmedkhan123101) — MERN Stack Developer
