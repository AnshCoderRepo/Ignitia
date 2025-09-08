
# Backend — Go-Library (TrainX / Ignitia backend)
**Source & repo structure referenced:** anshcoderrepo-ignitia project listing. fileciteturn0file0

## Overview
This Express + MongoDB backend implements authentication (JWT), role-based access control (admin/member), book inventory management, and borrow/return flows for a library app.

### Tech
- Node.js (CommonJS)
- Express
- MongoDB (Mongoose)
- JWT for auth
- bcryptjs for password hashing

## Prerequisites
- Node.js (v16+)
- npm
- MongoDB instance (local or cloud)
- Environment variables (create a `.env` file in `backend/`)

Required `.env` keys:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Install & Run
1. Open terminal → `cd backend`
2. Install deps:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
# or production start
npm start
```
4. Health check: `GET http://localhost:5000/api/health` should return `{ "message": "Server is running" }`.

## File map (key files)
- `server.js` — app entry, routes mounting, DB connect.
- `config/database.js` — mongoose connection helper.
- `models/User.js` — user schema, password hashing, matchPassword().
- `models/Book.js` — book schema, borrowers subdocuments, borrow/return methods.
- `controllers/*` — auth, book, borrow business logic.
- `routes/*` — auth, books, borrow routes.
- `middleware/auth.js` — JWT verify & attach `req.user`.
- `middleware/roleCheck.js` — role-based guard.

## Database Models (summary)
**User**
```json
{
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "admin | member",
  "createdAt": "Date"
}
```

**Book**
```json
{
  "title": "String",
  "author": "String",
  "isbn": "String (unique)",
  "totalCopies": "Number",
  "availableCopies": "Number",
  "borrowers": [
    {
      "user": "ObjectId -> User",
      "borrowDate": "Date",
      "dueDate": "Date",
      "returned": "Boolean",
      "returnDate": "Date"
    }
  ]
}
```

## Important Backend Behaviors
- Passwords are hashed using bcrypt before save.
- `Book` model has methods `.canBorrow(userId)`, `.borrow(userId)`, `.return(userId)` which encapsulate availability and borrower logic.
- `authController.registerUser` prevents creating admin accounts unless `req.user.role === 'admin'` — in dev you may need to create the first admin directly in DB.

## Creating the first admin (dev)
Because the register route checks `req.user` for admin creation, easiest approaches during development:
1. Register a member, then directly update MongoDB:
```js
db.users.updateOne({ email: "you@domain" }, { $set: { role: "admin" } });
```
2. Or insert admin directly (remember to hash password if inserting raw).

## Troubleshooting
- `E11000 duplicate key error` on ISBN/email → unique constraint violation.
- `Not authorized, no token` → missing `Authorization: Bearer <token>` header.
- If DB fails to connect, verify `MONGO_URI` and network access.

## Notes
This README is derived from the repository structure and code. fileciteturn0file0
