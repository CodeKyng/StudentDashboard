# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Firebase authentication

Set the following variables in a local `.env` file using the Firebase web app
configuration:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Enable Email/Password in Firebase Authentication, create a Cloud Firestore
database, and deploy the repository's `firestore.rules`. New accounts can choose
Staff, Student, or Parent. Admin profiles must be assigned by a trusted
administrator using the Firebase Console or Admin SDK; client signups cannot
grant Admin access. Keep Firebase Admin SDK credentials out of the browser app.

### Dashboard data

Dashboard pages read their records from `dashboardData/{userUid}`. Replace
`{userUid}` with the authenticated user's UID from Firebase Authentication.
Create the document in the Firebase Console or through a trusted server; this
client intentionally has read-only access. A missing document is treated as
empty data, not populated with sample values.

Supported optional document fields:

- `currentSemester`, `session`, `level`, `faculty`, `department`,
  `currencyCode`
- `cgpa`, `previousCgpa`, `attendancePercentage`, `warningPercentage`,
  `feeStatus`, `registrationEligible`, `schoolFeeAmount`, `feesDue`
- `courses`: `{ code, title, description, progress }[]`
- `attendanceCourses`: `{ coursecode, progress, percentage }[]`
- `courseCatalog`: `{ code, department, departmentName, name, description,
prerequisites: string[], units, semester }[]`
- `exams`: `{ course, date, time, hall, seatNo }[]`
- `assignments`: `{ course, title, dueDate, status, score }[]`; `status` must
  be `Submitted`, `Overdue`, or `Pending`
- `results`: `{ code, course, units, ca, exam, grade }[]`
- `gpaHistory`: numeric fields `firstLevelFirstSemester`,
  `firstLevelSecondSemester`, `secondLevelFirstSemester`,
  `secondLevelSecondSemester`, `thirdLevelFirstSemester`,
  `thirdLevelSecondSemester`, `fourthLevelFirstSemester`,
  `fourthLevelSecondSemester`
- `announcements`: `{ id, source, dateCreated, title, description, badge }[]`
- `events`: `{ title, description }[]`
- `unreadAnnouncementCount`: non-negative integer
- `feeItems`: `{ name, amount }[]`
- `paymentRecords`: `{ session, level, date, rrr, status }[]`
- `scholarships`: `{ title, description, status }[]`
- `libraryResources`: `{ title, author, category, url }[]`
- `hostelAssignment`: `{ hostel, room, session, status }`
- `transcriptClearance`: `{ title, description, date }`
- `transcriptRequestMeta`: `{ label, value }[]`
- `previousTranscriptRequest`: `{ date, type, status, info: { label, value }[] }`

Omit fields that do not yet have real data. The UI displays an empty state rather
than inventing dashboard content.
