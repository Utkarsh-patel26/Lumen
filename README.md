# 🎓 Course Selling Website Backend (Something like Udemy)

Welcome to the backend of the **Course Selling Platform**!  
This repository powers the **REST APIs** for both the **User** and **Admin** sides of the platform.
If you have doubts about anything like JWT or anything ping me anytime !

---

## 🔧 Backend Setup

### 📁 Folder Structure

---

## 🔐 Authentication

- JWT tokens are issued on both user and admin login.
- Use `Authorization: Bearer <token>` header to access protected routes.
- Made a middleware in middlewares/middleware.js, named VerifyToken\_\_ which verifies token according to the user.

---

## 📦 Features Implemented in Backend

### 👤 User Side

#### Go to user.js in the routes folder.

- `POST /user/signup` – Register a new user.Go to user.js in the routes folder.
- `POST /user/login` – Login user and receive JWT
- `POST /user/course/purchase` – Purchase a course. Sending the course info via req.body.
- `GET /user/purchases` – View all purchased courses

### 🧑‍💼 Admin Side

#### Go to admin.js in the routes folder.

- `POST /admin/signup` – Register a new admin
- `POST /admin/login` – Login admin and receive JWT
- `POST /admin/create-course` – Create a course
- `PUT /admin/update-course` – Edit a course
- `GET /admin/created-courses` – View all courses created by this admin
- `DELETE /admin/delete-course` - To delete a course.

---

### All courses page. Visit courses.js file in routes/

- `GET /courses` – View all courses on the platform.

### ✅ User Side Pages

| Page Name        | Description                                    |
| ---------------- | ---------------------------------------------- | --------------------------------------------------------- |
| 🔐 `User Signup` | Has four fields email, password, name, age     | Form to register user and POST to `/user/signup`          |
| 🔐 `User Login`  | Has two fields email,password                  | Form to login user and POST to `/user/login`, store token |
| 🎓 `Courses`     | Display all available courses (GET `/courses`) |
| 🛒 `My Courses`  | Show purchased courses (GET `/user/purchases`) |

---

### ✅ Admin Side Pages

| Page Name               | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| 📝 `Admin Signup`       | Has four fields email, password, name, age                              | Form to register admin (POST `/admin/signup`)             |
| 📝 `Admin Login`        | Has two fields email,password                                           | Form to login admin and store token (POST `/admin/login`) |
| ➕ `Create Course`      | Form to create course (POST `/admin/create-course`)                     |
| ✏️ `Edit Course`        | Form to edit course (PUT `/admin/update-course`)                        | Dm me before writing code for this feature.               |
| 📄 `My Created Courses` | Display list of courses created by admin (GET `/admin/created-courses`) |

> 🔐 All these pages must send the `Authorization` header with the JWT token after login.

---

## 📌 Environment Variables

```
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

---

## ▶️ Run Backend

```bash
npm install
npm run dev
```

---

## 🧭 New SaaS API Endpoints (Unified Auth)

- `POST /auth/signup` – Signup with role (student/admin)
- `POST /auth/login` – Login and receive unified JWT
- `GET /dashboard/student` – Student dashboard stats (protected, student only)
- `GET /dashboard/admin` – Admin dashboard stats (protected, admin only)
- `POST /enrollments` – Enroll in course (student only)
- `GET /enrollments/me` – Student enrollments
- `GET /enrollments/admin` – Admin enrollments
- `GET /courses` – Public course list with pagination/search
- `GET /courses/:id` – Public course detail
- `POST /admin/courses` – Create course (admin only)
- `PUT /admin/courses/:id` – Update course (admin only)
- `DELETE /admin/courses/:id` – Delete course (admin only)

---

## 🖥️ Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```
