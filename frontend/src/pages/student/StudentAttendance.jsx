import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, attendanceAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsCalendarCheckFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsSearch,
  BsExclamationTriangleFill
} from 'react-icons/bs';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const stuRes = await studentAPI.getByUserId(user.id);
      setStudent(stuRes.data);

      if (stuRes.data && stuRes.data.id) {
        const [sumRes, histRes] = await Promise.all([
          attendanceAPI.getStudentSummary(stuRes.data.id),
          attendanceAPI.getStudentHistory(stuRes.data.id)
        ]);
        setSummary(sumRes.data);
        setHistory(histRes.data);
      }
    } catch (err) {
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h) => {
    const term = searchTerm.toLowerCase();
    return (
      h.attendanceDate?.includes(term) ||
      h.subjectName?.toLowerCase().includes(term) ||
      h.subjectCode?.toLowerCase().includes(term) ||
      h.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">My Attendance Ledger</h2>
          <p className="text-muted small mb-0">
            Comprehensive audit of lectures conducted, presence logs, and course-wise percentages
          </p>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">{summary?.totalClasses || 0}</div>
            <div className="stat-label">Total Conducted</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card success">
            <div className="stat-value text-success">{summary?.presentClasses || 0}</div>
            <div className="stat-label">Classes Attended</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card danger">
            <div className="stat-value text-danger">{summary?.absentClasses || 0}</div>
            <div className="stat-label">Classes Missed</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className={`stat-card ${summary?.overallPercentage >= 75 ? 'info' : 'danger'}`}>
            <div className={`stat-value ${summary?.overallPercentage >= 75 ? 'text-info' : 'text-danger'}`}>
              {summary?.overallPercentage || 0}%
            </div>
            <div className="stat-label">Aggregate Attendance</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Summary */}
      <div className="content-card mb-4">
        <div className="card-header-custom">
          <h5>Subject-Wise Compliance Status</h5>
        </div>
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary?.subjectBreakdown && summary.subjectBreakdown.length > 0 ? (
                summary.subjectBreakdown.map((s) => (
                  <tr key={s.subjectId}>
                    <td>
                      <span className="badge bg-light text-dark border">{s.subjectCode}</span>
                    </td>
                    <td className="fw-semibold text-dark">{s.subjectName}</td>
                    <td>{s.totalClasses}</td>
                    <td className="text-success fw-bold">{s.presentClasses}</td>
                    <td className="text-danger fw-bold">{s.absentClasses}</td>
                    <td className="fw-bold">{s.attendancePercentage}%</td>
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
                    No curriculum subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Date-wise History Table */}
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="card-header-custom mb-0 pb-0 border-0">
            <h5>Date-Wise Attendance History Log</h5>
          </div>
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by date or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Status</th>
                <th>Teacher In Charge</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Fetching attendance records...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No attendance records found matching search.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <span className="fw-semibold text-dark">{h.attendanceDate}</span>
                    </td>
                    <td>
                      <div>{h.subjectCode}</div>
                      <small className="text-muted">{h.subjectName}</small>
                    </td>
                    <td>
                      {h.status === 'PRESENT' ? (
                        <span className="badge-present">
                          <BsCheckCircleFill className="text-success" /> Present
                        </span>
                      ) : (
                        <span className="badge-absent">
                          <BsXCircleFill className="text-danger" /> Absent
                        </span>
                      )}
                    </td>
                    <td>{h.facultyName || 'Department Faculty'}</td>
                    <td>
                      <small className="text-muted">{h.remarks || '-'}</small>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
