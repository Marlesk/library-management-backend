# 📚 Library Management Backend

A backend application for managing a digital library system, built with **Node.js** and **MongoDB**.  
It provides authentication, role-based access (User / Admin), book management, and borrowing features.

---

## 🚀 Features

### 👤 Users
- Register and log in.
- View all available books in the library.
- Request one book at a time and receive a unique **borrow code**.
- Pick up requested books from the library using the borrow code.
- Borrowing lifecycle:
  - `Request` → `Borrow` → `Return`
- View personal borrowing history.
- View and update profile (email only).

### 🛠️ Admin
- Single admin user (must be created directly in the database).
- Dedicated dashboard with the ability to:
  - Add, edit, and delete books (manually or via Google Books API).
  - View all users and delete accounts if necessary.
  - Manage borrowing requests:
    - Approve requests with a **borrow code**.
    - Update status from `Request` → `Borrow`.
    - Update status from `Borrow` → `Return` (via ISBN).
  - View messages submitted through the contact form.

---

## 🧰 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Google Books API**
- **Swagger (API Documentation)**

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/library-management-backend.git
cd library-management-backend
npm install
npm run dev
npm start
npm test
```