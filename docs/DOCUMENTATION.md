# SkillBridge — Project Documentation

> **What is this file?**  
> This is the complete technical guide for the SkillBridge project. It explains how everything works, how to set it up, and how the pieces connect.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Features Built So Far](#features-built-so-far)
5. [Database](#database)
6. [API Reference](#api-reference)
7. [User Roles](#user-roles)
8. [How Authentication Works](#how-authentication-works)
9. [Security Measures](#security-measures)
10. [How to Run the Project](#how-to-run-the-project)
11. [How to Deploy](#how-to-deploy)
12. [Known Issues](#known-issues)
13. [What's Coming Next](#whats-coming-next)

---

## Project Overview

**SkillBridge** is a web app where students learn from mentors through online courses and personal mentoring sessions.

**Three types of users:**
- **Students** — Browse courses, enroll, learn, get certificates
- **Mentors** — Create courses, teach, schedule sessions, earn money
- **Admins** — Manage the whole platform (users, courses, approvals)

---

## Tech Stack

### Frontend (What the user sees)

| Technology | Why We Use It |
|-----------|---------------|
| **Angular 20** | Main framework — builds the pages, handles navigation |
| **TypeScript** | Adds type safety to JavaScript (catches bugs early) |
| **Tailwind CSS 4** | Makes styling fast with utility classes like `bg-blue-500` |
| **Angular Material** | Pre-built UI components (icons, buttons, menus) |

### Backend (Server that handles data)

| Technology | Why We Use It |
|-----------|---------------|
| **Node.js** | Runs JavaScript on the server |
| **Express 5** | Handles HTTP requests (APIs) |
| **MySQL** | Stores all our data (users, courses, etc.) |
| **bcryptjs** | Hashes passwords so they're never stored as plain text |
| **jsonwebtoken (JWT)** | Creates secure login tokens |
| **express-validator** | Checks that user input is valid before processing |
| **helmet** | Adds security headers to all responses |
| **cors** | Controls which websites can talk to our API |
| **morgan** | Logs all requests (helpful for debugging) |
| **dotenv** | Loads secret config from a `.env` file |

### Dev Tools

| Tool | Why We Use It |
|------|---------------|
| **nodemon** | Auto-restarts the server when you save a file |
| **Angular CLI** | Creates components, builds the app, runs dev server |

---

## Folder Structure

```
SkillBridge/
│
├── docs/                    ← You are here! Project documentation
│
├── backend/                 ← Server code (APIs, business logic)
│   ├── server.js            ← Entry point — starts the server
│   └── src/
│       ├── config/db.js     ← Connects to MySQL database
│       ├── controllers/     ← Functions that handle each API request
│       ├── middlewares/     ← Code that runs before/after requests
│       │   ├── authMiddleware.js  ← Verifies login tokens
│       │   ├── errorHandler.js    ← Catches and formats errors
│       │   └── rateLimiter.js     ← Blocks too many requests
│       ├── models/          ← Database queries (read/write data)
│       ├── routes/          ← Defines URL paths → controller mapping
│       └── validators/      ← Input validation rules
│
├── database/
│   └── migrations/          ← SQL files that create tables
│
└── frontend/                ← Browser code (UI, pages)
    └── src/app/
        ├── core/            ← Shared code used across the app
        │   ├── guards/      ← Route protection (logged in? right role?)
        │   ├── interceptors/← Auto-attaches token to API calls
        │   ├── models/      ← TypeScript type definitions
        │   └── services/    ← API communication + state management
        └── pages/           ← Each page the user can visit
            ├── login/       ← Sign-in page
            ├── register/    ← Sign-up page
            └── dashboard/   ← Main dashboard (changes based on role)
                ├── student/ ← Student-specific view
                ├── mentor/  ← Mentor-specific view
                └── admin/   ← Admin-specific view
```

---

## Features Built So Far

### ✅ Working

| Feature | What It Does |
|---------|--------------|
| **Sign Up** | New users can create an account (name, email, password, role) |
| **Log In** | Users sign in with email + password, receive a secure token |
| **Auto-Login** | Token is saved — users stay logged in until they log out |
| **Dashboard** | Each role sees their own dashboard with relevant stats |
| **Route Protection** | Can't visit dashboard without logging in; can't visit login if already signed in |
| **Rate Limiting** | Blocks users who make too many login/register attempts |
| **Input Validation** | Rejects bad data (empty fields, invalid email, short password) |
| **Error Handling** | Shows friendly error messages instead of crashing |

### ❌ Not Built Yet

| Feature | What It Will Do |
|---------|-----------------|
| User Profiles | View and edit your personal information |
| Courses | Create, browse, and enroll in courses |
| Mentorship | Request a mentor, schedule sessions |
| Reviews | Rate courses and mentors |
| Certificates | Earn a certificate after finishing a course |
| Admin Tools | Ban users, approve courses, view analytics |
| Notifications | Get alerts for new messages, sessions, etc. |
| Payments | Mentors earn money for their courses/sessions |

---

## Database

### Current Table: `users`

| Column | Type | Description |
|--------|------|-------------|
| id | INT (auto) | Unique user ID |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(100) | Email (must be unique) |
| password | VARCHAR(255) | Hashed password (never plain text!) |
| role | ENUM | "student", "mentor", or "admin" |
| created_at | TIMESTAMP | When the account was created |
| updated_at | TIMESTAMP | Last time the account was modified |

### Tables We'll Add Later

- **courses** — Course title, description, which mentor created it, price
- **enrollments** — Which student is in which course, their progress
- **sessions** — Scheduled mentoring sessions
- **reviews** — Ratings and comments for courses/mentors
- **certificates** — Issued certificates

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### 1. Register a New User

```
POST /api/auth/register
```

**Send this:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "role": "student"
}
```

**You get back (success):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Rules:**
- Name is required
- Email must be valid and not already taken
- Password must be at least 6 characters
- Role is optional (defaults to "student")

**Possible errors:** `400` (bad input), `500` (server issue)

---

### 2. Log In

```
POST /api/auth/login
```

**Send this:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**You get back (success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Important:** Save the `token` — you need it for all future requests!

**Possible errors:** `400` (bad input), `401` (wrong email/password), `429` (too many attempts)

---

### 3. Get Current User Info

```
GET /api/auth/me
```

**You must include this header:**
```
Authorization: Bearer <your-token-here>
```

**You get back:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Possible errors:** `401` (no token or invalid token), `404` (user deleted)

---

### Rate Limiting

To prevent abuse, auth endpoints allow only **10 requests per 15 minutes** from the same IP address. If exceeded, you get a `429 Too Many Requests` error with a `Retry-After` header telling you when to try again.

---

## User Roles

| Role | What They Can Do |
|------|------------------|
| **Student** | Sign up, browse courses, enroll, attend sessions, earn certificates |
| **Mentor** | Everything a student can do PLUS create courses, manage students, schedule sessions |
| **Admin** | Everything PLUS manage all users, approve mentors, moderate content, view analytics |

---

## How Authentication Works

### Signing Up (Registration)
1. User fills out the form (name, email, password, role)
2. Frontend checks the input is valid
3. Sends data to the backend API
4. Backend checks again, hashes the password, saves to database
5. Returns success → user is redirected to login page

### Logging In
1. User enters email and password
2. Backend finds the user, checks the password hash matches
3. Creates a JWT token (contains user's id, email, role)
4. Sends token + user info back
5. Frontend saves the token in browser storage
6. User is redirected to their dashboard

### Staying Logged In
- Every time the app makes an API request, the token is automatically attached
- The backend verifies the token is valid and not expired
- If valid → request goes through. If not → user is sent to login

### Logging Out
- Token and user data are removed from browser storage
- User is redirected to login page

---

## Security Measures

| What | How | Why |
|------|-----|-----|
| **Password hashing** | bcrypt with 10 salt rounds | Even if database is stolen, passwords can't be read |
| **JWT tokens** | Signed with a secret key, expires in 24h | Proves identity without sending password every time |
| **Rate limiting** | 10 requests per 15 min per IP | Stops brute-force login attempts |
| **Input validation** | Both frontend AND backend check input | Prevents bad data and injection attacks |
| **SQL parameterization** | Uses `?` placeholders in queries | Prevents SQL injection |
| **Helmet headers** | Security headers on all responses | Protects against common web attacks |
| **CORS** | Only allowed origins can call the API | Prevents unauthorized websites from using our API |
| **Error hiding** | Stack traces only shown in development | Attackers can't see internal error details |
| **Role checks** | Both frontend guards AND backend middleware | Even if someone bypasses the UI, the API blocks them |

---

## How to Run the Project

### What You Need Installed
- **Node.js** version 20 or higher → [Download here](https://nodejs.org)
- **MySQL** version 8 or higher → [Download here](https://dev.mysql.com/downloads/)

### Step 1: Set Up the Database
Open MySQL and run:
```sql
CREATE DATABASE skillbridge;
USE skillbridge;

-- Then run the migration file:
SOURCE database/migrations/001_create_users_table.sql;
```

### Step 2: Set Up the Backend
```bash
cd backend
cp .env.example .env
```

Now edit `backend/.env` with your settings:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=skillbridge
JWT_SECRET=pick_any_long_random_string_here
JWT_EXPIRES_IN=24h
```

Then install and run:
```bash
npm install
npm run dev
```
✅ Backend running at http://localhost:5000

### Step 3: Set Up the Frontend
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at http://localhost:4200

### Step 4: Open the App
Go to http://localhost:4200 in your browser. You should see the login page!

---

## How to Deploy

### Frontend
```bash
cd frontend
ng build --configuration production
```
This creates a `dist/` folder with static files. Upload these to **Vercel**, **Netlify**, or any static hosting.

### Backend
```bash
cd backend
# Set NODE_ENV=production in .env
# Use PM2 to keep the server running:
npm install -g pm2
pm2 start server.js --name skillbridge-api
```
Host on **Railway**, **Render**, or any Node.js hosting.

### Database
Use a managed MySQL service like **PlanetScale**, **AWS RDS**, or **Railway MySQL**. Update the DB connection settings in your production `.env`.

---

## Known Issues

| # | Issue | Impact | Workaround |
|---|-------|--------|------------|
| 1 | IDE sometimes shows fake "template not found" errors | None — build works fine | Restart TypeScript Server (Ctrl+Shift+P → "Restart TS Server") |
| 2 | No refresh token — users must re-login after 24h | Minor inconvenience | Will add refresh tokens in future |
| 3 | Rate limiter resets when server restarts | Can be bypassed by restarting | Will use Redis for production |
| 4 | No "forgot password" feature | Users can't recover accounts | Planned for Phase 2 |

---

## What's Coming Next

| Feature | Description |
|---------|-------------|
| Live chat | Real-time messaging between mentor and student |
| Video calls | Join live video sessions with your mentor |
| Payments | Pay for courses, mentors earn money (via Stripe) |
| Mobile app | Use SkillBridge on your phone |
| AI recommendations | "You might like this course" suggestions |
| Dark mode | Switch between light and dark themes |
| Social login | Sign in with Google or GitHub |
| File uploads | Upload profile photos, course materials |
