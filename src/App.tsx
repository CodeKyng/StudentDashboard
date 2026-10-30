import { BrowserRouter, Route, Routes } from "react-router-dom"

import { RequireAuth } from "./components/Auth/RequireAuth"
import { RequireRole } from "./components/Auth/RequireRole"
import { AdminShell } from "./components/admin/AdminShell"
import { StaffShell } from "./components/staff/StaffShell"
import Announcements from "./pages/announcement/Announcements"
import Assignments from "./pages/assignments/Assignments"
import AttendanceView from "./pages/attendance/AttendanceView"
import LoginPage from "./pages/Auth/Login"
import SignupPage from "./pages/Auth/Signup"
import ParentJoinPage from "./pages/Auth/ParentJoin"
import ParentDashboard from "./pages/parent/ParentDashboard"
import GuardiansPage from "./pages/guardians/Guardians"
import CourseRegistration from "./pages/courses/CourseRegistration"
import Exams from "./pages/exams/Exams"
import FeesDashboard from "./pages/fees/FeesDashboard"
import Receipts from "./pages/fees/Receipts"
import HostelAllocation from "./pages/hostel/HostelAllocation"
import Library from "./pages/library/Library"
import Home from "./pages/public/Home"
import SemesterResults from "./pages/results/SemesterResults"
import TranscriptRequest from "./pages/results/TranscriptRequest"
import StudentDashboard from "./pages/dashboard/StudentDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminStudents from "./pages/admin/AdminStudents"
import AdminProfile from "./pages/admin/AdminProfile"
import AdminCourses from "./pages/admin/AdminCourses"
import AdminFaculties from "./pages/admin/AdminFaculties"
import AdminDepartments from "./pages/admin/AdminDepartments"
import AdminAttendance from "./pages/admin/AdminAttendance"
import AdminExams from "./pages/admin/AdminExams"
import AdminAssignments from "./pages/admin/AdminAssignments"
import AdminResults from "./pages/admin/AdminResults"
import AdminFees from "./pages/admin/AdminFees"
import AdminReceipts from "./pages/admin/AdminReceipts"
import AdminHostel from "./pages/admin/AdminHostel"
import AdminLibrary from "./pages/admin/AdminLibrary"
import AdminTranscript from "./pages/admin/AdminTranscript"
import AdminAnnouncements from "./pages/admin/AdminAnnouncements"
import StaffDashboard from "./pages/staff/StaffDashboard"
import StaffAttendance from "./pages/staff/StaffAttendance"
import StaffScores from "./pages/staff/StaffScores"
import StaffAssignments from "./pages/staff/StaffAssignments"
import StaffExams from "./pages/staff/StaffExams"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/parent/join" element={<ParentJoinPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/registercourses" element={<CourseRegistration />} />
          <Route path="/attendance" element={<AttendanceView />} />
          <Route path="/exams-schedule" element={<Exams />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/e-library" element={<Library />} />
          <Route path="/results" element={<SemesterResults />} />
          <Route path="/school-fees" element={<FeesDashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/hostel" element={<HostelAllocation />} />
          <Route path="/transcript" element={<TranscriptRequest />} />
          <Route path="/announcement" element={<Announcements />} />
          <Route path="/guardians" element={<GuardiansPage />} />

          <Route element={<RequireRole allow={["Parent"]} />}>
            <Route path="/parent" element={<ParentDashboard />} />
          </Route>

          <Route element={<RequireRole allow={["Staff", "Admin"]} />}>
            <Route path="/staff" element={<StaffShell />}>
              <Route index element={<StaffDashboard />} />
              <Route path="attendance" element={<StaffAttendance />} />
              <Route path="scores" element={<StaffScores />} />
              <Route path="assignments" element={<StaffAssignments />} />
              <Route path="exams" element={<StaffExams />} />
            </Route>
          </Route>

          <Route element={<RequireRole allow={["Admin", "Staff"]} />}>
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminDashboard />} />
              <Route path="faculties" element={<AdminFaculties />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="exams" element={<AdminExams />} />
              <Route path="assignments" element={<AdminAssignments />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="fees" element={<AdminFees />} />
              <Route path="receipts" element={<AdminReceipts />} />
              <Route path="hostel" element={<AdminHostel />} />
              <Route path="library" element={<AdminLibrary />} />
              <Route path="transcript" element={<AdminTranscript />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <div className="flex min-h-svh items-center justify-center p-6">
              <h1 className="text-xl font-semibold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
