import React, { useState, useEffect } from 'react';
import { marksAPI, classAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsSearch,
  BsDownload,
  BsAwardFill,
  BsGraphUpArrow,
  BsFilterSquareFill
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

const PerformanceReports = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksList, setMarksList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFilterMetadata();
  }, []);

  const loadFilterMetadata = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll()
      ]);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0].id);
    } catch (err) {
      toast.error('Failed to load classes or subjects');
    }
  };

  const handleFetchReport = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;
      if (selectedSubject) params.subjectId = selectedSubject;

      const res = await marksAPI.getReport(params);
      setMarksList(res.data);
      if (res.data.length === 0) {
        toast.info('No marks recorded for the chosen filters.');
      }
    } catch (err) {
      toast.error('Failed to load performance report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (marksList.length === 0) return;
    const headers = ['Roll Number', 'Student Name', 'Subject Code', 'Subject Name', 'Assessment Type', 'Max Marks', 'Marks Obtained', 'Percentage', 'Grade', 'Date'];
    const rows = marksList.map((m) => [
      m.studentRollNumber,
      `"${m.studentName}"`,
      m.subjectCode,
      `"${m.subjectName}"`,
      m.assessmentType,
      m.maxMarks,
      m.marksObtained,
      m.percentage,
      m.grade,
      m.assessmentDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `performance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grade Distribution Calculation for Chart
  const gradeCounts = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  let totalScoreSum = 0;
  let highestPercentage = 0;
  let lowestPercentage = 100;

  marksList.forEach((m) => {
    if (gradeCounts[m.grade] !== undefined) {
      gradeCounts[m.grade]++;
    }
    if (m.percentage !== null) {
      totalScoreSum += m.percentage;
      if (m.percentage > highestPercentage) highestPercentage = m.percentage;
      if (m.percentage < lowestPercentage) lowestPercentage = m.percentage;
    }
  });

  const averageScore = marksList.length > 0 ? Math.round((totalScoreSum / marksList.length) * 10) / 10 : 0;
  if (marksList.length === 0) {
    lowestPercentage = 0;
  }

  const gradeChartData = Object.keys(gradeCounts).map((g) => ({
    grade: g,
    count: gradeCounts[g]
  }));

  const filtered = marksList.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.studentRollNumber?.toLowerCase().includes(term) ||
      m.studentName?.toLowerCase().includes(term) ||
      m.subjectName?.toLowerCase().includes(term) ||
      m.assessmentType?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Academic Performance Reports</h2>
          <p className="text-muted small mb-0">
            Comprehensive assessment scoring audits, grade distribution trends, and class rank distributions
          </p>
        </div>
        <button
          className="btn btn-outline-success d-flex align-items-center gap-2"
          onClick={exportToCSV}
          disabled={marksList.length === 0}
        >
          <BsDownload /> Export Marks Ledger
        </button>
      </div>

      {/* Filter Card */}
      <div className="content-card mb-4">
        <form onSubmit={handleFetchReport}>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label small fw-bold text-secondary">Cohort / Class</label>
              <select
                className="form-select form-select-sm"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5">
              <label className="form-label small fw-bold text-secondary">Curriculum Subject</label>
              <select
                className="form-select form-select-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectCode} - {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <BsFilterSquareFill /> Filter Marks
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Analytics KPI Row */}
      {marksList.length > 0 && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="stat-card py-3">
                <div className="stat-value fs-3">{marksList.length}</div>
                <div className="stat-label">Evaluations Recorded</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card info py-3">
                <div className="stat-value fs-3 text-info">{averageScore}%</div>
                <div className="stat-label">Batch Average Score</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card success py-3">
                <div className="stat-value fs-3 text-success">{highestPercentage}%</div>
                <div className="stat-label">Highest Score</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card warning py-3">
                <div className="stat-value fs-3 text-warning">{lowestPercentage}%</div>
                <div className="stat-label">Lowest Score</div>
              </div>
            </div>
          </div>

          {/* Grade Distribution Bar Chart */}
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h5>Grade Distribution Overview</h5>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="grade" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4361ee" name="Students in Grade" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Marks Table */}
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by student or assessment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Displaying <strong>{filtered.length}</strong> mark entries
          </span>
        </div>

        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Assessment</th>
                <th>Date</th>
                <th>Score Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Calculating academic performance reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No marks records found. Adjust the filters above and click 'Filter Marks'.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="fw-bold">{m.studentRollNumber}</div>
                      <small className="text-muted">{m.studentName}</small>
                    </td>
                    <td>
                      <div>{m.subjectCode}</div>
                      <small className="text-muted">{m.subjectName}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {m.assessmentType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{m.assessmentDate || 'N/A'}</small>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">{m.marksObtained}</span> / {m.maxMarks}
                    </td>
                    <td>
                      <span className="fw-bold">{m.percentage}%</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          m.grade === 'A+' || m.grade === 'A'
                            ? 'bg-success'
                            : m.grade === 'B' || m.grade === 'C'
                            ? 'bg-primary'
                            : m.grade === 'D'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        } px-2 py-1 rounded-pill`}
                      >
                        {m.grade}
                      </span>
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

export default PerformanceReports;
