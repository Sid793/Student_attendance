import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, dashboardAPI } from '../../services/api';
import {
  BsCheck2Circle,
  BsAwardFill,
  BsCalendarCheckFill,
  BsXCircleFill,
  BsExclamationTriangleFill,
  BsBookHalf
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentDashboard();
  }, []);

  const loadStudentDashboard = async () => {
    try {
      setLoading(true);
      const stuRes = await studentAPI.getByUserId(user.id);
      setStudent(stuRes.data);

      if (stuRes.data && stuRes.data.id) {
        const dashRes = await dashboardAPI.getStudentStats(stuRes.data.id);
        setDashboardData(dashRes.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard', err);
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

  const attendance = dashboardData?.attendance;
  const performance = dashboardData?.performance;

  const attendanceChartData = attendance?.subjectBreakdown
    ? attendance.subjectBreakdown.map((s) => ({
        subject: s.subjectCode,
        percentage: s.attendancePercentage
      }))
    : [];

  const performanceChartData = performance?.subjectWisePerformance
    ? performance.subjectWisePerformance.map((s) => ({
        subject: s.subjectCode,
        percentage: s.percentage
      }))
    : [];

  return (
    <div>
      {/* Student Banner */}
      <div className="content-card p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white mb-2">Student Academic Dashboard</span>
            <h2 className="fw-bold mb-1">Welcome, {student?.fullName || user.username}!</h2>
            <p className="mb-0 text-white text-opacity-75 small">
              Roll No: <strong>{student?.rollNumber}</strong> &bull; Cohort: {student?.className || 'MCA II Year'} &bull; Department: {student?.department}
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <span className={`badge ${attendance?.overallPercentage >= 75 ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 shadow-sm`}>
              Overall Attendance: {attendance?.overallPercentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {attendance?.isDefaulter && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm" role="alert">
          <BsExclamationTriangleFill className="fs-5 flex-shrink-0" />
          <div>
            <strong>Attendance Warning:</strong> Your aggregate attendance is currently{' '}
            <span className="badge bg-danger">{attendance?.overallPercentage}%</span>, which is below
            the mandatory 75% college eligibility criteria for semester examinations.
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-value">{attendance?.totalClasses || 0}</div>
            <div className="stat-label">Conducted Lectures</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card success">
            <div className="stat-value text-success">{attendance?.presentClasses || 0}</div>
            <div className="stat-label">Lectures Attended</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card danger">
            <div className="stat-value text-danger">{attendance?.absentClasses || 0}</div>
            <div className="stat-label">Lectures Missed</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-value text-info">{performance?.overallGrade || 'N/A'}</div>
            <div className="stat-label">Current Academic Grade ({performance?.averagePercentage || 0}%)</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>Subject Attendance Rates (%)</h5>
            </div>
            {attendanceChartData.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={attendanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#4361ee" name="Attendance %" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No attendance recorded yet.</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h5>Subject Academic Scores (%)</h5>
            </div>
            {performanceChartData.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#10b981" name="Score %" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No marks recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Table */}
      <div className="content-card">
        <div className="card-header-custom">
          <h5>Subject-Wise Attendance Summary</h5>
        </div>
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Subject Name</th>
                <th>Conducted</th>
                <th>Attended</th>
                <th>Missed</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance?.subjectBreakdown && attendance.subjectBreakdown.length > 0 ? (
                attendance.subjectBreakdown.map((s) => (
                  <tr key={s.subjectId}>
                    <td>
                      <span className="badge bg-light text-dark border">{s.subjectCode}</span>
                    </td>
                    <td className="fw-semibold text-dark">{s.subjectName}</td>
                    <td>{s.totalClasses}</td>
                    <td>
                      <span className="text-success fw-bold">{s.presentClasses}</span>
                    </td>
                    <td>
                      <span className="text-danger fw-bold">{s.absentClasses}</span>
                    </td>
                    <td>
                      <span className="fw-bold">{s.attendancePercentage}%</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          s.status === 'GOOD'
                            ? 'bg-success'
                            : s.status === 'WARNING'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        } px-2 py-1 rounded-pill`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No curriculum attendance records found.
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

export default StudentDashboard;
