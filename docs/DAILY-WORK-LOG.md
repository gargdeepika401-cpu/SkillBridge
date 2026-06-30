# SkillBridge — Daily Work Log

> **What is this file?**  
> A running diary of everything we build or change each day. Updated after every work session.

---

## May 5, 2026

### What We Did Today
Built the entire project foundation from scratch — backend APIs, frontend pages, authentication system, and role-based dashboards.

---

### Backend Work

#### Server Setup
| What Changed | Why | File |
|-------------|-----|------|
| Fixed route ordering (routes now load before server starts) | Routes weren't working because they were registered too late | `backend/server.js` |
| Added environment variable validation | App crashes early with a clear message if config is missing | `backend/server.js` |
| Made CORS configurable via `.env` | Security — only our frontend should be able to call the API | `backend/server.js` |

#### Authentication API (3 endpoints)
| Endpoint | What It Does | File |
|----------|-------------|------|
| `POST /api/auth/register` | Creates a new user account (hashes password, saves to DB) | `authController.js` |
| `POST /api/auth/login` | Verifies credentials, returns a JWT token | `authController.js` |
| `GET /api/auth/me` | Returns the currently logged-in user's info | `authController.js` |

#### Security & Middleware
| What We Added | What It Does | File |
|--------------|-------------|------|
| JWT Middleware | Checks the token on protected routes, blocks unauthorized access | `authMiddleware.js` |
| Role Authorization | Only allows specific roles (e.g., only admins can access admin routes) | `authMiddleware.js` |
| Rate Limiter | Blocks IPs that make too many requests (prevents brute-force attacks) | `rateLimiter.js` |
| Error Handler | Catches all errors and returns clean JSON responses | `errorHandler.js` |
| Input Validator | Rejects requests with missing/invalid fields before they hit the database | `authValidator.js` |

#### Configuration
| What | File |
|------|------|
| Created `.env.example` template with all required variables documented | `backend/.env.example` |

---

### Frontend Work

#### Authentication System (invisible to users, but essential)
| What We Built | What It Does | File |
|--------------|-------------|------|
| Auth Service | Manages login state, talks to backend, stores token | `auth.service.ts` |
| Auth Interceptor | Automatically attaches the token to every API request | `auth.interceptor.ts` |
| Auth Guard | Blocks non-logged-in users from accessing the dashboard | `auth.guard.ts` |
| Guest Guard | Blocks logged-in users from seeing login/register (redirects to dashboard) | `auth.guard.ts` |
| Route Config | Defines all page URLs and which guards protect them | `app.routes.ts` |

#### Pages Built
| Page | What It Looks Like | Files |
|------|-------------------|-------|
| **Login** | Dark glassmorphism design with animated gradient orbs, floating particles, custom inputs | `login.ts`, `login.html`, `login.scss` |
| **Register** | Same design as login + name field + role picker (student/mentor cards) | `register.ts`, `register.html`, `register.scss` |
| **Dashboard** | Sidebar navigation + top bar with user info + role-specific content area | `dashboard.ts`, `dashboard.html`, `dashboard.scss` |
| **Student View** | Stats (enrolled, completed, hours, certificates) + course panels | `student-dashboard.ts/html/scss` |
| **Mentor View** | Stats (students, courses, rating, earnings) + schedule panels | `mentor-dashboard.ts/html/scss` |
| **Admin View** | Stats (users, mentors, courses, sessions) + management panels | `admin-dashboard.ts/html/scss` |

#### Styling & Configuration
| What | Why | Files |
|------|-----|-------|
| Set up Tailwind CSS v4 | Fast utility-based styling | `.postcssrc.json`, `tailwind.css` |
| Set up Angular Material | Pre-built components (icons, etc.) | `styles.scss`, `angular.json` |
| Shared dashboard styles | Consistent look across all 3 role dashboards | `_shared-dashboard.scss` |

---

### Bug Fixes

| Problem | What We Did | File |
|---------|------------|------|
| Tailwind `@apply` didn't work in component SCSS files | Switched to plain CSS in components (Tailwind only in templates) | Various `.scss` files |
| Missing `@angular/animations` package | Installed it | `package.json` |
| Sass `random()` function deprecated warning | Replaced with `math.random()` using `@use 'sass:math'` | `login.scss` |
| IDE "too many files open" warning | Added watcher exclusions in VS Code settings | `.vscode/settings.json` |
| `rootDir` TypeScript warning | Added `"rootDir": "./src"` to tsconfig | `tsconfig.app.json` |

---

### End-of-Day Status
- ✅ Frontend builds successfully (`ng build` — 0 errors)
- ✅ Backend starts successfully (`node server.js` — needs `.env` + MySQL)
- ✅ All pages designed and functional (login, register, dashboard)
