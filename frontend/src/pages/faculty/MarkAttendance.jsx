import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classAPI, subjectAPI, studentAPI, attendanceAPI, facultyAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsCalendarCheckFill,
  BsCheckAll,
  BsArrowRepeat
} from 'react-icons/bs';

const MarkAttendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyProfile, setFacultyProfile] = useState(null);

  // Form selections
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));

  // Student list & status state
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: { status: 'PRESENT'|'ABSENT', remarks: '' } }
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      setLoadingMetadata(true);
      const [clsRes, subRes] = await Promise.all([
        classAPI.getAll(),
        subjectAPI.getAll()
      ]);
      setClasses(clsRes.data);
      setSubjects(subRes.data);

      if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0].id);
      if (subRes.data.length > 0) setSelectedSubject(subRes.data[0].id);

      // Load faculty profile
      if (user?.role === 'ROLE_FACULTY') {
        const facRes = await facultyAPI.getByUserId(user.id);
        setFacultyProfile(facRes.data);
      }
    } catch (err) {
      toast.error('Failed to load classes or subjects');
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleLoadStudents = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.warning('Please select a class and subject first.');
      return;
    }

    setLoadingStudents(true);
    try {
      const [studentsRes, existingAttendanceRes] = await Promise.all([
        studentAPI.getByClassId(selectedClass),
        attendanceAPI.getByClassSubjectDate(selectedClass, selectedSubject, attendanceDate)
      ]);

      const stuList = studentsRes.data;
      setStudents(stuList);

      // Map existing records if already marked
      const existingMap = {};
      existingAttendanceRes.data.forEach((att) => {
        existingMap[att.studentId] = {
          status: att.status,
          remarks: att.remarks || ''
        };
      });

      // Default to PRESENT if no existing record
      const initialMap = {};
      stuList.forEach((st) => {
        if (existingMap[st.id]) {
          initialMap[st.id] = existingMap[st.id];
        } else {
          initialMap[st.id] = { status: 'PRESENT', remarks: '' };
        }
      });

      setAttendanceRecords(initialMap);

      if (existingAttendanceRes.data.length > 0) {
        toast.info(`Loaded existing attendance record for ${attendanceDate}`);
      } else {
        toast.success(`Loaded ${stuList.length} students for roll call`);
      }
    } catch (err) {
      toast.error('Failed to load students for this class');
    } finally {
      setLoadingStudents(false);
    }
  };

  const setStatus = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const setRemarks = (studentId, remarks) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const markAll = (status) => {
    setAttendanceRecords((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status };
      });
      return updated;
    });
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (students.length === 0) {
      toast.warning('No students loaded to submit');
      return;
    }

    const payload = {
      classId: parseInt(selectedClass),
      subjectId: parseInt(selectedSubject),
      facultyId: facultyProfile?.id || null,
      attendanceDate: attendanceDate,
      records: students.map((st) => ({
        studentId: st.id,
        status: attendanceRecords[st.id]?.status || 'PRESENT',
        remarks: attendanceRecords[st.id]?.remarks || ''
      }))
    };

    setSubmitting(true);
    try {
      await attendanceAPI.markBatch(payload);
      toast.success('Attendance recorded and saved successfully!');
    } catch (err) {
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const presentCount = Object.values(attendanceRecords).filter((r) => r.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceRecords).filter((r) => r.status === 'ABSENT').length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Record Daily Attendance</h2>
          <p className="text-muted small mb-0">
            Select curriculum subject and cohort to record daily lecture attendance in batch
          </p>
        </div>
      </div>

      {/* Class & Subject Selector Card */}
      <div className="content-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-bold text-secondary">Cohort / Class</label>
            <select
              className="form-select form-select-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={loadingMetadata}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} (Sem {cls.semester})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-bold text-secondary">Curriculum Subject</label>
            <select
              className="form-select form-select-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={loadingMetadata}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subjectCode} - {sub.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold text-secondary">Attendance Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
              onClick={handleLoadStudents}
              disabled={loadingStudents || loadingMetadata}
            >
              {loadingStudents ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <>
                  <BsArrowRepeat /> Load Register
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Form */}
      {students.length > 0 && (
        <form onSubmit={handleSubmitAttendance}>
          <div className="content-card">
            {/* Quick Actions & Counters */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 pb-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                  Present: <strong>{presentCount}</strong>
                </span>
                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2">
                  Absent: <strong>{absentCount}</strong>
                </span>
                <span className="text-muted small">
                  Total Roster: <strong>{students.length}</strong>
                </span>
              </div>

              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => markAll('PRESENT')}
                >
                  <BsCheckAll /> Mark All Present
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => markAll('ABSENT')}
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="table-container mb-4">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th style={{ width: '220px' }}>Attendance Status</th>
                    <th>Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => {
                    const status = attendanceRecords[st.id]?.status || 'PRESENT';
                    return (
                      <tr key={st.id} className={status === 'ABSENT' ? 'table-danger bg-opacity-25' : ''}>
                        <td>
                          <span className="fw-bold">{st.rollNumber}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{st.fullName}</div>
                          <small className="text-muted">{st.email}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm w-100" role="group">
                            <button
                              type="button"
                              className={`btn ${
                                status === 'PRESENT' ? 'btn-success fw-bold' : 'btn-outline-secondary'
                              }`}
                              onClick={() => setStatus(st.id, 'PRESENT')}
                            >
                              <BsCheckCircleFill className="me-1" /> Present
                            </button>
                            <button
                              type="button"
                              className={`btn ${
                                status === 'ABSENT' ? 'btn-danger fw-bold' : 'btn-outline-secondary'
                              }`}
                              onClick={() => setStatus(st.id, 'ABSENT')}
                            >
                              <BsXCircleFill className="me-1" /> Absent
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Optional remark..."
                            value={attendanceRecords[st.id]?.remarks || ''}
                            onChange={(e) => setRemarks(st.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Submitting Attendance...
                  </>
                ) : (
                  <>
                    <BsCalendarCheckFill /> Submit Attendance Register
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MarkAttendance;
