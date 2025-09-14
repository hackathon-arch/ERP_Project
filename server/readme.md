### works done today :

1. auth routes (register + login + logout) and a protection middleware

2. creation of some users and linking them to the room model + college model + department model

## next steps :

# Phase 2: Fee & Payment Module

- [] **Creating Fee Structure**:
  - [ ] Create a `createFeeStructure` controller for a `college_admin` to define a new fee (e.g., "Semester 3 Lab Fee", amount, due date).
  - [ ] Create the corresponding route: `POST /api/v1/fees/create`.
- [ ] **View Due Fees**:
  - [ ] Create a controller for a logged-in student to see a list of fees they need to pay.
  - [ ] Create the route: `GET /api/v1/payments/due`.
- [ ] **Process a Payment**:
  - [ ] Create a controller that simulates a successful payment. It should create a new document in the `payments` collection linked to the student and the fee structure.
  - [ ] Create the route: `POST /api/v1/payments/pay`.

# Phase 3: Hostel Management Module

- [ ] **Student Application**:
  - [ ] Create a controller for a logged-in student to apply for a hostel. This should update their `hostel_application_status` to `"applied"`.
  - [ ] Create the route: `POST /api/v1/hostel/apply`.
- [ ] **Admin Views Applications**:
  - [ ] Create a controller for a `hostel_admin` to get a list of all students with `hostel_application_status: "applied"`.
  - [ ] Create the route: `GET /api/v1/hostel/applications`.
- [ ] **Admin Allocates Room**:
  - [ ] Create a controller for a `hostel_admin` to allocate an existing, empty room to a student. This must update the `Room` model (add student to `people` array) and the `User` model (update `allocated_room` and `hostel_application_status`).
  - [ ] Create the route: `POST /api/v1/hostel/allocate`.

# Phase 4: Announcement Module

- [ ] **Create Announcement**:
  - [ ] Create a controller for a `college_admin` to post a new announcement.
  - [ ] Create the route: `POST /api/v1/announcements/create`.
- [ ] **View Announcements**:
  - [ ] Create a controller for any logged-in user to see a list of all announcements.
  - [ ] Create the route: `GET /api/v1/announcements`.

# Phase 5: Final Touches

- [ ] **Implement Refresh Token Route**:
  - [ ] Create a controller that handles refreshing the `accessToken` using the `refreshToken`.
  - [ ] Create the route: `POST /api/v1/users/refresh-token`.
- [ ] **Create Helper "Get" Routes**:
  - [ ] Create routes for admins to get lists of data needed for the frontend, such as `GET /api/v1/users/students` (get all students) or `GET /api/v1/hostel/rooms` (get all rooms).

### then we need to start on working for frontend
