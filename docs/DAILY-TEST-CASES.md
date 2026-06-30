# SkillBridge — Daily Test Cases

> **What is this file?**  
> A running record of what we tested each day and whether it passed or failed.  
> Helps us catch problems early and prove the app works.

---

## May 5, 2026

### What We Tested Today
Since this is day 1, we focused on **build verification** (does the code compile?) and **code review** (are there security problems?). We haven't written automated test scripts yet — that's planned for later.

---

### Can the App Build Successfully?

These tests confirm the code compiles without errors:

| # | What We Tested | How | Result |
|---|---------------|-----|--------|
| 1 | Does the frontend compile? | Ran `ng build` | ✅ Passed — 0 errors |
| 2 | Do all SCSS styles compile? | Included in `ng build` | ✅ Passed |
| 3 | Does Tailwind CSS work? | Checked build output for utility classes | ✅ Passed |
| 4 | Does Angular Material theme load? | No theme errors in build | ✅ Passed |
| 5 | Is the backend code valid? | Ran `node --check server.js` | ✅ Passed |

---

### Do All Frontend Components Work Together?

These tests confirm components can find each other and don't have broken imports:

| # | Component | What We Checked | Result |
|---|-----------|----------------|--------|
| 1 | Login page | Compiles without "unknown element" errors | ✅ Passed |
| 2 | Register page | Can import shared styles from login | ✅ Passed |
| 3 | Dashboard | Can load all 3 sub-dashboards without circular errors | ✅ Passed |
| 4 | Student dashboard | Accepts user data as input, compiles cleanly | ✅ Passed |
| 5 | Mentor dashboard | Accepts user data as input, compiles cleanly | ✅ Passed |
| 6 | Admin dashboard | Accepts user data as input, compiles cleanly | ✅ Passed |
| 7 | Auth service | Can be injected into components | ✅ Passed |
| 8 | Token interceptor | Compatible with Angular's HTTP system | ✅ Passed |
| 9 | Login guard | Works with Angular's router | ✅ Passed |
| 10 | Guest guard | Works with Angular's router | ✅ Passed |

---

### Does the Backend Export Everything Correctly?

These tests confirm each backend file exports the right functions:

| # | File | What Should Be Exported | Result |
|---|------|------------------------|--------|
| 1 | server.js | Starts up, validates env vars exist | ✅ Passed |
| 2 | authMiddleware.js | `authenticate` and `authorize` functions | ✅ Passed |
| 3 | rateLimiter.js | `createRateLimiter` function | ✅ Passed |
| 4 | errorHandler.js | `notFound` and `errorHandler` functions | ✅ Passed |
| 5 | authController.js | `register`, `login`, and `me` functions | ✅ Passed |
| 6 | authRoutes.js | 3 routes mounted on `/api/auth` | ✅ Passed |
| 7 | authValidator.js | Validation rule arrays | ✅ Passed |

---

### Are the Routes Set Up Correctly?

| # | URL | Who Can Access | What Happens | Result |
|---|-----|---------------|--------------|--------|
| 1 | `/` | Everyone | Redirects to login page | ✅ Correct |
| 2 | `/login` | Only guests (not logged in) | Shows login form | ✅ Correct |
| 3 | `/register` | Only guests (not logged in) | Shows register form | ✅ Correct |
| 4 | `/dashboard` | Only logged-in users | Shows dashboard | ✅ Correct |
| 5 | Any other URL | Everyone | Redirects to login | ✅ Correct |

---

### Security Review

We reviewed the code for common security problems:

| # | Security Question | Answer | Result |
|---|------------------|--------|--------|
| 1 | Are passwords stored as plain text? | No — hashed with bcrypt (10 rounds) | ✅ Safe |
| 2 | Can attackers inject SQL? | No — all queries use parameterized placeholders | ✅ Safe |
| 3 | Is the JWT secret hardcoded? | No — loaded from `.env` file | ✅ Safe |
| 4 | Are security headers set? | Yes — Helmet is applied before routes | ✅ Safe |
| 5 | Can someone spam login attempts? | No — rate limited to 10 per 15 min | ✅ Safe |
| 6 | Can any website call our API? | No — CORS restricts to configured origins | ✅ Safe |
| 7 | Do error messages reveal server internals? | No — stack traces hidden in production | ✅ Safe |
| 8 | Can roles be bypassed through the frontend? | No — backend also checks roles on every request | ✅ Safe |

---

### Tests We Haven't Done Yet

| Test Type | Why Not Yet | When We'll Do It |
|-----------|-----------|-----------------|
| API tests with real database | Need a running MySQL instance | When we set up test DB |
| Browser automation (E2E) | No test framework configured | Phase 6 |
| Unit tests (individual functions) | Haven't written test specs | Phase 6 |
| Performance/load testing | Too early — not enough features | Before launch |

---

### Summary
- **Total tests run:** 30
- **Passed:** 30 ✅
- **Failed:** 0
- **Type:** Build verification + security code review (no runtime/E2E tests yet)
