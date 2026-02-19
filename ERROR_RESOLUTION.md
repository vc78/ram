# Signup/Login Error Resolution

## Problem Identified

### Root Cause: Backend Server Not Running
The main issue was that **the Python backend server was not running**. When a user tried to sign up or log in:
1. Frontend sent requests to `/api/backend-proxy/auth/signup` or `/api/backend-proxy/auth/login`
2. The proxy route forwarded to `http://127.0.0.1:8002` (the backend)
3. Since backend wasn't running, the request would hang and eventually return a **502 Bad Gateway** error after ~9600ms timeout

### Secondary Issues Fixed

#### 1. **Login Form Design Issue**
- **Problem**: Login page had an unnecessary "Full Name" field
- **Backend Schema**: `UserLogin` only expects `email` and `password`
- **Fix**: Removed the name field from login form
- **File**: `app/login/page.tsx`

#### 2. **Password Validation Mismatch**
- **Problem**: Login form was validating password with strict rules (8+ chars, letters + numbers)
- **Backend**: Login endpoint doesn't care about password format (it only validates hashes)
- **Fix**: Simplified to just check that password is provided
- **File**: `app/login/page.tsx`

#### 3. **Request Timeout**
- **Problem**: Requests could hang indefinitely if backend didn't respond
- **Fix**: Added 10-second timeout to prevent 502 errors from taking too long
- **File**: `app/api/backend-proxy/[...path]/route.ts`

## How to Use

### Start Backend
```bash
cd scripts/backend
venv\Scripts\python run.py
```
Backend will be available at `http://127.0.0.1:8002`

### Start Frontend
```bash
npm run dev
```
Frontend will be available at `http://localhost:3001` (or 3000 if available)

### Test Signup
1. Navigate to `http://localhost:3001/signup`
2. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
3. Click "Create Account"
4. You'll be auto-logged in and redirected to dashboard

### Test Login
1. Navigate to `http://localhost:3001/login`
2. Fill in:
   - Email: `john@example.com`
   - Password: `Password123`
3. Click "Sign In"
4. You'll be redirected to dashboard

## Key Configuration Files

### `.env.local` (Frontend Environment)
```
BACKEND_URL=http://127.0.0.1:8002
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8002
```

### `scripts/backend/.env` (Backend Environment)
```
MYSQL_URL=sqlite+pysqlite:///./test.db
JWT_SECRET=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:3000"]
```

## Files Modified
1. `app/login/page.tsx` - Fixed form fields and validation
2. `app/api/backend-proxy/[...path]/route.ts` - Added request timeout
3. `STARTUP_GUIDE.md` - Created comprehensive startup guide

## Verification
✅ Backend running on `http://127.0.0.1:8002/healthz` - responds with `{"ok":true}`
✅ Frontend running on `http://localhost:3001`
✅ Forms properly configured to match backend schemas
✅ Timeout protection in place to prevent hanging requests

## Common Issues & Solutions

### "fetch failed" error
→ Ensure backend is running with `python run.py`

### Port 3000/3001 already in use
→ Kill the process or start on a different port

### Database errors
→ Delete `test.db` files - they'll be recreated automatically

### 502 Bad Gateway  
→ Check backend is running and accessible on `http://127.0.0.1:8002`
