# Student Dashboard

A modern university student portal built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. Powered by Firebase Authentication and Cloud Firestore.

## Features

- Student / Staff / Parent / Admin roles
- Dashboard overview, course registration, attendance, exams, assignments
- Results & GPA, school fees, receipts, hostel, announcements, e-library
- Firebase Auth (Email/Password) + Firestore data layer

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- Firebase (Auth + Firestore)
- React Router

## Local Development

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/CodeKyng/StudentDashboard.git
cd StudentDashboard
npm install
```

2. Create a `.env` file from the example and fill in your Firebase web app config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Enable **Email/Password** in Firebase Authentication, create a Cloud Firestore database, and deploy the included `firestore.rules`.

4. Start the dev server:

```bash
npm run dev
```

## Deploy to Vercel

The project is already configured for Vercel (`vercel.json` with SPA rewrites, correct build settings).

### One-click / Dashboard method (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import the `CodeKyng/StudentDashboard` repository.
2. Framework Preset should auto-detect **Vite**.
3. Under **Environment Variables**, add all six `VITE_FIREBASE_*` variables (same values as your local `.env`). Target them for **Production**, **Preview**, and **Development**.
4. Click **Deploy**.

After the first deploy, every push to `main` will trigger a new production deployment.

### CLI method

```bash
npm i -g vercel
vercel login
vercel link          # link to the project
vercel env add VITE_FIREBASE_API_KEY production
# repeat for the other five variables
vercel --prod
```

### Important notes

- Never commit a real `.env` file (it is already in `.gitignore`).
- Firebase web API keys are safe to expose in the browser; security is enforced by Firestore rules and Auth.
- After deploying, add your Vercel domain (e.g. `student-dashboard.vercel.app`) to the **Authorized domains** list in Firebase Authentication → Settings.

## Firebase data model

Dashboard pages read their records from `dashboardData/{userUid}`. Replace `{userUid}` with the authenticated user's UID. Create the document in the Firebase Console or through a trusted server; the client has read-only access. A missing document is treated as empty data.

Supported optional document fields are documented in the original project notes (courses, attendance, exams, assignments, results, fees, announcements, etc.).

New accounts can choose Staff, Student, or Parent. Admin profiles must be assigned by a trusted administrator; client signups cannot grant Admin access.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check only |

---

Built by [@CodeKyng](https://github.com/CodeKyng)
