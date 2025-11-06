# WheelsDoc AutoCare Configuration Guide

## Backend API Configuration

Since this is a browser-based environment, environment variables are handled differently. To configure your backend API URL:

### For Development (Local Backend)

1. Open `/lib/api.ts`
2. Update the `BASE_URL` constant:
   ```typescript
   const BASE_URL = 'http://localhost:5000/api';
   ```

### For Production (Deployed Backend)

1. Open `/lib/api.ts`
2. Update the `BASE_URL` constant to your production backend URL:
   ```typescript
   const BASE_URL = 'https://your-backend-url.com/api';
   ```

## Current Configuration

The app is currently configured to connect to:
- **Development Backend**: `http://localhost:5000/api`

## Testing Without Backend

The application is designed to gracefully handle API errors. You can:
1. Use the login/signup pages (they will show errors without a backend)
2. Mock the API responses by modifying the `apiCall` function in `/lib/api.ts`

## CORS Configuration

Make sure your Express.js backend has CORS enabled:

```javascript
const cors = require('cors');
app.use(cors());
```

Or for production with specific origins:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

## Quick Test

To verify the connection:
1. Start your Express.js backend on port 5000
2. Open browser developer console
3. Try logging in with test credentials
4. Check the Network tab for API calls to `http://localhost:5000/api/auth/login`
