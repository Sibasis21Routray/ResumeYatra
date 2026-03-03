# ResumeMaker - Full Stack Resume Builder

A production-grade resume builder application with file upload, AI-powered text enhancement, multiple templates, and PDF generation.

## Architecture

**Frontend:** React 18 + Vite + TypeScript + Tailwind CSS  
**Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL  
**Storage:** Cloudinary  
**AI Engine:** Google Gemini 2.5 Pro  
**Authentication:** JWT + bcryptjs  
**PDF Generation:** Puppeteer  

## Project Structure

```
ResumeMaker/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # React pages (Login, Register, Dashboard, Editor, Upload, Preview)
│   │   ├── services/      # API client with axios
│   │   ├── App.tsx        # Main app with Router
│   │   └── styles.css     # Tailwind directives
│   ├── package.json
│   ├── vite.config.ts
│   └── .env               # Frontend env vars (VITE_API_URL)
│
├── backend/               # Node.js + Express backend
│   ├── src/
│   │   ├── config/        # Centralized config loader
│   │   ├── db/            # Prisma client
│   │   ├── middleware/    # Auth, upload handlers
│   │   ├── services/      # Business logic (auth, resume, parser, storage, template, pdf, ai)
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── routes/        # API routes
│   │   ├── app.ts         # Express app setup
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema (User, Resume, ResumeVersion, ResumeFile, Template)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.development   # Development environment variables
│   ├── .env.production    # Production environment variables
│   └── .env.example       # Example env template
│
└── README.md              # This file
```

## Features

✅ **Authentication**
- User registration and login
- JWT-based sessions (7-day expiration)
- Password hashing with bcryptjs
- Protected API routes

✅ **Resume Management**
- Create multiple resumes
- Edit resume content (personal info, skills, experience, education)
- Delete resumes with ownership verification
- Real-time preview while editing

✅ **File Upload & Parsing**
- Upload PDF or DOCX files
- Automatic text extraction
- Intelligent content parsing
- Direct Cloudinary storage

✅ **AI-Powered Enhancement**
- Google Gemini 2.5 Pro integration
- Text enhancement with tone control
- Smart suggestions for improvement
- Customizable word limits

✅ **PDF Generation & Templates**
- Multiple resume templates (Modern, Minimal)
- Puppeteer-based HTML-to-PDF conversion
- A4 format with print-ready output
- Cloudinary storage for generated PDFs

✅ **Database Persistence**
- PostgreSQL with Prisma ORM
- Version tracking for resumes
- File storage metadata
- User ownership enforcement

## Prerequisites

- **Node.js** 16.x or higher
- **PostgreSQL** 12.x or higher (local or remote)
- **npm** or **yarn**
- **Cloudinary Account** (free tier: https://cloudinary.com/users/register/free)
- **Google API Key** with Gemini 2.5 Pro access (https://ai.google.dev)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd d:\ResumeMaker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Configuration

#### Create `.env.development`

Copy `.env.example` and update:

```bash
cd backend
cp .env.example .env.development
```

Edit `backend/.env.development`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/resumemaker_dev
JWT_SECRET=your-dev-secret-key-here-change-in-production
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GEMINI_API_KEY=your-google-gemini-api-key
```

#### Create `.env.production`

```bash
cp .env.example .env.production
```

Edit `backend/.env.production` with production secrets:

```env
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/resumemaker
JWT_SECRET=your-prod-secret-key-generate-a-strong-one
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GEMINI_API_KEY=your-google-gemini-api-key
```

#### Setup PostgreSQL Database

```bash
# Create database
createdb resumemaker_dev

# Run Prisma migrations
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 3. Frontend Configuration

Update `frontend/.env` if backend is on different port:

```env
VITE_API_URL=http://localhost:4000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd d:\ResumeMaker\backend
npm run dev
# Runs on http://localhost:4000
# Auto-reloads with ts-node-dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\ResumeMaker\frontend
npm run dev
# Runs on http://localhost:5173
# Access at http://localhost:5173
```

### Production Mode

**Build Backend:**
```bash
cd d:\ResumeMaker\backend
npm run build
npm start
# Runs on http://localhost:4000
```

**Build Frontend:**
```bash
cd d:\ResumeMaker\frontend
npm run build
# Output in dist/ folder
# Serve with: npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user (requires auth)

### Resume Management
- `POST /api/resumes` — Create new resume
- `GET /api/resumes` — List user's resumes
- `GET /api/resumes/:id` — Get resume details
- `PUT /api/resumes/:id` — Update resume content
- `DELETE /api/resumes/:id` — Delete resume

### File Operations
- `POST /api/resumes/:id/upload` — Upload PDF/DOCX file

### PDF Generation
- `GET /api/resumes/:id/render?template=modern` — Generate PDF (modern or minimal template)

### AI Enhancement
- `POST /api/resumes/:id/enhance` — Enhance resume text with AI
- `POST /api/resumes/:id/suggestions` — Get improvement suggestions

## Database Schema

### User
- `id` — UUID primary key
- `email` — Unique email address
- `name` — Full name
- `password` — Hashed password
- `resumes` — Relationship to Resume entries

### Resume
- `id` — UUID primary key
- `ownerId` — FK to User (with cascade delete)
- `title` — Resume title
- `data` — JSON containing resume content
- `versions` — Relationship to ResumeVersion
- `files` — Relationship to ResumeFile

### ResumeVersion
- `id` — UUID primary key
- `resumeId` — FK to Resume
- `data` — Versioned resume JSON
- `note` — Optional version note
- `createdAt` — Timestamp

### ResumeFile
- `id` — UUID primary key
- `resumeId` — FK to Resume
- `filename` — Original filename
- `url` — Cloudinary URL
- `mimeType` — File MIME type
- `size` — File size in bytes

### Template
- `id` — UUID primary key
- `name` — Template name (Modern, Minimal)
- `slug` — Unique identifier
- `meta` — JSON metadata

## Environment Variables Reference

| Variable | Location | Purpose | Example |
|----------|----------|---------|---------|
| `PORT` | Backend | Server port | `4000` |
| `NODE_ENV` | Backend | Environment | `development` or `production` |
| `DATABASE_URL` | Backend | PostgreSQL connection | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Backend | Token signing key | `super-secret-key` |
| `CLOUDINARY_URL` | Backend | Cloudinary credentials | `cloudinary://key:secret@cloud` |
| `GEMINI_API_KEY` | Backend | Google Gemini API key | `AIza...` |
| `VITE_API_URL` | Frontend | Backend API URL | `http://localhost:4000/api` |

## Common Commands

### Backend

```bash
npm run dev              # Start dev server (ts-node-dev with watch)
npm run build            # Compile TypeScript to dist/
npm start                # Run production build
npm start:dev            # Start with NODE_ENV=development
npm start:prod           # Start with NODE_ENV=production
npm run prisma:migrate   # Run pending migrations
npm run prisma:generate  # Generate Prisma client
```

### Frontend

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build locally
```

## Deployment Checklist

- [ ] Set strong `JWT_SECRET` in `.env.production`
- [ ] Configure PostgreSQL with strong credentials
- [ ] Set up Cloudinary account and get API credentials
- [ ] Obtain Google Gemini API key
- [ ] Update `VITE_API_URL` for production domain
- [ ] Build frontend with `npm run build`
- [ ] Test entire flow in staging
- [ ] Enable HTTPS on production
- [ ] Set up database backups
- [ ] Monitor logs and errors

## Troubleshooting

### Database Connection Error
```
Error: P1000: Authentication failed against database server
```
- Verify PostgreSQL is running
- Check DATABASE_URL credentials in .env
- Ensure database exists: `createdb resumemaker_dev`

### Cloudinary Upload Fails
```
Error: Upload failed - Invalid credentials
```
- Verify CLOUDINARY_URL format: `cloudinary://key:secret@cloud`
- Check Cloudinary dashboard for valid API credentials

### Multer File Upload Error
```
Error: Unexpected field
```
- Ensure form submission uses `Content-Type: multipart/form-data`
- Check file size doesn't exceed 10MB limit

### JWT Token Expired
```
Error: 401 Unauthorized - Token expired
```
- Token expires after 7 days
- User needs to login again to get new token

## Performance Optimization Tips

- Enable Cloudinary transformations for image optimization
- Cache resume templates in Redis (future enhancement)
- Use Puppeteer pooling for concurrent PDF generation
- Implement request rate limiting on API endpoints
- Enable gzip compression on backend

## Security Considerations

✅ **Implemented:**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Request validation and sanitization
- User ownership verification on all resources
- Environment variable separation (dev vs prod)

⚠️ **Additional Recommendations:**
- Enable CORS with specific allowed origins in production
- Implement rate limiting on auth endpoints
- Use HTTPS in production
- Regularly update dependencies for security patches
- Implement request logging and monitoring
- Set up database encryption at rest

## Monitoring & Logging

Add logging to track:
- Authentication attempts
- API request/response times
- File upload success/failures
- PDF generation duration
- AI enhancement API calls
- Database query performance

Example: Use `winston` or `pino` for structured logging.

## Next Steps / Future Enhancements

- [ ] Add drag-drop file upload with multiple files
- [ ] Implement resume templates library with 10+ designs
- [ ] Add export formats: DOCX, TXT, JSON
- [ ] Integrate LinkedIn profile import
- [ ] Add cover letter builder
- [ ] Implement collaborative editing
- [ ] Add analytics dashboard
- [ ] Support for ATS-optimized resume formatting
- [ ] Integration with job boards (LinkedIn, Indeed, etc.)
- [ ] Mobile app (React Native)

## Support & Contributing

For issues or questions:
1. Check existing GitHub issues
2. Review error logs in `.env` files
3. Verify all services (database, Cloudinary, Gemini) are accessible
4. Contact development team

## License

MIT License - See LICENSE file for details

---

**Last Updated:** 2025-12-01  
**Version:** 1.0.0  
**Status:** Development Ready
