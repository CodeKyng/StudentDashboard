import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/public/Home"
import LoginPage from "./pages/Auth/Login"
import StudentDashboard from "./pages/dashboard/StudentDashboard"
import CourseRegistration from "./pages/courses/CourseRegistration"
import AttendanceView from "./pages/attendance/AttendanceView"
import Exams from "./pages/exams/Exams"
import Assignments, {
  type AssignmentEntry,
} from "./pages/assignments/Assignments"
import Library from "./pages/library/Library"
import SemesterResults from "./pages/results/SemesterResults"
import FeesDashboard from "./pages/fees/FeesDashboard"
import Receipts from "./pages/fees/Receipts"
import HostelAllocation from "./pages/hostel/HostelAllocation"
import TranscriptRequest from "./pages/results/TranscriptRequest"
import Announcements from "./pages/announcement/Announcements"

const attendanceCourses = [
  { coursecode: "CS101", progress: 88, percentage: 88 },
  { coursecode: "MATH201", progress: 76, percentage: 76 },
  { coursecode: "PHYS101", progress: 91, percentage: 91 },
  { coursecode: "ENG101", progress: 82, percentage: 82 },
  { coursecode: "ECON201", progress: 79, percentage: 79 },
  { coursecode: "CHEM101", progress: 84, percentage: 84 },
  { coursecode: "BIO101", progress: 87, percentage: 87 },
  { coursecode: "STAT202", progress: 93, percentage: 93 },
  { coursecode: "HIST101", progress: 68, percentage: 68 },
  { coursecode: "PSY101", progress: 74, percentage: 74 },
  { coursecode: "SOCI201", progress: 79, percentage: 79 },
  { coursecode: "IT201", progress: 88, percentage: 88 },
]

const examSchedule = [
  {
    course: "EE201 - Circuit Analysis",
    date: "2026-06-12",
    time: "09:00 AM",
    hall: "Hall A",
    seatNo: "B12",
  },
  {
    course: "CE201 - Structural Analysis",
    date: "2026-06-13",
    time: "11:00 AM",
    hall: "Hall B",
    seatNo: "C05",
  },
  {
    course: "ME201 - Thermodynamics",
    date: "2026-06-14",
    time: "08:30 AM",
    hall: "Hall C",
    seatNo: "D10",
  },
  {
    course: "MN201 - Mineral Processing",
    date: "2026-06-15",
    time: "10:00 AM",
    hall: "Hall D",
    seatNo: "E02",
  },
  {
    course: "CS101 - Introduction to Computer Science",
    date: "2026-06-16",
    time: "01:00 PM",
    hall: "Hall E",
    seatNo: "F20",
  },
]

const assignmentSchedule: AssignmentEntry[] = [
  {
    course: "EE201",
    title: "Lab Report 1",
    dueDate: "2026-06-18",
    status: "Submitted",
    score: "92%",
  },
  {
    course: "CE201",
    title: "Project Proposal",
    dueDate: "2026-06-20",
    status: "Pending",
    score: "Not graded",
  },
  {
    course: "ME201",
    title: "Thermodynamic Analysis",
    dueDate: "2026-06-14",
    status: "Overdue",
    score: "N/A",
  },
  {
    course: "MN201",
    title: "Mining Safety Audit",
    dueDate: "2026-06-22",
    status: "Submitted",
    score: "88%",
  },
  {
    course: "CS101",
    title: "Coding Assignment 1",
    dueDate: "2026-06-19",
    status: "Pending",
    score: "Not graded",
  },
]

const gpaHistory = {
  firstLevelFirstSemester: 3.5,
  firstLevelSecondSemester: 3.8,
  secondLevelFirstSemester: 3.2,
  secondLevelSecondSemester: 3.6,
  thirdLevelFirstSemester: 3.4,
  thirdLevelSecondSemester: 3.7,
  fourthLevelFirstSemester: 3.9,
  fourthLevelSecondSemester: 4.0,
}

const courseRegistrationCourses = [
  {
    code: "EE201",
    department: "electrical",
    name: "Circuit Analysis",
    description:
      "Fundamentals of circuit theory, resistors, capacitors, and inductors.",
    prerequisites: ["Physics I", "Calculus II"],
    units: 3,
    semester: "Fall",
  },
  {
    code: "EE301",
    department: "electrical",
    name: "Signals and Systems",
    description: "Time and frequency domain analysis of electrical signals.",
    prerequisites: ["Circuit Analysis", "Differential Equations"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "EE401",
    department: "electrical",
    name: "Power Electronics",
    description:
      "Switching converters, inverters, and power control techniques.",
    prerequisites: ["Circuit Analysis", "Electromagnetics"],
    units: 3,
    semester: "Fall",
  },
  {
    code: "CE201",
    department: "civil",
    name: "Structural Analysis",
    description: "Analysis of beams, trusses, and structural systems.",
    prerequisites: ["Statics", "Strength of Materials"],
    units: 4,
    semester: "Fall",
  },
  {
    code: "CE301",
    department: "civil",
    name: "Geotechnical Engineering",
    description: "Soil mechanics, foundation design, and earth structures.",
    prerequisites: ["Fluid Mechanics", "Materials Science"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "CE401",
    department: "civil",
    name: "Transportation Engineering",
    description: "Highway design, traffic flow, and transportation planning.",
    prerequisites: ["Structural Analysis", "Hydraulics"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "ME201",
    department: "mechanical",
    name: "Thermodynamics",
    description: "Energy systems, heat transfer, and thermodynamic cycles.",
    prerequisites: ["Calculus II", "Physics II"],
    units: 4,
    semester: "Fall",
  },
  {
    code: "ME301",
    department: "mechanical",
    name: "Machine Design",
    description: "Design principles for mechanical components and mechanisms.",
    prerequisites: ["Statics", "Materials Science"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "ME401",
    department: "mechanical",
    name: "Control Systems",
    description: "Feedback control, stability, and system modeling.",
    prerequisites: ["Dynamics", "Signals and Systems"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "MN201",
    department: "mining",
    name: "Mineral Processing",
    description: "Ore beneficiation, comminution, and separation processes.",
    prerequisites: ["Chemistry", "Geology"],
    units: 3,
    semester: "Fall",
  },
  {
    code: "MN301",
    department: "mining",
    name: "Mine Planning",
    description: "Surface and underground mine planning techniques.",
    prerequisites: ["Geotechnical Engineering", "Economics"],
    units: 3,
    semester: "Spring",
  },
  {
    code: "MN401",
    department: "mining",
    name: "Mineral Economics",
    description:
      "Economic evaluation of mining projects and resource estimation.",
    prerequisites: ["Statistics", "Geology"],
    units: 3,
    semester: "Fall",
  },
  {
    code: "CS101",
    department: "computer",
    name: "Introduction to Computer Science",
    description: "Foundations of programming, algorithms, and problem solving.",
    prerequisites: ["None"],
    units: 3,
    semester: "Fall",
  },
  {
    code: "CS201",
    department: "computer",
    name: "Data Structures",
    description: "Abstract data types, trees, graphs, and sorting algorithms.",
    prerequisites: ["Introduction to Computer Science"],
    units: 4,
    semester: "Spring",
  },
  {
    code: "CS301",
    department: "computer",
    name: "Computer Architecture",
    description: "Processor design, memory systems, and instruction sets.",
    prerequisites: ["Digital Logic", "Data Structures"],
    units: 3,
    semester: "Spring",
  },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route
          path="/dashboard/registercourses"
          element={<CourseRegistration courses={courseRegistrationCourses} />}
        />
        <Route
          path="/dashboard/attendance"
          element={<AttendanceView courses={attendanceCourses} />}
        />
        <Route
          path="/dashboard/exams-schedule"
          element={<Exams exams={examSchedule} />}
        />
        <Route
          path="/dashboard/assignments"
          element={<Assignments assignments={assignmentSchedule} />}
        />
        <Route path="/dashboard/e-library" element={<Library />} />
        <Route
          path="/dashboard/results"
          element={<SemesterResults gpaHistory={gpaHistory} />}
        />
        <Route 
        path="/finance/school-fees"
        element={<FeesDashboard />} 
        />
        <Route 
        path="/finance/receipts"
        element={<Receipts />} 
        />
        <Route 
        path="/services/hostel"
        element={<HostelAllocation />} 
        />
        <Route 
        path="/services/transcript"
        element={<TranscriptRequest />} 
        />
        <Route 
        path="/services/announcement"
        element={<Announcements />} 
        />

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
