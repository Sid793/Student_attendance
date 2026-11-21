import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BsGrid1X2Fill,
  BsPeopleFill,
  BsPersonBadgeFill,
  BsBookHalf,
  BsBuildingCheck,
  BsCalendarCheckFill,
  BsGraphUpArrow,
  BsPersonCircle,
  BsBoxArrowRight,
  BsList,
  BsMortarboardFill,
  BsFileEarmarkBarGraphFill,
  BsClockHistory,
  BsAwardFill
} from 'react-icons/bs';

const DashboardLayout = () => {
  const { user, logout, isAdmin, isFaculty, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isFaculty) return 'Faculty Member';
    if (isStudent) return 'Student';
    return 'User';
  };

  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="d-flex position-relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="brand">
          <BsMortarboardFill className="text-primary fs-3" />
          <div>
            <div className="lh-1">SAPTS Portal</div>
            <small style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
              Attendance & Marks
            </small>
          </div>
        </div>

        <div className="py-2">
          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div className="nav-section">Administration</div>
              <NavLink to="/admin/dashboard" className="nav-link" onClick={closeSidebar}>
                <BsGrid1X2Fill /> Dashboard
              </NavLink>
              <NavLink to="/admin/students" className="nav-link" onClick={closeSidebar}>
                <BsPeopleFill /> Student Management
              </NavLink>
              <NavLink to="/admin/faculty" className="nav-link" onClick={closeSidebar}>
                <BsPersonBadgeFill /> Faculty Management
              </NavLink>
              <NavLink to="/admin/subjects" className="nav-link" onClick={closeSidebar}>
                <BsBookHalf /> Subject Management
              </NavLink>
              <NavLink to="/admin/classes" className="nav-link" onClick={closeSidebar}>
                <BsBuildingCheck /> Class Management
              </NavLink>

              <div className="nav-section">Reports & Analytics</div>
              <NavLink to="/admin/attendance-reports" className="nav-link" onClick={closeSidebar}>
                <BsCalendarCheckFill /> Attendance Reports
              </NavLink>
              <NavLink to="/admin/performance-reports" className="nav-link" onClick={closeSidebar}>
                <BsGraphUpArrow /> Academic Reports
              </NavLink>
            </>
          )}

          {/* Faculty Navigation */}
          {isFaculty && (
            <>
              <div className="nav-section">Faculty Portal</div>
              <NavLink to="/faculty/dashboard" className="nav-link" onClick={closeSidebar}>
                <BsGrid1X2Fill /> Dashboard
              </NavLink>
              <NavLink to="/faculty/mark-attendance" className="nav-link" onClick={closeSidebar}>
                <BsCalendarCheckFill /> Mark Attendance
              </NavLink>
              <NavLink to="/faculty/enter-marks" className="nav-link" onClick={closeSidebar}>
                <BsAwardFill /> Enter Student Marks
              </NavLink>

              <div className="nav-section">Reports</div>
              <NavLink to="/faculty/attendance-reports" className="nav-link" onClick={closeSidebar}>
                <BsFileEarmarkBarGraphFill /> Attendance Reports
              </NavLink>
              <NavLink to="/faculty/performance-reports" className="nav-link" onClick={closeSidebar}>
                <BsGraphUpArrow /> Performance Reports
              </NavLink>
            </>
          )}

          {/* Student Navigation */}
          {isStudent && (
            <>
              <div className="nav-section">Student Portal</div>
              <NavLink to="/student/dashboard" className="nav-link" onClick={closeSidebar}>
                <BsGrid1X2Fill /> My Dashboard
              </NavLink>
              <NavLink to="/student/attendance" className="nav-link" onClick={closeSidebar}>
                <BsCalendarCheckFill /> My Attendance
              </NavLink>
              <NavLink to="/student/performance" className="nav-link" onClick={closeSidebar}>
                <BsGraphUpArrow /> My Performance
              </NavLink>
              <NavLink to="/student/my-profile" className="nav-link" onClick={closeSidebar}>
                <BsPersonCircle /> Academic Profile
              </NavLink>
            </>
          )}

          {/* Account Settings for all users */}
          <div className="nav-section">Account</div>
          <NavLink
            to={isAdmin ? '/admin/profile' : isFaculty ? '/faculty/profile' : '/student/profile'}
            className="nav-link"
            onClick={closeSidebar}
          >
            <BsPersonCircle /> Profile & Security
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-link w-100 text-start border-0 bg-transparent text-danger mt-3"
          >
            <BsBoxArrowRight /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content flex-grow-1">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-secondary d-lg-none border-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <BsList className="fs-4" />
            </button>
            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
              Academic Session: 2026-2027
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold text-dark lh-1">{user?.fullName || user?.username}</div>
              <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                {getRoleLabel()}
              </small>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-primary btn-sm rounded-circle p-2"
                style={{ width: '38px', height: '38px' }}
                onClick={handleLogout}
                title="Sign Out"
              >
                <BsBoxArrowRight />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
