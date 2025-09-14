# College ERP System

A modern, scalable, and low-cost ERP solution designed for educational institutions. This system streamlines administrative processes like fee collection, hostel allocation, and student management, providing a single source of truth for all college data. Built for the Smart India Hackathon.

---

## ✨ Features

- **Role-Based Access Control:** A secure system with distinct roles and permissions for Students, Hostel Admins, College Admins, and a Super Admin.
- **Automated Fee Management:** A complete module for creating fee structures, tracking payments, and generating real-time payment statuses.
- **Live Hostel Allocation:** An integrated system for students to apply for hostel rooms and for admins to manage room capacity, allocation, and occupancy.
- **Centralized Announcements:** A platform for college administration to broadcast announcements to all students or specific groups.
- **Scalable Architecture:** Built on a modern technology stack designed for performance, security, and maintainability.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Frontend:** React.js (planned)

---

## 🚀 Project Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install backend dependencies:**

    ```bash
    npm install
    ```

3.  **Create the environment variables file:**
    Create a `.env` file in the root directory and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string

    ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
    REFRESH_TOKEN_EXPIRY=10d
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:8000`).

---

## 📝 Backend Next Steps / Roadmap

This is the checklist for building out the backend functionality. The data models are complete and provide a solid foundation for these tasks.

### ✅ Phase 1: Core Infrastructure Setup

- [ ] **Initialize Project Structure:** Create the `/controllers`, `/routes`, `/middlewares`, and `/utils` directories.
- [ ] **Establish Database Connection:** Write the logic in `index.js` or a separate config file to connect to MongoDB using the `MONGODB_URI`.
- [ ] **Create Utility Classes:** Implement reusable classes for standardized API responses and error handling (e.g., `ApiResponse.js`, `ApiError.js`).
- [ ] **Setup Centralized Error Handling:** Create an error handling middleware to catch all errors and send a consistent JSON response.

### ✅ Phase 2: Authentication & User Management

- [ ] **Implement User Registration:** Create the `registerUser` controller and route. Initially, this might be a protected route for an admin to create users.
- [ ] **Implement User Login:** Create the `loginUser` controller and route to authenticate users and issue JWT access and refresh tokens.
- [ ] **Create `verifyJWT` Middleware:** Build the core authentication middleware to protect routes.
- [ ] **Implement Logout:** Create a `logoutUser` controller and route to clear the refresh token from the user's record.
- [ ] **Build User Profile Route:** Create a protected route (`GET /api/v1/users/me`) for authenticated users to fetch their own profile.

### ✅ Phase 3: Feature Implementation (API Endpoints)

- [ ] **Fee & Payment Module:**
  - [ ] `POST /api/v1/fees` (Admin): Create a `FeeStructure`.
  - [ ] `GET /api/v1/payments/due` (Student): View all applicable fees that are unpaid.
  - [ ] `POST /api/v1/payments/initiate` (Student): Endpoint to handle payment initiation with a gateway.
- [ ] **Hostel Module:**
  - [ ] `POST /api/v1/hostel/apply` (Student): Apply for a hostel room.
  - [ ] `GET /api/v1/hostel/applications` (Hostel Admin): View a list of student applications.
  - [ ] `POST /api/v1/hostel/allocate` (Hostel Admin): Implement the core logic to allocate a specific room to a student.
- [ ] **Announcement Module:**
  - [ ] `POST /api/v1/announcements` (College Admin): Create a new announcement.
  - [ ] `GET /api/v1/announcements` (All Users): Fetch all visible announcements.
  - [ ] `DELETE /api/v1/announcements/:id` (College Admin): Delete an announcement.
