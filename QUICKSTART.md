# ResumeMaker - Quick Start Guide

Get the Resume Maker application running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 16+ installed (`node --version`)
- [ ] PostgreSQL running locally or remote connection ready
- [ ] Cloudinary account (free: https://cloudinary.com)
- [ ] Google Gemini API key (free: https://ai.google.dev)

## Step 1: Set Up Backend

```bash
cd backend

# Copy example env file
cp .env.example .env.development

# Edit .env.development with your credentials
# - DATABASE_URL: Your PostgreSQL connection string
# - JWT_SECRET: Any random string (e.g., "dev-secret-123")
# - CLOUDINARY_URL: Get from Cloudinary dashboard
# - GEMINI_API_KEY: Get from Google AI Studio
```

### Initialize Database

```bash
# Make sure PostgreSQL is running and database exists
# Run migrations and generate Prisma client
npm run prisma:migrate
npm run prisma:generate
```

### Install & Start Backend

```bash
npm install
npm run dev
# Backend running at http://localhost:4000
```

## Step 2: Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Check .env file
# Should have: VITE_API_URL=http://localhost:4000/api
```

### Start Frontend

```bash
npm run dev
# Frontend running at http://localhost:5173
```

## Step 3: Test the App

1. Open http://localhost:5173 in your browser
2. Click "Sign up" and create an account
3. Try these features:
   - **Create Resume**: Click "+ Create Resume" on dashboard
   - **Upload Resume**: Click "📤 Upload Resume" and select a PDF/DOCX file
   - **Edit**: Add personal info and skills
   - **Preview**: Click "Preview" to see PDF

## Troubleshooting

### "Cannot find module 'react-router-dom'"
```bash
cd frontend
npm install
```

### "connection refused" (Database error)
```bash
# Start PostgreSQL:
# macOS: brew services start postgresql
# Windows: Start PostgreSQL service
# Linux: sudo systemctl start postgresql

# Verify connection string in .env.development
```

### "Cannot POST /api/resumes" (Backend not running)
```bash
cd backend
npm run dev
# Check console output for errors
```

### Cloudinary upload fails
- Verify CLOUDINARY_URL format in `.env.development`
- Format: `cloudinary://api_key:api_secret@cloud_name`
- Get from https://cloudinary.com/console

### "401 Unauthorized"
- Ensure token is in localStorage
- Try clearing browser storage and logging in again

## Getting Credentials

### Cloudinary
1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Dashboard → Settings → API Key
4. Copy full Cloudinary URL from "API Environment variable"

### Google Gemini API
1. Go to https://ai.google.dev/
2. Click "Get API Key" → "Create API Key in new project"
3. Copy the API key

### PostgreSQL Connection String
**Local:**
```
postgresql://localhost/resumemaker_dev
```

**Remote (AWS RDS example):**
```
postgresql://user:password@your-db.rds.amazonaws.com:5432/resumemaker_dev
```

## File Upload Testing

Use these test files or create your own:

**PDF Format:**
- Simple text-based resume in PDF

**DOCX Format:**
- Microsoft Word .docx resume

**Upload limits:**
- Max file size: 10MB
- Supported: PDF, DOCX only

## Next Steps

- [ ] Explore all templates in Preview
- [ ] Test AI enhancement: Edit → Add text → See suggestions
- [ ] Download generated PDFs
- [ ] Invite users by sharing login page
- [ ] Read full README.md for deployment info

## Common Tasks

### Reset Database
```bash
cd backend
# Caution: This deletes all data!
npx prisma db push --force-reset
npm run prisma:migrate
```

### View Database
```bash
cd backend
# Open Prisma Studio
npx prisma studio
# Opens at http://localhost:5555
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Output: dist/ folder (ready to deploy)

# Backend
cd backend
npm run build
npm start
```

## Architecture Overview

```
User (Browser)
    ↓
Frontend (React/Vite) → http://localhost:5173
    ↓
API Client (Axios) → http://localhost:4000/api
    ↓
Backend (Express/TypeScript)
    ↓
PostgreSQL (Database) + Cloudinary (Storage)
    ↓
Google Gemini (AI)
```

## Environment Variables

| Variable | Where | Example |
|----------|-------|---------|
| `VITE_API_URL` | frontend/.env | `http://localhost:4000/api` |
| `DATABASE_URL` | backend/.env.development | `postgresql://localhost/resumemaker_dev` |
| `CLOUDINARY_URL` | backend/.env.development | `cloudinary://key:secret@cloud` |
| `GEMINI_API_KEY` | backend/.env.development | `AIza...` |
| `JWT_SECRET` | backend/.env.development | `dev-secret` |

## Support

1. Check error messages in browser console (F12)
2. Check terminal output where you ran npm commands
3. Verify all services are running (Backend, PostgreSQL)
4. Review full README.md for detailed documentation

---

**Happy resume building! 🚀**
