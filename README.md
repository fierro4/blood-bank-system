@'
# Blood Bank System (local)

Quick start (Windows PowerShell)

Prerequisites:
- Node.js + npm
- MySQL 8 (or compatible)
Steps:
1. Install frontend deps
   npm install

2. Install backend deps
   cd backend
   npm install

3. Copy `.env.example` to `.env` in `backend/` and fill DB credentials:
   cp .\backend\.env.example .\backend\.env
   (then edit backend\.env to set DB_PASSWORD etc)

4. Import database schema and seed:
   mysql -u root -p < data.sql

5. Start backend (in backend/):
   npm run dev

6. Start frontend (project root):
   npm run dev

If you run into date/locale issues, make sure browser date input values are ISO YYYY-MM-DD or import the DB first.
'@ | Set-Content -Path README.md -Encoding UTF8