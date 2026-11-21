import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classAPI, subjectAPI, studentAPI, marksAPI, facultyAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsAwardFill,
  BsCheckCircleFill,
  BsArrowRepeat
} from 'react-icons/bs';

const EnterMarks = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyProfile, setFacultyProfile] = useState(null);

  // Form selections
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assessmentType, setAssessmentType] = useState('QUIZ');
  const [maxMarks, setMaxMarks] = useState(20);
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().slice(0, 10));

  // Students list and marks state
  const [students, setStudents] = useState([]);
  const [marksRecords, setMarksRecords] = useState({}); // { studentId: { marksObtained: 0, remarks: '' } }
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

  const handleAssessmentTypeChange = (type) => {
    setAssessmentType(type);
    if (type === 'QUIZ') setMaxMarks(20);
    else if (type === 'ASSIGNMENT') setMaxMarks(30);
    else if (type === 'MID_TERM') setMaxMarks(50);
    else if (type === 'FINAL_EXAM') setMaxMarks(100);
    else if (type === 'PRACTICAL') setMaxMarks(50);
  };

  const handleLoadStudents = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.warning('Please select a class and subject.');
      return;
    }

    setLoadingStudents(true);
    try {
      const [studentsRes, existingMarksRes] = await Promise.all([
        studentAPI.getByClassId(selectedClass),
        marksAPI.getByClassSubjectAssessment(selectedClass, selectedSubject, assessmentType)
      ]);

      const stuList = studentsRes.data;
      setStudents(stuList);

      const existingMap = {};
      existingMarksRes.data.forEach((m) => {
        existingMap[m.studentId] = {
          marksObtained: m.marksObtained,
          remarks: m.remarks || ''
        };
      });

      const initialMap = {};
      stuList.forEach((st) => {
        if (existingMap[st.id] !== undefined) {
          initialMap[st.id] = existingMap[st.id];
        } else {
          initialMap[st.id] = { marksObtained: '', remarks: '' };
        }
      });

      setMarksRecords(initialMap);

      if (existingMarksRes.data.length > 0) {
        toast.info(`Loaded ${existingMarksRes.data.length} existing marks records`);
      } else {
        toast.success(`Loaded ${stuList.length} students for evaluation`);
      }
    } catch (err) {
      toast.error('Failed to load students for marks entry');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    const num = value === '' ? '' : Math.max(0, Math.min(Number(value), maxMarks));
    setMarksRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marksObtained: num
      }
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setMarksRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: value
      }
    }));
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    if (students.length === 0) return;

    // Validate that all students have marks entered
    for (const st of students) {
      const score = marksRecords[st.id]?.marksObtained;
      if (score === '' || score === undefined || isNaN(score)) {
        toast.error(`Please enter valid marks for student: ${st.fullName} (${st.rollNumber})`);
        return;
      }
      if (score > maxMarks) {
        toast.error(`Marks for ${st.rollNumber} cannot exceed ${maxMarks}`);
        return;
      }
    }

    const payload = {
      classId: parseInt(selectedClass),
      subjectId: parseInt(selectedSubject),
      facultyId: facultyProfile?.id || null,
      assessmentType: assessmentType,
      maxMarks: parseFloat(maxMarks),
      assessmentDate: assessmentDate,
      records: students.map((st) => ({
        studentId: st.id,
        marksObtained: parseFloat(marksRecords[st.id].marksObtained),
        remarks: marksRecords[st.id].remarks || 'Evaluated'
      }))
    };

    setSubmitting(true);
    try {
      await marksAPI.saveBatch(payload);
      toast.success('Assessment marks recorded and committed to database!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit marks');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateGradePreview = (obtained) => {
    if (obtained === '' || isNaN(obtained) || maxMarks === 0) return '-';
    const pct = (obtained / maxMarks) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Enter Academic Assessment Marks</h2>
          <p className="text-muted small mb-0">
            Record grading scores for Quizzes, Assignments, Practical Labs, and Semester Examinations
          </p>
        </div>
      </div>

      {/* Evaluation Setup Header Card */}
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
                  {cls.className}
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
              disabled={loadingMetadata}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subjectCode} - {sub.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small fw-bold text-secondary">Assessment Type</label>
            <select
              className="form-select form-select-sm"
              value={assessmentType}
              onChange={(e) => handleAssessmentTypeChange(e.target.value)}
            >
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="MID_TERM">Mid-Term Exam</option>
              <option value="FINAL_EXAM">Final Exam</option>
              <option value="PRACTICAL">Practical Lab</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small fw-bold text-secondary">Max Marks</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              min="1"
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
                  <BsArrowRepeat /> Load Roster
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Marks Form */}
      {students.length > 0 && (
        <form onSubmit={handleSubmitMarks}>
          <div className="content-card">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 pb-3 border-bottom">
              <div>
                <h6 className="fw-bold mb-0">
                  Evaluation: <span className="text-primary">{assessmentType.replace('_', ' ')}</span> &bull; Maximum Marks: {maxMarks}
                </h6>
              </div>
              <span className="badge bg-light text-dark border">
                Evaluating {students.length} Student Roster Entries
              </span>
            </div>

            {/* Table */}
            <div className="table-container mb-4">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th style={{ width: '160px' }}>Marks Obtained</th>
                    <th style={{ width: '120px' }}>Percentage</th>
                    <th style={{ width: '100px' }}>Grade</th>
                    <th>Assessment Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => {
                    const score = marksRecords[st.id]?.marksObtained;
                    const pct = score !== '' && !isNaN(score) && maxMarks > 0 ? Math.round((score / maxMarks) * 1000) / 10 : '-';
                    const grade = calculateGradePreview(score);

                    return (
                      <tr key={st.id}>
                        <td>
                          <span className="fw-bold">{st.rollNumber}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{st.fullName}</div>
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0"
                              value={score !== undefined ? score : ''}
                              onChange={(e) => handleMarksChange(st.id, e.target.value)}
                              step="0.5"
                              min="0"
                              max={maxMarks}
                              required
                            />
                            <span className="input-group-text bg-light text-muted">/{maxMarks}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold">{pct !== '-' ? `${pct}%` : '-'}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              grade === 'A+' || grade === 'A'
                                ? 'bg-success'
                                : grade === 'B' || grade === 'C'
                                ? 'bg-primary'
                                : grade === 'D'
                                ? 'bg-warning text-dark'
                                : grade === 'F'
                                ? 'bg-danger'
                                : 'bg-secondary'
                            } px-2 py-1 rounded-pill`}
                          >
                            {grade}
                          </span>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. Good performance"
                            value={marksRecords[st.id]?.remarks || ''}
                            onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-success px-4 py-2 fw-bold d-flex align-items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Committing Marks...
                  </>
                ) : (
                  <>
                    <BsCheckCircleFill /> Submit & Save Marks
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

export default EnterMarks;
