import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import School from './school/School';
import AttendanceStudentList from './school/components/attendance/AttendanceStudentList';
import Class from './school/components/class/Class';
import Dashboard from './school/components/dashboard/Dashboard';
import Examinations from './school/components/examinations/Examinations';
import Notice from './school/components/notice/Notice';
import Schedule from './school/components/schedule/Schedule';
import Students from './school/components/students/Students';
import Subjects from './school/components/subjects/Subjects';
import Teachers from './school/components/teachers/Teachers'; 
import Client from './client/Client';
import Login from './client/components/login/Login';
import LogOut from './client/components/logout/logout';
import Register from './client/components/register/Register';
import Home from './client/components/home/Home';
import Teacher from './teacher/Teacher'
import TeacherDetails from './teacher/components/teacher details/TeacherDetails';
import AttendanceTeacher from './teacher/components/attendance/AttendanceTeacher';
import ExaminationsTeacher from './teacher/components/examinations/ExaminationsTeacher';
import NoticeTeacher from './teacher/components/notice/NoticeTeacher';
import ScheduleTeacher from './teacher/components/schedule/ScheduleTeacher';
import Student from './student/Student';
import AttendanceStudent from './student/components/attendance/AttendanceStudent';
import StudentDetails from './student/components/student details/StudentDetails';
import ExaminationsStudent from './student/components/examinations/ExaminationsStudent';
import NoticeStudent from './student/components/notice/NoticeStudent';
import ScheduleStudent from './student/components/schedule/ScheduleStudent';
import ProtectedRoute from './guard/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import "react-big-calendar/lib/css/react-big-calendar.css";
import AttendanceDetails from './school/components/attendance/AttendanceDetails';
   // correct the path

function App() {

  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* SCHOOL ROUTE */}
          <Route path='/school' element={<ProtectedRoute allowedRoles={['SCHOOL']}><School/></ProtectedRoute>} >
            <Route index element={<Dashboard/>} />
            <Route path='attendance' element={<AttendanceStudentList/>} />
                <Route path='attendance/:id' element={<AttendanceDetails/>} />
            <Route path='class' element={<Class/>} />
            <Route path='examinations' element={<Examinations/>} />
            <Route path='notice' element={<Notice/>} />
            <Route path='schedule' element={<Schedule/>} />
            <Route path='students' element={<Students/>} />
            <Route path='subjects' element={<Subjects/>} />
            <Route path='teachers' element={<Teachers/>} />
          </Route>
          {/* STUDENT ROUTE */}
          <Route path='student' element={<ProtectedRoute allowedRoles={['STUDENT']}><Student/></ProtectedRoute>}>
            <Route index element={<StudentDetails/>} />
              <Route path="schedule" element={<ScheduleStudent/>} />
              <Route path="attendance" element={<AttendanceStudent/>} />
                <Route path="examinations" element={<ExaminationsStudent/>} />
              <Route path="notice" element={<NoticeStudent/>} />
          </Route>
          {/* TEACHER ROUTE */}
          <Route path='teacher' element={<ProtectedRoute allowedRoles={['TEACHER']}><Teacher/></ProtectedRoute>}>
               <Route index element={<TeacherDetails/>} />
              <Route path="schedule" element={<ScheduleTeacher/>} />
              <Route path="attendance" element={<AttendanceTeacher/>} />
                <Route path="examinations" element={<ExaminationsTeacher/>} />
              <Route path="notice" element={<NoticeTeacher/>} />
          </Route>
          {/* CLIENT ROUTE */}
          <Route path="/" element={<Client/>}>
              <Route index element={<Home/>} />
              <Route path="login" element={<Login/>} />
              <Route path="register" element={<Register/>} />
               <Route path="logout" element={<LogOut/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
