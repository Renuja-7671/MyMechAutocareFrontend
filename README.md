# MyMech Autocare - Automobile Service Time Logging & Appointment System

A complete React frontend for an enterprise web application that digitalizes automobile service center operations with three main user roles: Customer, Employee, and Administrator.

## Features Implemented

### Authentication & Authorization
- JWT-based authentication with localStorage storage
- Role-based protected routes (Customer, Employee, Admin)
- Login and registration pages with form validation
- Employee registration (admin-only)

### User Roles & Dashboards

#### Customer
- Dashboard with profile information and quick actions
- Appointment management (book, view, track progress)
- Vehicle management
- Service history tracking
- Real-time notifications

#### Employee
- Dashboard with task assignments and work logs
- Service progress tracking and updates
- Time logging functionality
- Real-time messaging with customers
- Work history tracking

#### Administrator
- System overview dashboard with analytics
- User management (CRUD operations)
- Service management
- Performance reports
- Audit logs
- System status monitoring

### Core Functionality
- Real-time WebSocket communication for service updates
- AI Chatbot with conversation history
- Toast notifications for user feedback
- Responsive design for mobile and desktop
- Loading states and error handling
- Service booking and management
- Profile management

### Technical Implementation
- React with Vite
- React Router v6 for navigation
- Bootstrap 5 for UI components
- Context API for state management
- Axios for HTTP requests
- Socket.io-client for real-time communication
- React Hook Form for form validation
- React Hot Toast for notifications

## Folder Structure
```
src/
├── api/                 # API service files
├── components/          # Reusable UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── utils/               # Utility functions
├── views/               # Dashboard views
├── App.jsx             # Main app component
├── main.jsx            # Entry point
├── router.jsx          # Router configuration
└── index.css           # Global styles
```

## API Endpoints Integrated
- Authentication: `/api/auth/register`, `/api/auth/login`
- User Profile: `/api/user/me`
- Customer: `/api/customer/appointments`, `/api/customer/modification`
- Employee: `/api/employee/services`, `/api/employee/logs`, `/api/employee/update/:id`
- Admin: `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/services`, `/api/admin/reports`
- Chatbot: `/api/chatbot/query`
- Notifications: `/api/notifications`

## Real-time Features
- Service status updates via WebSocket
- Live chat messaging
- Real-time notifications
- Progress tracking

## Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technologies Used
- React 18+
- React Router v6
- Bootstrap 5
- Socket.io-client
- Axios
- React Hot Toast
- React Icons