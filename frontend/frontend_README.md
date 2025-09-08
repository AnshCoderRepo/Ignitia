
# Frontend — Go-Library (React + Tailwind UI)
**Source & repo structure referenced:** anshcoderrepo-ignitia project listing. fileciteturn0file0

## Overview
Frontend is a Create React App project that consumes the backend API to:
- Browse available books
- Borrow / return books (authenticated)
- Admin dashboard to add/update books
- Authentication (login/register) with JWT persisted in `localStorage`

### Tech
- React (functional components + hooks)
- React Router
- Axios (api wrapper)
- Tailwind CSS (utility-first styles)
- Local auth context (`src/context/AuthContext.js`) to manage user & token

## Prerequisites
- Node.js, npm
- Backend running (see `backend/README`)

## Install & Run
1. Open terminal → `cd frontend`
2. Install deps:
```bash
npm install
```
3. Start dev server:
```bash
npm start
```
4. Visit: `http://localhost:3000`

## Key files & folders
- `src/App.js` — router & page wiring
- `src/context/AuthContext.js` — auth provider; fetches profile if token present
- `src/services/api.js` — axios instance (adds `Authorization` header when token exists)
- `src/components/*` — UI components (BookList, BookItem, Login, Register, AdminDashboard, MyBooks, Navbar, etc.)
- `src/index.css` — global styles (Tailwind + custom rules)

## Frontend flow (step-by-step)
1. **User opens app** → `AuthProvider` checks `localStorage.token`:
   - If token exists → calls `/auth/profile` to fetch user (and sets `user` state).
   - If no token → the app renders public pages.
2. **Register** (`/register`):
   - Calls `POST /api/auth/register` with `{name,email,password,role}`.
   - On success stores token and user in localStorage and context.
3. **Login** (`/login`):
   - Calls `POST /api/auth/login` with `{email,password}` → receives token + redirectTo.
   - Save token to localStorage; `AuthProvider` sets user state.
4. **Browse books**:
   - `GET /api/books/available` → BookList shows available books.
5. **Borrow book**:
   - Click borrow → `POST /api/borrow/:id` with Authorization header.
   - On success UI refreshes available books.
6. **Return book**:
   - `POST /api/return/:id` from MyBooks page.
7. **Admin flows**:
   - Admin users can add books `POST /api/books` and update copies `PUT /api/books/:id/copies`.
   - Admin dashboard fetches `GET /api/books/all` (protected + admin-only).

## Configurable values
- API base URL is set in `src/services/api.js` → default `http://localhost:5000/api`.
- To change backend host, update `API_URL` in `api.js` or add env variable and wire it.

## Testing frontend with backend
- Start backend (port 5000) and frontend (3000).
- Register/login users to exercise protected endpoints.
- If CORS issues appear, backend already uses `cors()` middleware; check origins.

## Notes
This README is derived from the repository structure and code. fileciteturn0file0
