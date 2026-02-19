# Complete MySQL Backend Setup Guide for SIID FLASH

This guide will walk you through setting up MySQL database backend for your SIID FLASH application after downloading the ZIP file.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Python** (v3.9 or higher) - [Download here](https://www.python.org/downloads/)
3. **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
4. **VS Code** - [Download here](https://code.visualstudio.com/)

---

## 🚀 Step-by-Step Setup

### Step 1: Extract and Open Project

1. Extract the downloaded ZIP file to your desired location
2. Open VS Code
3. Click `File` → `Open Folder` and select the extracted project folder
4. Open the integrated terminal: `View` → `Terminal` or press `` Ctrl + ` ``

---

### Step 2: Install MySQL and Create Database

#### On Windows:
1. Download MySQL Installer from the official website
2. Run the installer and select "Developer Default"
3. Set root password (remember this!)
4. Complete the installation

#### On Mac:
```bash
# Install via Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

#### On Linux (Ubuntu/Debian):
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation
```

#### Create Database:
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE siid_flash;

# Create user (recommended for security)
CREATE USER 'siid_user'@'localhost' IDENTIFIED BY 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON siid_flash.* TO 'siid_user'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit
EXIT;
```

---

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# In VS Code terminal
touch .env.local
```

Add the following content (replace with your MySQL credentials):

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=siid_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=siid_flash

# Backend API URL (Python FastAPI)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 4: Install Frontend Dependencies

In the VS Code terminal, run:

```bash
# Install Node.js dependencies
npm install

# This will install all required packages for Next.js frontend
```

---

### Step 5: Set Up Python Backend

#### Install Python Dependencies:

```bash
# Navigate to backend directory
cd scripts/backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Backend Environment:

Create `.env` file in `scripts/backend/` directory (or copy project root `.env`):

```bash
# In scripts/backend directory
cp .env.example .env
# Then edit `.env` and add your secrets
```

Add the following (sample):

```env
MYSQL_URL=mysql+pymysql://siid_user:your_secure_password@localhost:3306/siid_flash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000
```

#### Optional: Run with Docker Compose 
If you prefer to avoid local Python/MySQL installs, a `docker-compose.yml` is included for the backend.

```bash
# From scripts/backend folder
# Build and start DB + backend
docker-compose up --build

# This will start
# - MySQL 8.0 container (port 3306)
# - FastAPI backend (port 8000)
```

---

### Step 6: Initialize Database Schema

You can initialize the schema using Alembic migrations (preferred) or fallback to the provided SQL script.

- Apply migrations (Alembic):

```bash
# From scripts/backend
# Ensure .env is configured (see Step 5)
python migrate.py  # will run `alembic upgrade head` if Alembic is installed, otherwise calls create_all()
```

- Or run the SQL initialization script directly:

```bash
# From the project root directory
mysql -u siid_user -p siid_flash < scripts/sql/001_init.sql
```

This will create the required tables (users, projects, tasks, contractors, etc.).
---

### Step 7: Seed Sample Data (Optional)

To populate the database with sample data:

```bash
# Make sure you're in the backend directory with venv activated
cd scripts/backend
python seed_sample_data.py
```

---

### Step 8: Start the Backend Server

In a new terminal (keep this running):

```bash
# Navigate to backend directory
cd scripts/backend

# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

Visit `http://localhost:8000/docs` to see the API documentation.

---

### Step 9: Start the Frontend Development Server

In a new terminal (keep the backend running):

```bash
# From project root
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

### Step 10: Verify Connection

1. Open your browser and navigate to `http://localhost:3000`
2. Go to the login page
3. Try to create a new account (Sign Up)
4. Login with your credentials
5. Check the browser console for any errors
6. Verify data is being saved to MySQL

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to MySQL"
**Solution:**
- Verify MySQL service is running: `sudo systemctl status mysql` (Linux) or check Services (Windows)
- Check your credentials in `.env.local` and `scripts/backend/.env`
- Ensure MySQL port 3306 is not blocked by firewall

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
npm install
cd scripts/backend
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Issue: Backend API not responding
**Solution:**
- Check backend terminal for errors
- Verify `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` in `.env.local`
- Restart both servers

---

## 📁 Project Structure After Setup

```
siid-flash/
├── .env.local                      # Frontend environment variables
├── app/                            # Next.js pages
├── components/                     # React components
├── lib/                            # Utility functions
├── scripts/
│   ├── backend/
│   │   ├── .env                   # Backend environment variables
│   │   ├── venv/                  # Python virtual environment
│   │   ├── requirements.txt       # Python dependencies
│   │   ├── app/
│   │   │   ├── main.py           # FastAPI entry point
│   │   │   ├── db.py             # Database connection
│   │   │   ├── models.py         # SQLAlchemy models
│   │   │   ├── schemas.py        # Pydantic schemas
│   │   │   └── routers/          # API endpoints
│   │   └── seed_sample_data.py   # Sample data script
│   └── sql/
│       └── 001_init.sql          # Database schema
└── package.json                   # Node.js dependencies
```

---

## 🧪 Testing the Connection

### Test Backend Directly:

```bash
# Test health endpoint
curl http://localhost:8000/api/v1/health

# Expected response:
{"status":"healthy","database":"connected"}
```

### Run Backend Tests (integration)

```bash
# From scripts/backend
# Ensure your .env points to a test/dev database
pytest -q
```

The tests include a migration + seed idempotency test which expects a reachable MySQL instance configured in `scripts/backend/.env` or via `MYSQL_URL`.

### Test From Frontend:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Login or create an account
4. Check for successful API calls to `http://localhost:8000`

---

## 🔐 Security Notes

**IMPORTANT:** Before deploying to production:

1. Change all passwords and secrets
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Set up proper CORS configuration
5. Use environment-specific `.env` files
6. Never commit `.env` files to Git

---

## 📚 Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Next.js Documentation:** https://nextjs.org/docs
- **MySQL Documentation:** https://dev.mysql.com/doc/
- **SQLAlchemy Documentation:** https://docs.sqlalchemy.org/

---

## 🆘 Getting Help

If you encounter issues:

1. Check the terminal outputs for error messages
2. Review the browser console for frontend errors
3. Check backend logs in the terminal running uvicorn
4. Verify all environment variables are set correctly
5. Ensure both servers (frontend and backend) are running

---

## ✅ Success Checklist

- [ ] MySQL installed and running
- [ ] Database `siid_flash` created
- [ ] `.env.local` file configured
- [ ] `scripts/backend/.env` file configured
- [ ] Node.js dependencies installed (`npm install`)
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Database schema initialized (001_init.sql)
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs
- [ ] Login/Signup works and saves to MySQL
- [ ] Dashboard loads user data from database

---

**You're all set!** 🎉 Your SIID FLASH application is now connected to MySQL backend.
