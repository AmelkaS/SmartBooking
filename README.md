# 🏫 SmartBooking – Room Reservation System

SmartBooking is a full-stack web application that enables users to reserve lecture rooms and allows administrators to approve or reject these reservations. The system validates room capacity and time conflicts.

---

## ✨ Features

- 🔐 User registration and login with roles: `USER` or `ADMIN`
- 📅 Room reservation with conflict and capacity validation
- ✅ Admin can approve or reject reservations
- 📄 Filterable reservation list with status indicators

---

## 🧱 Architecture

```
[ React + Material UI ] ←→ [ Django REST API + PostgreSQL ]
```

---

## 🚀 Setup Instructions

### ✅ Backend (Django)

1. Go to the `backend` directory.
2. (Optional) Configure `.env` for environment-specific variables.
3. Build and start Docker containers:
   ```bash
   docker compose up --build
   ```
4. In a new terminal, run the Django development server:
   ```bash
   python manage.py runserver
   ```

### ✅ Frontend (React)

1. Navigate to the `ui-app` directory:
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠️ Technologies Used

| Technology     | Reason                                              |
|----------------|-----------------------------------------------------|
| Django         | Robust backend framework with Django REST Framework |
| PostgreSQL     | Reliable, scalable relational database              |
| Docker         | Containerization for easy deployment and isolation  |
| React          | Modern frontend library for building UI             |
| Material UI    | Beautiful, prebuilt components and responsive grid  |
| JWT (Auth)     | Secure, stateless authentication                    |

---

## 👤 User Roles

- **USER** – Can create reservations, see their own bookings and statuses.
- **ADMIN** – Can view all reservations and approve/reject them.

---

## 🔒 Validation Logic

- ✅ End time must be after start time
- ✅ Number of participants cannot exceed room capacity
- ✅ No overlapping reservations allowed

---

## 📂 Folder Structure

```
backend/
├── api/                  # Django app logic
├── backend/              # Django settings and ASGI entry point
└── manage.py

ui-app/
├── src/
│   ├── pages/            # Reservation form, user views, etc.
│   ├── components/       # Navbar, filters, buttons
│   └── utils/            # Axios config and auth interceptors
```

---

## 👨‍💻 Author

Amelia Soszyńska
Developed as part of the course Advanced Technologies in Internet Applications

---
