import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import FacultyManagement from './pages/admin/FacultyManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import ClassManagement from './pages/admin/ClassManagement';
import AttendanceReports from './pages/admin/AttendanceReports';
import PerformanceReports from './pages/admin/PerformanceReports';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MarkAttendance from './pages/faculty/MarkAttendance';
import EnterMarks from './pages/faculty/EnterMarks';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentPerformance from './pages/student/StudentPerformance';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  const { isAuthenticated, user } = useAuth();

  const getDefaultDashboard = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ROLE_ADMIN':
        return '/admin/dashboard';
      case 'ROLE_FACULTY':
        return '/faculty/dashboard';
      case 'ROLE_STUDENT':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getDefaultDashboard()} replace /> : <LoginPage />}
      />

      {/* Administrator Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="subjects" element={<SubjectManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="attendance-reports" element={<AttendanceReports />} />
        <Route path="performance-reports" element={<PerformanceReports />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Faculty Protected Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute roles={['ROLE_FACULTY']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="mark-attendance" element={<MarkAttendance />} />
        <Route path="enter-marks" element={<EnterMarks />} />
        <Route path="attendance-reports" element={<AttendanceReports />} />
        <Route path="performance-reports" element={<PerformanceReports />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={['ROLE_STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="performance" element={<StudentPerformance />} />
        <Route path="my-profile" element={<StudentProfile />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
