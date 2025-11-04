# Tournament Championship Manager (TCM)

## Project Location
**New Location**: D:\TCM\tournament_app

## Directory Structure
`
D:\TCM\tournament_app\
 backend/          # Django backend
    venv/         # Python virtual environment
    manage.py     # Django management script
    .env          # Environment variables
    ...
 frontend/         # React frontend
     src/
     package.json
     ...
`

## Running the Application

### Backend (Django)
1. Open PowerShell
2. Navigate to backend:
   `powershell
   cd D:\TCM\tournament_app\backend
   `
3. Start the server:
   `powershell
   .\venv\Scripts\python.exe manage.py runserver
   `
4. Backend will run on: http://127.0.0.1:8000/

### Frontend (React + Vite)
1. Open a new PowerShell terminal
2. Navigate to frontend:
   `powershell
   cd D:\TCM\tournament_app\frontend
   `
3. Start the development server:
   `powershell
   npm run dev
   `
4. Frontend will run on: http://localhost:3002/ (or next available port)

## Database Configuration
- **Database**: PostgreSQL
- **Database Name**: tournament_db
- **User**: postgres
- **Password**: postgres (configured in .env file)

## Admin Credentials
- **Superuser**: ram2310 / TempPass#2025
- **Test Admin**: Ravi / Test@1234

## API Configuration
- Backend API: http://127.0.0.1:8000/api
- WebSocket: ws://127.0.0.1:8000

## User Roles
1. **DIRECTOR/Admin** - Full tournament management access
2. **CAPTAIN** - Team captain privileges
3. **PLAYER** - Player registration and participation
4. **VOLUNTEER** - Event volunteer access
5. **SCORING** - Scoring and results management
6. **SPONSOR** - Sponsor information access
7. **FAN** - Public viewing access

## Quick Start
`powershell
# Start both servers with one command
# Terminal 1 - Backend
cd D:\TCM\tournament_app\backend ; .\venv\Scripts\python.exe manage.py runserver

# Terminal 2 - Frontend  
cd D:\TCM\tournament_app\frontend ; npm run dev
`

## Status
 Backend running on port 8000
 Frontend running on port 3002
 Database connected (tournament_db)
 Role-based authentication configured

---
**Last Updated**: November 4, 2025
