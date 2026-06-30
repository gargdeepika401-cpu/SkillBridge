# SkillBridge — Project Roadmap

> **What is this file?**  
> This is the master plan for the SkillBridge project. It shows what we're building, what's done, and what's coming next.

---

## What is SkillBridge?

An **Online Learning and Mentorship Platform** where:
- **Students** learn from courses and get 1-on-1 help from mentors
- **Mentors** create courses, teach students, and earn money
- **Admins** manage the platform, approve mentors, and monitor everything

---

## What Are We Building? (Core Modules)

| # | Module | What It Does | Status |
|---|--------|--------------|--------|
| 1 | **Authentication** | Sign up, log in, secure access with tokens | ✅ Done |
| 2 | **User Profiles** | Personal profiles, role-specific dashboards | 🔄 Started |
| 3 | **Courses** | Create, browse, and manage courses | ❌ Not started |
| 4 | **Mentorship** | Connect students with mentors | ❌ Not started |
| 5 | **Sessions** | Schedule and join learning sessions | ❌ Not started |
| 6 | **Reviews** | Rate courses and mentors | ❌ Not started |
| 7 | **Certificates** | Earn certificates after completing courses | ❌ Not started |
| 8 | **Admin Panel** | Manage users, content, and analytics | ❌ Not started |
| 9 | **Notifications** | Email and in-app alerts | ❌ Not started |
| 10 | **Payments** | Handle mentor earnings | ❌ Not started |

---

## Development Phases (Step by Step)

### Phase 1 — Foundation ✅ DONE (May 5, 2026)

Everything needed to get the app running with authentication:

- [x] Set up the project (Angular 20 frontend + Express 5 backend + MySQL database)
- [x] Create the `users` database table
- [x] Build the sign-up, login, and "get current user" APIs
- [x] Add security: token verification, rate limiting, error handling
- [x] Build the login and register pages with a modern dark design
- [x] Build dashboards for each role (Student, Mentor, Admin)

### Phase 2 — User Profiles & Courses (Next Up)

- [ ] Profile page — users can view and edit their info
- [ ] Change password feature
- [ ] Create the `courses` database table
- [ ] Build APIs to create, edit, delete, and list courses
- [ ] Course listing page (browse all courses)
- [ ] Individual course page (see course details)
- [ ] Enrollment — students can join courses
- [ ] Mentors can create and edit their own courses

### Phase 3 — Mentorship & Sessions

- [ ] Public mentor profiles (students can browse mentors)
- [ ] Request mentorship from a mentor
- [ ] Schedule sessions with a calendar
- [ ] Manage sessions (view upcoming, cancel, see history)

### Phase 4 — Reviews, Certificates & Notifications

- [ ] Write reviews for courses
- [ ] Rate mentors
- [ ] Auto-generate certificates when a course is completed
- [ ] In-app notification system
- [ ] Email alerts (optional)

### Phase 5 — Admin Panel

- [ ] View all users, ban/activate accounts
- [ ] Approve new courses before they go live
- [ ] Verify mentor accounts
- [ ] Analytics dashboard (charts, stats)
- [ ] Platform settings

### Phase 6 — Testing & Launch

- [ ] Write automated tests (frontend + backend)
- [ ] End-to-end browser testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Set up CI/CD (auto deploy on push)
- [ ] Deploy to production

---

## Key Milestones

| # | Milestone | When | What Users Can Do |
|---|-----------|------|-------------------|
| 1 | Auth Complete | ✅ May 5, 2026 | Sign up, log in, see their dashboard |
| 2 | Courses Live | TBD | Browse courses, enroll, mentors create content |
| 3 | Mentorship Flow | TBD | Book sessions with mentors |
| 4 | Reviews + Certs | TBD | Rate courses, earn certificates |
| 5 | Admin Complete | TBD | Full admin control panel |
| 6 | Production Ready | TBD | Live on the internet, fully tested |

---

## How the App Works (Architecture)

```
┌─────────────────────────────────────────────────┐
│              BROWSER (What users see)            │
│         Angular 20 + Tailwind + Material        │
└────────────────────────┬────────────────────────┘
                         │  Sends/receives JSON data
                         ▼
┌─────────────────────────────────────────────────┐
│              API SERVER (Business logic)         │
│         Node.js + Express 5 (Port 5000)         │
│    Security: Helmet, CORS, Rate Limiter         │
└────────────────────────┬────────────────────────┘
                         │  Reads/writes data
                         ▼
┌─────────────────────────────────────────────────┐
│              DATABASE (Stores everything)        │
│              MySQL (Port 3306)                   │
└─────────────────────────────────────────────────┘
```

**In simple terms:** User's browser talks to our API server, which talks to the database.

---

## Testing Plan

| What We Test | Tool | Examples |
|--------------|------|----------|
| Individual frontend pieces | Jasmine + Karma | Does the login service work correctly? |
| Full user flows in browser | Playwright or Cypress | Can a user sign up and see their dashboard? |
| Individual backend pieces | Jest | Does the register function save a user? |
| Full API requests | Supertest | Does POST /api/auth/login return a token? |

---

## Deployment Plan (How We'll Go Live)

| Part | Where | How |
|------|-------|-----|
| Frontend | Vercel or Netlify | Build the Angular app → upload static files |
| Backend | Railway or Render | Run the Node.js server in the cloud |
| Database | PlanetScale or AWS RDS | Managed MySQL (they handle backups, uptime) |
| Auto-deploy | GitHub Actions | Push code → automatically test → deploy |

---

## Future Ideas (After MVP is Done)

| Feature | What It Would Do |
|---------|------------------|
| Live chat | Real-time messaging between mentor and student |
| Video calls | Join a live video session with your mentor |
| Payments | Pay for courses, mentors earn money (Stripe) |
| Mobile app | Use SkillBridge on your phone |
| AI recommendations | "Based on your progress, try this course next" |
| Dark mode toggle | Switch between light and dark themes |
| Google/GitHub login | Sign in with your existing accounts |
| File uploads | Upload profile photos, course materials |
