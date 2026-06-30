# Cognifyz Full Stack Development Internship

This repository contains my submissions for the Cognifyz Technologies Full Stack Development Internship — 8 out of 8 tasks completed across all 4 levels.

---

## Task 1: Developer Feedback Board
**Level 1 - Beginner**

A server-side rendered feedback board built with Node.js, Express, and EJS.

### Features
- Submit feedback with name, category, and message
- Server-side form validation
- Flash messages for success/error feedback
- Color-coded cards by category (Bug, Feature, Idea, Other)
- MVC folder structure
- Fully responsive design

### Tech Stack
- Node.js
- Express.js
- EJS (Embedded JavaScript Templates)
- CSS3

### How to Run
```bash
npm install
node server.js
```
Open http://localhost:3000

---
## Task 2: Inline Styles, Basic Interaction & Server-Side Validation
**Level 1 - Beginner**

Enhanced the feedback board with:
- Email field with regex validation
- Priority field (Low / Medium / High) with color-coded badges
- Real-time client-side validation (inline JavaScript)
- Character counter on message field (0/500)
- Stronger server-side validation (email format, length checks)
- Structured data storage with ID and timestamp

---
## Task 3: Advanced CSS Styling and Responsive Design
**Level 2 - Intermediate**

Personal developer portfolio built with:
- Bootstrap 5 responsive grid
- Interactive particle network (Canvas API + mouse interaction)
- CSS animations (typing effect, scroll fade-in, skill bars)
- Multi-section layout (Hero, About, Skills, Projects, Achievements, Contact)
- Fully responsive across all screen sizes
- Deep navy + coral + cyan + pink color scheme

---
## Task 4: Complex Form Validation and Dynamic DOM Manipulation
**Level 2 - Intermediate**

Multi-step Profile Builder with:
- 3-step client-side routing (no page reload)
- Password strength meter (Weak/Fair/Good/Strong)
- Real-time checklist validation (length, uppercase, number, special char)
- Dynamic DOM manipulation (profile card built live from user input)
- Live skill tag preview as you type
- Confetti animation on profile creation
- Progress bar and step indicators

---

## Tasks 5–8: DevBoard — Developer Task Manager
**Level 3 (Advanced) & Level 4 (Expert)**

A full-stack developer productivity application that grew incrementally across four tasks, each building on the previous layer. One unified Node.js + Express + MongoDB project with a clean front-end, JWT authentication, external API integration, and production-style middleware.

### Task 5: API Integration and Front-End Interaction
**Objective:** Server-client communication through a RESTful API.
- RESTful API endpoints for full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`)
- Front-end interface built with vanilla JS that interacts with the custom API
- Tasks fetched and rendered dynamically on the front end
- MongoDB Atlas (cloud database) used for persistent storage

### Task 6: Database Integration and User Authentication
**Objective:** Integrate a database and implement user authentication for secure data handling.
- MongoDB Atlas integration via Mongoose for storing users and tasks
- User registration and login with hashed passwords (bcrypt)
- JWT-based authentication
- Protected API endpoints — tasks are scoped per authenticated user
- Login/register UI with a landing page

### Task 7: Advanced API Usage and External API Integration
**Objective:** Explore advanced API concepts and integrate external APIs.
- Integrated the GitHub REST API to fetch and display live repo data (avatar, bio, followers, top repos, languages, stars)
- Rate limiting implemented via `express-rate-limit` (100 requests / 15 min)
- Centralized error handling for external API failures (e.g., user not found)

### Task 8: Advanced Server-Side Functionality
**Objective:** Implement advanced server-side features for a robust application.
- Custom logging middleware + Morgan HTTP request logging, written to log files
- Background job scheduling with `node-cron` (daily task summary job)
- Server-side caching with `node-cache` for GitHub API responses (reduces redundant external calls)
- Global error-handling middleware

**Tech Stack (Tasks 5–8)**
- Node.js, Express.js
- MongoDB Atlas, Mongoose
- JWT, bcryptjs
- Axios (GitHub API integration)
- express-rate-limit, morgan, node-cron, node-cache
- Vanilla HTML/CSS/JS front-end

**How to Run**
```
cd Task-6-7-8-DevBoard
npm install
```
Create a `.env` file with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_personal_access_token
```
Then:
```
node server/index.js
```
Open `client/landing.html` with Live Server (or any static server).

---

Built as part of Cognifyz Technologies Full Stack Development Internship.
