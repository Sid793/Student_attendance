import React, { useState, useEffect } from 'react';
import { attendanceAPI, classAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsSearch,
  BsDownload,
  BsCheckCircleFill,
  BsXCircleFill,
  BsClockFill,
  BsFilterSquareFill
} from 'react-icons/bs';

const AttendanceReports = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll()
      ]);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0].id);
      if (subRes.data.length > 0) setSelectedSubject(subRes.data[0].id);
    } catch (err) {
      toast.error('Failed to load filter metadata');
    }
  };

  const handleFetchReport = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;
      if (selectedSubject) params.subjectId = selectedSubject;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await attendanceAPI.getReport(params);
      setRecords(res.data);
      if (res.data.length === 0) {
        toast.info('No attendance records found for selected criteria.');
      }
    } catch (err) {
      toast.error('Failed to load attendance report');
    } finally {
      setLoading(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (records.length === 0) {
      toast.warning('No records available to export.');
      return;
    }

    const headers = ['Date', 'Roll Number', 'Student Name', 'Subject Code', 'Subject Name', 'Class', 'Status', 'Faculty', 'Remarks'];
    const rows = records.map((r) => [
      r.attendanceDate,
      r.studentRollNumber,
      `"${r.studentName}"`,
      r.subjectCode,
      `"${r.subjectName}"`,
      `"${r.className}"`,
      r.status,
      `"${r.facultyName || 'N/A'}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalRecords = records.length;
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const percentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 1000) / 10 : 0;

  const filteredRecords = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.studentRollNumber?.toLowerCase().includes(term) ||
      r.studentName?.toLowerCase().includes(term) ||
      r.attendanceDate?.includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Attendance Audit & Reports</h2>
          <p className="text-muted small mb-0">
            Generate and export official attendance registers, date-range audits, and compliance records
          </p>
        </div>
        <button
          className="btn btn-outline-success d-flex align-items-center gap-2"
          onClick={exportToCSV}
          disabled={records.length === 0}
        >
          <BsDownload /> Export CSV Register
        </button>
      </div>

      {/* Filter Card */}
      <div className="content-card mb-4">
        <form onSubmit={handleFetchReport}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
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

            <div className="col-md-3">
              <label className="form-label small fw-bold text-secondary">Subject</label>
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
              <label className="form-label small fw-bold text-secondary">Start Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-bold text-secondary">End Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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
                    <BsFilterSquareFill /> Filter Report
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Summary KPI row */}
      {totalRecords > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="stat-card py-3">
              <div className="stat-value fs-3">{totalRecords}</div>
              <div className="stat-label">Total Student Entries</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card success py-3">
              <div className="stat-value fs-3 text-success">{presentCount}</div>
              <div className="stat-label">Total Present</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card danger py-3">
              <div className="stat-value fs-3 text-danger">{absentCount}</div>
              <div className="stat-label">Total Absent</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card warning py-3">
              <div className="stat-value fs-3 text-warning">{percentage}%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search in results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Displaying <strong>{filteredRecords.length}</strong> entries
          </span>
        </div>

        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Status</th>
                <th>Faculty In Charge</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Querying attendance records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No records found. Select filters above and click 'Filter Report'.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="fw-semibold">{r.attendanceDate}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{r.studentRollNumber}</div>
                      <small className="text-muted">{r.studentName}</small>
                    </td>
                    <td>
                      <div>{r.subjectCode}</div>
                      <small className="text-muted">{r.subjectName}</small>
                    </td>
                    <td>{r.className}</td>
                    <td>
                      {r.status === 'PRESENT' ? (
                        <span className="badge-present">
                          <BsCheckCircleFill className="text-success" /> Present
                        </span>
                      ) : (
                        <span className="badge-absent">
                          <BsXCircleFill className="text-danger" /> Absent
                        </span>
                      )}
                    </td>
                    <td>{r.facultyName || 'N/A'}</td>
                    <td>
                      <small className="text-muted">{r.remarks || '-'}</small>
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

export default AttendanceReports;
