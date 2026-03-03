# Backend — ResumeMaker

Minimal Node + Express + TypeScript skeleton for the ResumeMaker backend.

Quick start (after installing dependencies):

PowerShell
```
cd backend
npm install
npm run dev
```

Endpoints:
- `GET /health` — health check
- `POST /api/resumes` — create a resume (simple in-memory store)
- `GET /api/resumes` — list resumes
- `GET /api/resumes/:id` — get resume

Notes:
- This is a starter scaffold. Replace the in-memory service with a database and add authentication.
Prisma / Database
 - The project includes a Prisma schema in `prisma/schema.prisma`.
 - To initialize a local database and run migrations, set `DATABASE_URL` in `.env` and run:

PowerShell
```
cd backend
npx prisma migrate dev --name init
npm run dev
```

 - Generate the Prisma client after editing the schema with `npx prisma generate`.
Environment files
- This project uses two environment files: `.env.development` and `.env.production` in the `backend/` folder.
- The code loads the appropriate file via `src/config/api.ts` based on `NODE_ENV`.
- Prisma CLI reads `.env` by default. For local migrations you can copy the development file to `.env` first:

PowerShell
```
cd backend
Copy-Item .env.development .env -Force
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Or set `DATABASE_URL` in your environment before calling Prisma commands.
