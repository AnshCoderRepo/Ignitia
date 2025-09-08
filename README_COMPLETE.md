
# Go-Library (Complete Application) — README
**Repository summary referenced:** anshcoderrepo-ignitia listing. fileciteturn0file0

## Project summary
A full-stack library management application with:
- User authentication (member/admin) and JWT
- Book inventory management (admin)
- Borrow / return workflows for members
- Simple responsive React frontend

---

## Quickstart (end-to-end)
1. Clone repo:
```bash
git clone <your-repo-url>
cd anshcoderrepo-ignitia
```
2. Setup backend:
```bash
cd backend
cp .env.example .env   # create .env and set MONGO_URI, JWT_SECRET
npm install
npm run dev
```
Backend runs on `http://localhost:5000` by default.

3. Setup frontend:
```bash
cd ../frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000` and talks to backend at `/api`.

---

## Environment variables
**backend/.env**
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — optional (defaults to 5000)

**frontend**
- API URL is hardcoded in `src/services/api.js` (`http://localhost:5000/api`); change if necessary.

---

## API Endpoints (Postman-ready)
**Base URL (dev)**: `http://localhost:5000/api`

> Tip: create a Postman environment variable `{{baseUrl}} = http://localhost:5000/api` and `{{token}}` (set after login).
> For protected endpoints add header: `Authorization: Bearer {{token}}`

### Auth
1. **Register**
- `POST {{baseUrl}}/auth/register`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"   // optional, default 'member'. Creating 'admin' is restricted in controller.
}
```
- Success: `201 Created`
```json
{
  "_id":"...","name":"John Doe","email":"john@example.com","role":"member","token":"<jwt>"
}
```
- Errors: `400` (user exists), `403` (creating admin without permissions)

2. **Login**
- `POST {{baseUrl}}/auth/login`
- Body:
```json
{ "email": "john@example.com", "password": "password123" }
```
- Success: `200 OK`
```json
{
  "_id":"...","name":"John Doe","email":"john@example.com","role":"member","token":"<jwt>","redirectTo":"/"
}
```
- Errors: `401` invalid credentials

3. **Get Profile**
- `GET {{baseUrl}}/auth/profile`
- Headers: `Authorization: Bearer {{token}}`
- Success: `200` returns user object (no password)
- Errors: `401` unauthorized

4. **Logout**
- `POST {{baseUrl}}/auth/logout`
- Protected — returns basic success JSON

### Books
5. **Get available books**
- `GET {{baseUrl}}/books/available`
- Public endpoint
- Response: `200` array of books with `availableCopies > 0`

6. **Search books**
- `GET {{baseUrl}}/books/search?query=keyword`
- Public: returns matching available books

7. **Get all books (admin)**
- `GET {{baseUrl}}/books/all`
- Protected: `Authorization: Bearer {{token}}` and admin role
- Response: all books with `borrowers` populated

8. **Get my borrowed books**
- `GET {{baseUrl}}/books/my-books`
- Protected: returns array of borrowed books for current user with `borrowDate` and `dueDate`

9. **Add a book (admin)**
- `POST {{baseUrl}}/books`
- Protected admin
- Body:
```json
{ "title":"...", "author":"...", "isbn":"...", "totalCopies": 3 }
```
- Success: `201` book object

10. **Update book copies (admin)**
- `PUT {{baseUrl}}/books/:id/copies`
- Body: `{ "totalCopies": 5 }`
- Protected admin
- Response: updated book and message

### Borrowing
11. **Borrow a book**
- `POST {{baseUrl}}/borrow/:id`
- Protected: user must be authenticated
- Response: success message and updated book
- Errors: `404` book not found, `400` cannot borrow (no copies or already borrowed)

12. **Return a book**
- `POST {{baseUrl}}/return/:id`
- Protected
- Response: success message and updated book

### Health check
13. **Server health**
- `GET {{baseUrl}}/health`
- Returns `{ "message": "Server is running" }`

---

## Postman Testing Walkthrough (step-by-step)
1. Import requests: create a new collection `Go-Library`.
2. Create environment with `baseUrl = http://localhost:5000/api` and `token = ` (empty).
3. **Register a member** → call `/auth/register`. Save `token` from response to environment variable `{{token}}`.
4. **Login** (if needed) → copy `token` and set env `{{token}}`.
5. Set Authorization header in Postman: `Authorization: Bearer {{token}}`.
6. Test protected endpoints:
   - `GET /auth/profile` — verify user object.
   - `POST /borrow/:id` — borrow a book by id.
   - `GET /books/my-books` — confirm borrow details.
7. Admin flows:
   - If you have admin credentials (or updated role in DB), test `POST /books` and `PUT /books/:id/copies`.
8. Error cases: try borrowing when `availableCopies === 0` to see `400` message.

---

## Security & Notes
- JWT token expiry: 30 days (as configured in `authController.generateToken`).
- Passwords hashed using bcrypt.
- Role-based access enforced by `roleCheck` middleware which expects `req.user.role` to be present (so `protect` must run before role check).
- Be aware: `authController.registerUser` checks `req.user` when creating admin; the route is not protected — to create the first admin you may need to update the DB directly or add a temporary script.

---

## Data Flow — Sequence (simple)
1. User registers → record in `users` collection (password hashed).
2. User logs in → server returns JWT.
3. Frontend stores token in `localStorage` and includes it in `Authorization` header via axios interceptor.
4. User borrows a book → backend updates `book.borrowers` array, decrements `availableCopies`, sets `dueDate`.
5. User returns → backend marks borrower record `returned=true`, sets `returnDate`, increments `availableCopies`.

---

## Deployment notes
- Backend: Deploy to Heroku/Vercel (serverless not ideal because of long-lived DB connections) or any Node hosting with `MONGO_URI` env var.
- Frontend: Build and serve on Netlify/Vercel, ensure API base URL points to deployed backend.
- Use HTTPS in production and rotate `JWT_SECRET`.

---

## Troubleshooting Tips
- CORS errors: backend already uses `cors()`; restrict origins in production using `cors({ origin: 'https://yourdomain' })`.
- 401 errors: ensure `Authorization` header is `Bearer <token>`.
- Duplicate key errors: remove conflicting document or change unique field (isbn/email).
- If borrowers are not populated in `GET /books/all`, ensure `Book.find().populate('borrowers.user', 'name email')` is working and that borrowers contain valid ObjectId refs.

---

## Contributors & License
- Author: Ansh Adarsh — see GitHub repo for more projects. fileciteturn0file0

---

If you'd like, I can:
- Generate a Postman collection JSON file for import (with all requests and env variables).
- Create the actual `README.md`, `backend/README.md`, and `frontend/README.md` files in this workspace for download.
