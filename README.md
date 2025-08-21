# 📚 Library Management Backend

A backend application for managing a digital library system, built with **Node.js** and **MongoDB**.  
It provides authentication, role-based access (User / Admin), book management, and borrowing features.

---

## 🚀 Features

### 👤 Users
- Register and log in (also via **Google Login**).
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
git clone https://github.com/Marlesk/library-app-backend.git
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
TOKEN_SECRET = your-jwt-secret
GOOGLE_BOOKS_API_KEY = your-google-books-api-key
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
REDIRECT_URI = your-redirect-uri
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
npm test
```

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed by **Maria Leska**.
Feel free to connect or open issues in this repository.
