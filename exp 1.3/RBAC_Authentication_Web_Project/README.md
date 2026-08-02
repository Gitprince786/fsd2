# Role-Based Authentication & Route Protection

A React + Vite project demonstrating JWT Authentication, Role-Based Access Control (RBAC), Protected Routes, Axios Interceptors, and Route Guards.

---

## Features

- JWT Authentication
- Role-Based Access Control (Admin, Editor, Viewer)
- Protected Routes
- Role-Based Routes
- React Context API
- Axios Request Interceptor
- Axios Response Interceptor
- Refresh Token Simulation
- Fake Backend
- Modern Responsive UI
- React Router DOM

---

## Tech Stack

- React
- Vite
- React Router DOM
- Axios
- JavaScript (ES6)
- CSS3

---

## Project Structure

```
role-auth-app
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## Installation

Clone the project

```bash
git clone <repository-url>
```

Move into the project folder

```bash
cd role-auth-app
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:5173
```

---

## Demo Credentials

### Admin

```
Username : admin
Password : admin123
```

### Editor

```
Username : editor
Password : editor123
```

### Viewer

```
Username : viewer
Password : viewer123
```

---

## Project Modules

- Login
- Dashboard
- Admin Panel
- Editor Panel
- Viewer Panel
- Protected Route
- Role Route
- Navbar
- Sidebar
- Logout
- JWT Token
- Axios Interceptors

---

## Authentication Flow

```
Login
   │
   ▼
JWT Token Generated
   │
   ▼
Token Stored in LocalStorage
   │
   ▼
Protected Route Check
   │
   ▼
Role Verification
   │
   ▼
Dashboard
```

---

## User Roles

### Admin

- Manage Users
- View Reports
- Create Users
- Delete Users

### Editor

- Create Posts
- Edit Posts
- Delete Own Posts

### Viewer

- Read Articles
- View Posts

---

## Future Improvements

- Real Backend Integration
- MongoDB
- Express.js API
- JWT from Backend
- Password Hashing
- Refresh Token API
- Dark Mode
- User Profile
- Admin Analytics

---

## Author

Developed using React + Vite for learning Role-Based Authentication and Route Protection.