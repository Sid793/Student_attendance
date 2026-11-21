import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { facultyAPI, dashboardAPI } from '../../services/api';
import {
  BsBookHalf,
  BsPeopleFill,
  BsCheck2Circle,
  BsCalendarCheckFill,
  BsAwardFill,
  BsArrowRight
} from 'react-icons/bs';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    try {
      setLoading(true);
      const facRes = await facultyAPI.getByUserId(user.id);
      setFaculty(facRes.data);

      if (facRes.data && facRes.data.id) {
        const statsRes = await dashboardAPI.getFacultyStats(facRes.data.id);
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load faculty portal data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="content-card bg-primary text-white p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white mb-2">Faculty Member Portal</span>
            <h2 className="fw-bold mb-1">Welcome back, {faculty?.fullName || user.username}!</h2>
            <p className="mb-0 text-white text-opacity-75 small">
              Department of {faculty?.department || 'Computer Applications'} &bull; {faculty?.designation}
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/faculty/mark-attendance" className="btn btn-light fw-bold text-primary px-3 py-2 shadow-sm">
              <BsCalendarCheckFill className="me-2" /> Take Attendance
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card info">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{faculty?.subjectNames?.length || 0}</div>
                <div className="stat-label">Assigned Teaching Subjects</div>
              </div>
              <div className="stat-icon text-info">
                <BsBookHalf />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card success">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.totalStudents || 0}</div>
                <div className="stat-label">Total Department Students</div>
              </div>
              <div className="stat-icon text-success">
                <BsPeopleFill />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card warning">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.overallAttendancePercentage || 0}%</div>
                <div className="stat-label">Institution Attendance Average</div>
              </div>
              <div className="stat-icon text-warning">
                <BsCheck2Circle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Subjects & Quick Actions */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>My Assigned Curriculum Subjects</h5>
            </div>
            {faculty?.subjectNames && faculty.subjectNames.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {faculty.subjectNames.map((name, index) => (
                  <div key={index} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">{name}</h6>
                      <small className="text-muted">Active Teaching Allocation</small>
                    </div>
                    <Link
                      to="/faculty/mark-attendance"
                      className="btn btn-sm btn-outline-primary fw-semibold"
                    >
                      Record Attendance <BsArrowRight className="ms-1" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No subjects currently allocated.</p>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>Academic Faculty Actions</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              <Link
                to="/faculty/mark-attendance"
                className="p-3 rounded-3 border text-decoration-none d-flex align-items-center gap-3 bg-white hover-shadow transition"
              >
                <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <BsCalendarCheckFill className="fs-4" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Mark Daily Attendance</h6>
                  <small className="text-muted">Take batch roll call by date and subject</small>
                </div>
              </Link>

              <Link
                to="/faculty/enter-marks"
                className="p-3 rounded-3 border text-decoration-none d-flex align-items-center gap-3 bg-white hover-shadow transition"
              >
                <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                  <BsAwardFill className="fs-4" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Enter Assessment Marks</h6>
                  <small className="text-muted">Record Quizzes, Assignments, Midterms & Finals</small>
                </div>
              </Link>

              <Link
                to="/faculty/attendance-reports"
                className="p-3 rounded-3 border text-decoration-none d-flex align-items-center gap-3 bg-white hover-shadow transition"
              >
                <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle">
                  <BsBookHalf className="fs-4" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">View Student Reports</h6>
                  <small className="text-muted">Inspect class registers & defaulter rosters</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
