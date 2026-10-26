import { BrowserRouter, Route, Routes } from "react-router-dom"

import { RequireAuth } from "./components/Auth/RequireAuth"
import Announcements from "./pages/announcement/Announcements"
import Assignments from "./pages/assignments/Assignments"
import AttendanceView from "./pages/attendance/AttendanceView"
import LoginPage from "./pages/Auth/Login"
import SignupPage from "./pages/Auth/Signup"
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
        </Route>
        <Route
          path="*"
          element={
            <div>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
