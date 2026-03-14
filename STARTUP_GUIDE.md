# Startup and Troubleshooting Guide

## Quick Start

> **Note:** if `npm install` fails with a zod peer-dependency error, bump the `zod` version in `package.json` to `^3.25.76` (already patched) or run with `--legacy-peer-deps`.

### 1. Start the Backend Server
```bash
cd scripts/backend
venv\Scripts\python -c "from app.main import app; from uvicorn import Config, Server; import asyncio; c=Config(app, host='127.0.0.1', port=8002); s=Server(c); asyncio.run(s.serve())"
```

Or simply:
```bash
cd scripts/backend
venv\Scripts\python run.py
```

The backend should be running on `http://127.0.0.1:8002` (or a different port if you set the `BACKEND_PORT` environment variable).

### 2. Start the Frontend Server  
```bash
# install dependencies
npm install
npm run dev
```

The frontend will start on `http://localhost:3000` or `http://localhost:3001` if 3000 is in use.

## Configuration

### .env.local (Frontend)
```
BACKEND_URL=http://127.0.0.1:8002
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8002
```

This file already exists and points to the correct backend port (8002).

### scripts/backend/.env
```
MYSQL_URL=sqlite+pysqlite:///./test.db
JWT_SECRET=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:3000"]
```

## Fixed Issues

### 1. **Login Form**
- ✅ Removed unnecessary "Full Name" field from login form
- ✅ Login now only requires email and password (matches backend schema)
- ✅ Simplified password validation

### 2. **Backend Proxy Timeout**
- ✅ Added 10-second timeout to prevent 502 errors from hanging requests
- ✅ Better error messaging for timeout scenarios

### 3. **Database**
- Uses SQLite (`test.db`) by default for local development
- Database is auto-created if it doesn't exist
- Tables are auto-created on startup

## Testing Signup/Login Flow

1. Go to `http://localhost:3001/signup` (or 3000 if available)
2. Fill in: Name, Email, Password, Confirm Password
3. Click "Create Account"
4. You'll be auto-logged in and redirected to `/dashboard`

## Troubleshooting

### Backend won't start
```bash
cd scripts/backend
venv\Scripts\pip install -r requirements.txt --force-reinstall
```

### "fetch failed" or 502 errors
- Ensure backend is running on `http://127.0.0.1:8002`
- Check `.env.local` has correct `BACKEND_URL`
- Try stopping and restarting both frontend and backend

### Port already in use
- Frontend: If 3000 is used, it automatically tries 3001. You can also specify a different port via `PORT=3002 npm run dev`.
- Backend: The script now reads `BACKEND_PORT` (default 8002). Export a different value or kill the process occupying the port (e.g. `npx kill-port 8002`).

### Database errors
- Delete `test.db` files to reset:
  ```bash
  rm test.db scripts/backend/test.db
  ```
- Database will be recreated on next startup

### Clean install problems
If `npm install` continues to fail after fixing package versions, remove previous modules and lockfile then reinstall.

**Windows** (cmd or PowerShell):
```powershell
rmdir /s /q node_modules
del package-lock.json
# optionally: del pnpm-lock.yaml
npm install --legacy-peer-deps
```

**macOS/Linux**:
```bash
rm -rf node_modules package-lock.json pnpm-lock.yaml
npm install --legacy-peer-deps
```

This ensures you’re running with the updated `package.json` and bypasses peer dependency conflicts.

## Key Files Modified
- `app/login/page.tsx` - Removed name field, simplified validation
- `app/api/backend-proxy/[...path]/route.ts` - Added 10s timeout
- `.env.local` - Backend URL configuration
