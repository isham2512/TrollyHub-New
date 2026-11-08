# Trolly Hub

Trolly Hub is a full stack supermarket management system built with React, Node.js, Express, and MongoDB.

## Live Demo
https://trolly-hub-new.vercel.app/

## Features
- Role-based authentication: Admin, Manager, Employee, Customer
- JWT auth for staff
- Mobile + OTP login flow for customer (mock OTP)
- Product management
- Stock management
- POS / billing
- Orders and bills
- Reports and dashboard analytics
- Responsive green and white UI

## Tech Stack
- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt
- Charts: Recharts

## Folder Structure
- `client/` React frontend
- `server/` Express backend

---

## Local Development

### 1) Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

## Default Demo Credentials
After running the seed command:

- Admin: `admin@trollyhub.com` / `Admin@123`
- Manager: `manager@trollyhub.com` / `Manager@123`
- Employee: `employee@trollyhub.com` / `Employee@123`

### Customer Demo
Use mobile: `9999999999`
Request OTP from customer login page.
Mock OTP response is returned by the API for local development.

---


## Notes
- Customer OTP is implemented as a mock/local flow so it can later be connected to Twilio or another SMS service.
- Billing automatically reduces product stock.
- Reports and dashboards use live database values.
