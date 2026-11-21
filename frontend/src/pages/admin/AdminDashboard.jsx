import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import {
  BsPeopleFill,
  BsPersonBadgeFill,
  BsBookHalf,
  BsCheck2Circle,
  BsExclamationTriangleFill,
  BsTrophyFill
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getAdminStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Transform subject data for Recharts
  const attendanceChartData = stats?.subjectAttendanceRates
    ? Object.keys(stats.subjectAttendanceRates).map((key) => ({
        subject: key.length > 15 ? key.substring(0, 15) + '...' : key,
        attendanceRate: stats.subjectAttendanceRates[key],
      }))
    : [];

  const performanceChartData = stats?.subjectAverageScores
    ? Object.keys(stats.subjectAverageScores).map((key) => ({
        subject: key.length > 15 ? key.substring(0, 15) + '...' : key,
        averageScore: stats.subjectAverageScores[key],
      }))
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title mb-1">Institutional Dashboard</h2>
          <p className="text-muted small mb-0">
            Real-time overview of student enrolment, faculty assignments, and compliance metrics
          </p>
        </div>
      </div>

      {/* Defaulter Alert Banner if any student is below 75% */}
      {stats?.lowAttendanceCount > 0 && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm" role="alert">
          <BsExclamationTriangleFill className="fs-5 flex-shrink-0" />
          <div>
            <strong>Attendance Notice:</strong> There are{' '}
            <span className="badge bg-danger">{stats.lowAttendanceCount} student(s)</span> with
            attendance below the mandatory 75% threshold.
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.totalStudents || 0}</div>
                <div className="stat-label">Enrolled Students</div>
              </div>
              <div className="stat-icon text-primary">
                <BsPeopleFill />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card success">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.totalFaculty || 0}</div>
                <div className="stat-label">Faculty Members</div>
              </div>
              <div className="stat-icon text-success">
                <BsPersonBadgeFill />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card info">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.totalSubjects || 0}</div>
                <div className="stat-label">Curriculum Subjects</div>
              </div>
              <div className="stat-icon text-info">
                <BsBookHalf />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card warning">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stat-value">{stats?.overallAttendancePercentage || 0}%</div>
                <div className="stat-label">Overall Attendance</div>
              </div>
              <div className="stat-icon text-warning">
                <BsCheck2Circle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>Subject Attendance Rates (%)</h5>
            </div>
            {attendanceChartData.length > 0 ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={attendanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="attendanceRate" fill="#4361ee" name="Attendance %" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No attendance data recorded yet.</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>Subject Performance Averages (%)</h5>
            </div>
            {performanceChartData.length > 0 ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#10b981" name="Score %" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No marks data recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Performing Students Table */}
      <div className="content-card">
        <div className="card-header-custom">
          <h5 className="d-flex align-items-center gap-2">
            <BsTrophyFill className="text-warning" /> Exemplary Attendance Records
          </h5>
        </div>
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Enrolled Class</th>
                <th>Email Address</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topPerformers && stats.topPerformers.length > 0 ? (
                stats.topPerformers.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="fw-bold">{student.rollNumber}</span>
                    </td>
                    <td>{student.fullName}</td>
                    <td>{student.className || 'MCA II Year'}</td>
                    <td className="text-muted">{student.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          student.attendancePercentage >= 85
                            ? 'bg-success'
                            : student.attendancePercentage >= 75
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        } px-3 py-2 rounded-pill`}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
