# Attendance Management — Frontend

A clean, responsive React frontend for taking and managing student attendance.

## Tech stack

- React + Vite
- React Router
- Tailwind CSS v4
- Axios
- Lucide React icons

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_URL to your backend
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure

```
src/
├── components/
│   ├── common/       Button, Input, Select, Modal, ConfirmDialog,
│   │                 LoadingSpinner, EmptyState, ErrorBanner, Toast, StatCard
│   ├── layout/        Sidebar, MobileDrawer, Navbar, ProtectedRoute, navConfig
│   ├── students/      StudentForm, StudentTable
│   ├── classes/       ClassForm, ClassTable
│   └── attendance/    StatusToggle, AttendanceTable, SummaryBar,
│                       ClassDateSelector, HistoryTable
├── pages/             Login, Dashboard, Students, Classes,
│                       Attendance, AttendanceHistory, AttendanceDetails
├── services/          api.js (axios instance) + one service file per resource
├── context/           AuthContext.jsx
├── hooks/             useAsync, useDebounce, useToast
├── utils/             format.js
├── layouts/           DashboardLayout.jsx
├── App.jsx
└── main.jsx
```

## Authentication

Auth is intentionally minimal for this MVP but structured for real JWT auth:

- `services/authService.js` calls `POST /api/auth/login` and stores the
  returned token in `localStorage`.
- `services/api.js` attaches `Authorization: Bearer <token>` to every
  request and automatically logs the user out on a `401` response.
- `components/layout/ProtectedRoute.jsx` redirects unauthenticated users to
  `/login`. Protected routes: `/dashboard`, `/attendance`,
  `/attendance/history`, `/attendance/:id`, `/students`, `/classes`.

To swap in real JWT auth, no frontend restructuring is needed — just make
sure `/api/auth/login` returns `{ token, user }`.

## Expected API endpoints

The frontend expects a REST API at `VITE_API_URL` (default
`http://localhost:5000/api`):

| Method | Endpoint                            | Purpose |
|--------|--------------------------------------|---------|
| POST   | `/auth/login`                        | `{ email, password }` → `{ token, user }` |
| GET    | `/dashboard/stats`                   | `{ totalStudents, totalClasses, todayStatus, attendancePercentage }` |
| GET    | `/students?search=&classId=`         | List/filter students |
| POST   | `/students`                          | Create a student |
| PUT    | `/students/:id`                      | Update a student |
| DELETE | `/students/:id`                      | Delete a student |
| GET    | `/classes`                           | List classes |
| GET    | `/classes/:id/students`              | Students belonging to a class |
| POST   | `/classes`                           | Create a class |
| PUT    | `/classes/:id`                       | Update a class |
| DELETE | `/classes/:id`                       | Delete a class |
| GET    | `/attendance?classId=&date=`         | Existing record for a class/date, if any |
| POST   | `/attendance`                        | `{ classId, date, records }` — create |
| PUT    | `/attendance/:id`                    | `{ classId, date, records }` — update |
| GET    | `/attendance/history?classId=&date=` | List past attendance summaries |
| GET    | `/attendance/:id`                    | Full detail for one record |

`records` is an array of `{ studentId, status }` where `status` is
`"present"` or `"absent"`.

## Notes

- No attendance or student data is hardcoded — everything renders from the
  API, including proper loading, error, and empty states.
- The Take Attendance page defaults every student to Present, so the
  everyday workflow is just tapping the few students who are absent.
- If attendance already exists for the selected class/date, the page
  switches to update mode automatically.
