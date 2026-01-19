# Movie App Frontend (React + Material UI)

Frontend for the Movie Web Application.  
It consumes the **Movie API Backend** (your own API) to display movies for users and provide admin-only dashboards for managing movies.

---

## Tech Stack

- **React (Vite)**
- **Material UI (MUI)**
- **React Router DOM**
- **Context API** for auth state
- **Axios** with JWT interceptor
- **localStorage** for token + user persistence

---

## Features

### Public / User
- ✅ Home page: list all movies with pagination
- ✅ Sorting by:
  - Name (`title`)
  - Rating (`rating`)
  - Release Date (`releaseDate`)
  - Duration (`durationMinutes`)
- ✅ Search page: search by movie name or description
- ✅ Responsive UI with MUI components

### Authentication
- ✅ Login (JWT)
- ✅ Signup with validation (server-side + client-side confirmation)
- ✅ Token and user info saved in `localStorage`
- ✅ Auto-attach token to API calls via Axios interceptor

### Admin (Role Based Access)
- ✅ Admin Dashboard page (cards UI)
- ✅ Add Movie page
- ✅ Manage Movies (Edit/Delete)
- ✅ Bulk Upload movies (JSON paste) using queue endpoint (`/movies/bulk`)
- ✅ Protected Routes:
  - User must be logged in
  - User must have role `admin` to access admin pages

---

## Prerequisites

- Node.js **18+**
- Backend running (local or deployed)

---

## Setup & Run Locally

### 1) Install dependencies
```bash
cd frontend
npm install

```

### 2) Set environment variables

Create .env:
```
VITE_API_URL=http://localhost:5000 or your api
```
### 3) Start development server
```
npm run dev
```

## live Demo

 [Preview link](https://gentle-cheesecake-14eead.netlify.app/)
