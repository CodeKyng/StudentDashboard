import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/public/Home"
import LoginPage from "./pages/Auth/Login"
import StudentDashboard from "./pages/dashboard/StudentDashboard"
import CourseRegistration from "./pages/courses/CourseRegistration"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/registercourses" element={<CourseRegistration />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
