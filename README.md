# MyMech Autocare

Automobile service management system with real-time tracking and role-based dashboards.

## Installation

```bash
# Clone repository
git clone https://github.com/Renuja-7671/MyMechAutocare.git
cd automobile-service-system

# Install frontend
cd ../frontend
npm install
```

## Setup

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash

# Terminal 2 - Frontend
cd frontend
npm run dev
```
If the frontend is running on port 5173, 
Then visit: `http://localhost:5173`

## Test Accounts

- Customer: john.doe@email.com / password123
- Employee: mike.johnson@autoservice.com / password123
- Admin: admin@autoservice.com / password123

## Tech Stack

React, Node.js, Express, PostgreSQL, Prisma