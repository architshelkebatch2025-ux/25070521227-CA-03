# 📚 Smart Library Management System

A complete, full-stack, beginner-friendly **Smart Library Management System** built for the 2nd-year BTech Computer Science practical examination and Continuous Assessment (CA-03).

---

## 🌟 Tech Stack

* **Frontend**: React.js (JavaScript, HTML5, CSS3)
* **Build Tool**: Vite
* **Routing**: React Router DOM (v6)
* **API Client**: Native `fetch` API
* **Backend**: Node.js & Express.js
* **Database**: MongoDB (via Mongoose ODM)
* **Database GUI**: MongoDB Compass
* **Authentication**: JSON Web Tokens (JWT) & bcrypt password hashing

---

## 📖 The 4 Main Webpages

1. **Signup Page (`/signup`)**:
   - Collects Full Name, Email, Password, and Confirm Password.
   - Client and server-side validation (matching passwords, email format, minimum length).
   - Hashes passwords using `bcrypt` (10 salt rounds) before storing in MongoDB.
   - Redirects to Login page upon successful registration.

2. **Login Page (`/login`)**:
   - Validates email and password against MongoDB bcrypt hash.
   - Generates a signed JWT token on successful authentication.
   - Stores session securely in `localStorage` and redirects to Dashboard.
   - Protects inner routes against unauthorized access.

3. **Home / Dashboard (`/`)**:
   - Displays a personalized welcome banner with the logged-in student's name.
   - Real-time statistics cards: **Total Books**, **Available Books**, and **Issued Books** fetched live from `GET /api/books/count`.
   - Featured books collection carousel/grid fetched from `GET /api/books/featured`.
   - Quick action buttons to jump to the Books Library or Logout.

4. **Books Library (`/books`)**:
   - Displays the complete book catalog with category tags and availability status badges.
   - Real-time search bar to filter books by **Title**, **Author**, or **Category**.
   - Interactive category filter pills (All, Computer Science, Software Engineering, etc.).
   - **"📖 Issue Book"** button: Authenticated users can issue an available book with one click (`PUT /api/books/:id/issue`).
   - Server-side availability validation prevents double-issuing.
   - **"↩️ Return Book"** button for quick demonstration during viva examination.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Protected (JWT) |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new student account | No |
| `POST` | `/api/auth/login` | Verify credentials & issue JWT token | No |
| `GET` | `/api/books` | Retrieve books (supports `?search=query`) | No |
| `GET` | `/api/books/count` | Total count & status breakdown | No |
| `GET` | `/api/books/featured` | Returns 4 featured books for Dashboard | No |
| `PUT` | `/api/books/:id/issue` | Issue available book to logged-in user | **Yes** |
| `PUT` | `/api/books/:id/return`| Return issued book back to library | **Yes** |

---

## 🚀 How to Run the Project (Step-by-Step)

### Prerequisites
- Node.js (v18+)
- MongoDB Compass (optional, for viewing database records visually)

### 1. Start the Backend Server (Terminal 1)
```powershell
cd server
npm install
node server.js
```
* The backend starts at: **`http://localhost:5000`**
* MongoDB database connects automatically at: **`mongodb://127.0.0.1:27017/smart_library`**
* Built-in fallback engine automatically initializes port 27017 if local MongoDB service is not started.
* Seeds initial sample textbooks automatically if collection is empty.

### 2. Start the Frontend React Client (Terminal 2)
```powershell
cd client
npm install
npm run dev
```
* Open your browser at: **`http://localhost:5173`**

---

## 🧭 Inspecting Database with MongoDB Compass

1. Open **MongoDB Compass**.
2. In the "New Connection" field, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. You will see the **`smart_library`** database containing:
   - **`users`** collection: Stores user accounts with bcrypt-hashed passwords.
   - **`books`** collection: Stores textbooks with availability status and issued user references.

---

## 🧪 Testing Checklist for Practical Exam

1. **User Registration**:
   - Go to `http://localhost:5173/signup`.
   - Register a user (e.g. `alex@college.edu`, password `secret123`).
   - Verify success message and redirection to `/login`.
   - In MongoDB Compass, open `smart_library -> users` to verify the user is saved with a hashed password (starts with `$2a$10$...`).
2. **User Login**:
   - Enter invalid password: confirm error message *"Invalid email or password"*.
   - Enter correct credentials: confirm login redirect to Dashboard.
3. **Dashboard Real-Time Stats**:
   - Confirm welcome banner displays your name.
   - Verify total book count shows 10+ books from MongoDB.
4. **Search and Filter**:
   - Go to Books Library (`/books`).
   - Type `"Clean Code"` or `"Tanenbaum"` into search bar: confirm instant live filtering.
5. **Issue Book**:
   - Click **"📖 Issue Book"** on any available textbook.
   - Confirm success alert: *"has been issued to you successfully!"*.
   - Confirm button flips to *"❌ Not Available (Issued)"*.
   - In MongoDB Compass, verify the document's `available` field is now `false` and `issuedBy` holds the user's ObjectId.
6. **Logout & Route Protection**:
   - Click **Logout**.
   - Try navigating directly to `http://localhost:5173/books`: confirm automatic redirect to `/login`.

---

## 🎓 Viva Voce Preparation (15 Questions & Answers)

**Q1: What architecture does this project use?**  
**A:** MERN Architecture (MongoDB, Express.js, React.js, Node.js). React handles the client UI, Express runs the REST API server, and MongoDB stores persistent data.

**Q2: What is Vite and why use it over Create-React-App?**  
**A:** Vite is a modern frontend build tool that uses native ES modules. It provides near-instant server start and extremely fast Hot Module Replacement (HMR).

**Q3: How are passwords secured in the database?**  
**A:** Passwords are never stored in plain text. We use `bcryptjs` to generate a 10-round salt and produce a one-way cryptographic hash before saving to MongoDB.

**Q4: What is JWT (JSON Web Token) and how does it work?**  
**A:** JWT is a compact, URL-safe token containing three parts: Header, Payload (e.g. user ID, name), and Signature. Upon login, the server signs the token using a secret key. The client includes this token in the `Authorization: Bearer <token>` header for protected requests.

**Q5: How does the backend verify if a user is authenticated?**  
**A:** Through custom Express middleware (`authMiddleware.js`). It reads the `Authorization` header, verifies the token using `jwt.verify()`, extracts user details into `req.user`, and calls `next()`.

**Q6: What is Mongoose?**  
**A:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, and query building.

**Q7: How is the book issuing concurrency issue handled?**  
**A:** In the `PUT /api/books/:id/issue` endpoint, the server explicitly queries MongoDB to verify `available === true`. If already issued, the request is rejected with HTTP 400, preventing duplicate issuance.

**Q8: What is CORS and why is it needed?**  
**A:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism. Since the frontend runs on port `5173` and backend on port `5000`, the backend uses the `cors()` middleware to allow cross-origin HTTP requests.

**Q9: Why use the Fetch API instead of Axios?**  
**A:** The Fetch API is built natively into modern JavaScript and browsers, eliminating the need for external third-party HTTP libraries while keeping the codebase lightweight.

**Q10: What is the difference between SQL and NoSQL?**  
**A:** SQL databases (e.g. MySQL) are relational, table-based, and enforce rigid schemas. NoSQL databases (e.g. MongoDB) store JSON-like documents, offering schema flexibility and horizontal scalability.

**Q11: Where is the JWT token stored on the client side?**  
**A:** In browser `localStorage`. In high-security banking apps, `httpOnly` secure cookies are preferred to mitigate XSS attacks; for academic projects, `localStorage` is standard and accessible to JavaScript.

**Q12: What HTTP status codes are used?**  
**A:** `200 OK` (success), `201 Created` (user registered), `400 Bad Request` (validation error / book unavailable), `401 Unauthorized` (missing/invalid JWT), `404 Not Found` (item not found), and `500 Internal Server Error`.

**Q13: How does React Router protect routes?**  
**A:** In `App.jsx`, conditionally checks whether the `token` state exists. If not, renders `<Navigate to="/login" replace />`.

**Q14: What is the purpose of `seedBooks.js`?**  
**A:** A database initialization script that populates the MongoDB `books` collection with 10+ standard computer science textbooks while preventing duplicate entries on repeated executions.

**Q15: How can a teacher or examiner check data in MongoDB Compass?**  
**A:** Open MongoDB Compass, connect to `mongodb://127.0.0.1:27017`, select the `smart_library` database, and inspect documents in the `users` and `books` collections.
