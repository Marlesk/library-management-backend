# 📚 Library Management Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)](http://localhost:[your-port]/api-docs)

A backend application for managing a digital library system, built with **Node.js** and **MongoDB**.  
It provides authentication, role-based access (User / Admin), book management, and borrowing features.

---

## 🚀 Features

### 👤 Users
- Register and log in (also via **Google Login**).
- Receive a **JWT token** upon successful login for authenticating API requests.
- View all available books in the library.
- Request one book at a time and receive a unique **borrow code**.
- Pick up requested books from the library using the borrow code.
- Borrowing lifecycle:
  - `Request` → `Borrow` → `Return`
- View personal borrowing history.
- View, update profile (email only) and delete account.
- Send messages via the **contact form** (no login required).

### 🛠️ Admin
- Single admin can be created via registration by setting `role: admin` in the request body.
- Dedicated dashboard with the ability to:
  - View, add (manually or via **Google Books API**), edit, and delete books.
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
git clone https://github.com/Marlesk/library-management-backend.git
cd library-management-backend
```
Install dependencies:

``` bash
npm install
```

Run the server:

``` bash
# Development
npm run dev

# Production
npm start
```

## 🔑 Environment Variables

Create a .env file in the root directory and add the following:

``` env
PORT = your-port
API_URI = your-api-uri  # Base URI for the API; used for CORS configuration and Swagger documentation
MONGODB_URI = your-mongodb-uri
MONGODB_URI_TEST = your-mongodb-test-uri
TOKEN_SECRET = your-jwt-secret  # Secret key used to sign JWT tokens for authentication
GOOGLE_BOOKS_API_KEY = your-google-books-api-key
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
REDIRECT_URI = your-redirect-uri # URI where Google redirects after successful authentication
```

## 📖 API Documentation

Full API documentation is available **via Swagger UI**.

After running the server, visit:

``` bash
http://localhost:[your-port]/api-docs
```

## 🧪 Testing

Tests are written with **Jest**.

Run them with:

``` bash 
npm test -- --runInBand
```

## 👩‍💻 Author

Developed by **Maria Leska**.
Feel free to connect or open issues in this repository.
