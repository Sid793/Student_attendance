import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, marksAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsAwardFill,
  BsGraphUpArrow,
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

const StudentPerformance = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const stuRes = await studentAPI.getByUserId(user.id);
      setStudent(stuRes.data);

      if (stuRes.data && stuRes.data.id) {
        const perfRes = await marksAPI.getStudentPerformance(stuRes.data.id);
        setPerformance(perfRes.data);
      }
    } catch (err) {
      toast.error('Failed to load performance report');
    } finally {
      setLoading(false);
    }
  };

  const chartData = performance?.subjectWisePerformance
    ? performance.subjectWisePerformance.map((s) => ({
        subject: s.subjectCode,
        percentage: s.percentage
      }))
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Academic Performance & Grades</h2>
          <p className="text-muted small mb-0">
            Internal assessments, laboratory practicals, and semester examination results
          </p>
        </div>
      </div>

      {/* Aggregate Score KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">{performance?.totalAssessments || 0}</div>
            <div className="stat-label">Evaluations Completed</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card info">
            <div className="stat-value text-info">
              {performance?.totalMarksObtained || 0}
              <small className="fs-6 text-muted"> / {performance?.totalMaxMarks || 0}</small>
            </div>
            <div className="stat-label">Total Cumulative Marks</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card success">
            <div className="stat-value text-success">{performance?.averagePercentage || 0}%</div>
            <div className="stat-label">Aggregate Percentage</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card warning">
            <div className="stat-value text-warning">{performance?.overallGrade || 'N/A'}</div>
            <div className="stat-label">Final Letter Grade</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="content-card mb-4">
          <div className="card-header-custom">
            <h5>Subject Performance Comparison (%)</h5>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#4361ee" name="Percentage Score" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subject-Wise Assessment Details */}
      <h5 className="fw-bold mb-3 text-dark">Subject-Wise Assessment Breakdown</h5>
      {performance?.subjectWisePerformance && performance.subjectWisePerformance.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {performance.subjectWisePerformance.map((sub) => (
            <div key={sub.subjectId} className="content-card">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-3 border-bottom">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">
                    {sub.subjectCode} - {sub.subjectName}
                  </h6>
                  <small className="text-muted">
                    Total Marks: {sub.totalMarksObtained} / {sub.totalMaxMarks}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border px-3 py-2 fw-bold">
                    {sub.percentage}%
                  </span>
                  <span
                    className={`badge ${
                      sub.grade === 'A+' || sub.grade === 'A'
                        ? 'bg-success'
                        : sub.grade === 'B' || sub.grade === 'C'
                        ? 'bg-primary'
                        : 'bg-warning text-dark'
                    } px-3 py-2 rounded-pill`}
                  >
                    Grade {sub.grade}
                  </span>
                </div>
              </div>

              {/* Assessments table for this subject */}
              <div className="table-container">
                <table className="table table-sm table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Assessment</th>
                      <th>Conducted Date</th>
                      <th>Max Marks</th>
                      <th>Marks Scored</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.assessments && sub.assessments.length > 0 ? (
                      sub.assessments.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {a.assessmentType?.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{a.assessmentDate || 'N/A'}</td>
                          <td>{a.maxMarks}</td>
                          <td className="fw-bold text-dark">{a.marksObtained}</td>
                          <td>{a.percentage}%</td>
                          <td>
                            <span className="badge bg-secondary rounded-pill">{a.grade}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-muted text-center py-2">
                          No specific assessments recorded for this subject yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-card text-center py-5 text-muted">
          No performance or marks records found for this student.
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;
