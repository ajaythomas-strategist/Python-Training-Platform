# TrainMaster Backend Implementation Roadmap

This document provides a highly detailed breakdown of the 35 phases required to migrate the TrainMaster application to a fully functional Node.js + Express + MongoDB backend.

## Module 1: User & Authentication Management (Completed)
This module establishes the foundational security, session handling, and user registry.

* **Phase 1: Build `models/User.js`**
  Design the Mongoose schema for all platform users (SuperAdmin, Admin, Trainer, Co-Trainer, Student). Includes embedded sub-documents for student-specific or trainer-specific profiles, and a pre-save hook that automatically salts and hashes passwords using `bcryptjs`.
* **Phase 2: Create `validations/auth.validation.js` & `middlewares/auth.middleware.js`**
  Implement strict `Joi` validation schemas for login and registration requests to prevent malformed data. Build the `protect` JWT middleware that intercepts incoming requests, verifies the token signature, and attaches the authenticated user to `req.user`.
* **Phase 3: Write `services/auth.service.js` & `services/user.service.js`**
  Build the core business logic. The auth service handles password comparison and JWT token generation. The user service handles CRUD operations like listing users, updating profiles, and resetting passwords.
* **Phase 4: Build `controllers/user.controller.js` & Define Routes**
  Wire the Express routes to the controller functions. Ensure that protected routes use the `auth.middleware.js` and that controllers properly parse HTTP requests and forward them to the services.
* **Phase 5: Update Frontend `Login.jsx` and `UserManagement.jsx`**
  Configure the Vite proxy, connect the Zustand `useStore` to the real `/api/auth/login` endpoint, implement `react-hot-toast` for error handling, and wire the user management dashboard to fetch the real user list.

---

## Module 2: Class Management
This module handles the core organizational unit of the platform: Training Classes (Batches).

* **Phase 6: Build `models/Class.js`**
  Create a Mongoose schema for Classes. Fields will include `className`, `assignedTrainer` (ObjectId reference to User), `coTrainers` (Array of ObjectIds), `assignedLab` (ObjectId reference to Lab), `status` (Active, Completed), and `startDate`.
* **Phase 7: Create `validations/class.validation.js`**
  Write Joi schemas to validate class creation payloads. Ensure that assigning trainers verifies they actually have the "Trainer" role.
* **Phase 8: Write `services/class.service.js`**
  Implement business logic for creating a class, assigning trainers/labs, and retrieving a list of classes. Include logic to prevent double-booking a lab for the exact same active timeframe.
* **Phase 9: Build `controllers/class.controller.js` & Routes**
  Expose RESTful endpoints (`POST /api/classes`, `GET /api/classes`, `PUT /api/classes/:id`). Wrap them in async handlers and apply role-based access control (only Admins/SuperAdmins can create classes).
* **Phase 10: Update `ClassManagement.jsx`**
  Refactor the frontend Class Management tab to fetch real classes from the database instead of the static mock data. Wire up the "Create Class" and "Edit Class" modal forms to the backend.

---

## Module 3: Session Management
This module breaks down Classes into individual chronological time blocks (Sessions).

* **Phase 11: Build `models/Session.js`**
  Create the Mongoose schema. Fields include `classId` (ObjectId), `date` (Date), `startTime` (String), `endTime` (String), and `topicsCovered` (String).
* **Phase 12: Create `validations/session.validation.js`**
  Implement Joi validation ensuring `endTime` is strictly after `startTime` and that valid ISO dates are provided.
* **Phase 13: Write `services/session.service.js`**
  Build logic to schedule new sessions for a specific class, fetch all upcoming sessions for a trainer's dashboard calendar, and handle session cancellations or rescheduling.
* **Phase 14: Build `controllers/session.controller.js` & Routes**
  Expose endpoints like `GET /api/sessions/trainer/:id` to fetch the specific calendar timeline for the currently logged-in user.
* **Phase 15: Update Frontend Calendars and `DashboardOverview.jsx`**
  Connect the dashboard's "Upcoming Sessions" widget to the real backend data so trainers see their exact schedule for the day.

---

## Module 4: Lab Management
This module tracks physical or virtual resources (Labs) where classes take place.

* **Phase 16: Build `models/Lab.js`**
  Create a Mongoose schema for Labs. Fields include `name`, `capacity`, `status` (Available, Under Maintenance), and `assignedAdmin` (ObjectId).
* **Phase 17: Create `validations/lab.validation.js`**
  Write Joi validation to ensure lab names are unique and capacities are positive integers.
* **Phase 18: Write `services/lab.service.js`**
  Implement logic for adding new labs, toggling maintenance modes, and returning availability metrics (e.g., currently occupied vs available).
* **Phase 19: Build `controllers/lab.controller.js` & Routes**
  Map endpoints like `PUT /api/labs/:id/status` to allow quick toggling of lab availability.
* **Phase 20: Update `LabManagement.jsx`**
  Integrate the frontend lab grid with the backend. Ensure the "Set Maintenance" toggle fires a live API request and updates the UI instantly via Toast notifications.

---

## Module 5: Task & Guidelines Management
This module handles dynamic assignments and rules distribution.

* **Phase 21: Build `models/Task.js` & `models/Guideline.js`**
  Create schemas for Tasks (assigned to specific students or batches) and Guidelines (global rules or documents available to specific roles).
* **Phase 22: Create `middlewares/role.middleware.js`**
  Implement an Express middleware (`authorizeRoles('Admin', 'SuperAdmin')`) to strictly guard certain endpoints. For example, only Admins can publish new global Guidelines.
* **Phase 23: Write `services/task.service.js`**
  Implement logic for assigning a task, tracking submission status (Pending, Completed), and attaching trainer grades.
* **Phase 24: Build `controllers/task.controller.js` & Routes**
  Expose endpoints for trainers to create tasks (`POST /api/tasks`) and for students to view their pending tasks (`GET /api/tasks/my-tasks`).
* **Phase 25: Update `Guidelines.jsx`**
  Refactor the frontend to pull guidelines from the database dynamically based on the user's logged-in role.

---

## Module 6: Review & Rating System
This module allows for continuous feedback and performance metrics.

* **Phase 26: Build `models/PerformanceReview.js`**
  Create the schema tracking feedback. Fields include `trainerId`, `reviewerId` (Student or Admin), `rating` (1-5 scale), and `comments`.
* **Phase 27: Create `validations/review.validation.js`**
  Enforce rules preventing users from submitting multiple reviews for the same session to prevent spam. Ensure ratings fall precisely between 1.0 and 5.0.
* **Phase 28: Write `services/review.service.js`**
  Write aggregation pipelines to calculate average ratings dynamically. When a new review is submitted, automatically update the Trainer's global aggregate score on their `User` document.
* **Phase 29: Build `controllers/review.controller.js` & Routes**
  Expose endpoints to submit feedback and retrieve paginated reviews for the admin dashboard.
* **Phase 30: Update `ReviewsAndRatings.jsx`**
  Connect the frontend rating components so students can submit star ratings that immediately reflect in the database.

---

## Module 7: Live Attendance (WebSockets)
This module introduces real-time capabilities to the platform for instant check-ins.

* **Phase 31: Build `models/AttendanceSession.js` & `models/AttendanceRecord.js`**
  Create a schema for an active session (containing a randomly generated 4-digit OTP code and an expiration timestamp) and a schema for logging individual student check-ins.
* **Phase 32: Write Cron Jobs (Optional/Background)**
  Implement a background job that automatically marks an `AttendanceSession` as "Closed" once its expiration time passes.
* **Phase 33: Write `services/socket.service.js` & `services/attendance.service.js`**
  Configure `Socket.io` on the backend. When a student verifies their OTP via the REST API, the attendance service will emit a socket event to the specific trainer's room.
* **Phase 34: Build `sockets/attendance.socket.js`**
  Set up the event listeners where trainers can "join" a room corresponding to their active class, ensuring they only receive check-in blips for their specific session.
* **Phase 35: Update `AttendanceTab.jsx`**
  Connect the frontend Radar animation to Socket.io. When the socket receives a `student_checked_in` event, trigger the visual sonar blip and instantly add the student to the "Present" list without requiring a page refresh.
