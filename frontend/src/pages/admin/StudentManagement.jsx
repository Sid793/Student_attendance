import React, { useState, useEffect } from 'react';
import { studentAPI, classAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsPlusCircleFill,
  BsSearch,
  BsPencilSquare,
  BsTrashFill,
  BsPersonBadge,
  BsEyeFill
} from 'react-icons/bs';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Delete Confirm Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    rollNumber: '',
    registrationNumber: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    classId: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    guardianName: '',
    guardianPhone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes] = await Promise.all([
        studentAPI.getAll(),
        classAPI.getAll()
      ]);
      setStudents(stuRes.data);
      setClasses(clsRes.data);
    } catch (err) {
      toast.error('Failed to load students list');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      rollNumber: '',
      registrationNumber: '',
      fullName: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      classId: classes.length > 0 ? classes[0].id : '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      guardianName: '',
      guardianPhone: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setIsEditing(true);
    setCurrentId(student.id);
    setFormData({
      rollNumber: student.rollNumber || '',
      registrationNumber: student.registrationNumber || '',
      fullName: student.fullName || '',
      username: student.username || '',
      email: student.email || '',
      password: '', // Blank unless modifying
      phone: student.phone || '',
      classId: student.classId || (classes.length > 0 ? classes[0].id : ''),
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || 'Male',
      address: student.address || '',
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await studentAPI.update(currentId, formData);
        toast.success('Student details updated successfully');
      } else {
        await studentAPI.create(formData);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed. Verify unique constraints.';
      toast.error(msg);
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentAPI.delete(studentToDelete.id);
      toast.success(`Student ${studentToDelete.fullName} removed.`);
      setShowDeleteModal(false);
      setStudentToDelete(null);
      loadData();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.rollNumber?.toLowerCase().includes(term) ||
      s.fullName?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Student Management</h2>
          <p className="text-muted small mb-0">
            Maintain institutional student directory, enrollment records, and academic profiles
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
          <BsPlusCircleFill /> Add New Student
        </button>
      </div>

      <div className="content-card">
        {/* Search Bar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by roll number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing <strong>{filteredStudents.length}</strong> of {students.length} students
          </span>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Full Name</th>
                <th>Class / Semester</th>
                <th>Contact</th>
                <th>Attendance</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No students match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div className="fw-bold">{st.rollNumber}</div>
                      <small className="text-muted">{st.registrationNumber || 'No Reg No'}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{st.fullName}</div>
                      <small className="text-muted">@{st.username}</small>
                    </td>
                    <td>
                      <div>{st.className || 'Unassigned'}</div>
                      <small className="text-muted">Sem {st.semester || '-'}</small>
                    </td>
                    <td>
                      <div>{st.email}</div>
                      <small className="text-muted">{st.phone || 'N/A'}</small>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          st.attendancePercentage >= 85
                            ? 'bg-success'
                            : st.attendancePercentage >= 75
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        } px-2 py-1 rounded-pill`}
                      >
                        {st.attendancePercentage !== null ? `${st.attendancePercentage}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleOpenEditModal(st)}
                          title="Edit Student"
                        >
                          <BsPencilSquare />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => confirmDelete(st)}
                          title="Delete Student"
                        >
                          <BsTrashFill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {isEditing ? 'Edit Student Record' : 'Register New Student'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold">Roll Number *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. MCA-2026-001"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. REG-2026-01"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Student's complete name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Assigned Class *</Form.Label>
                <Form.Select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                >
                  <option value="">Select Class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className} (Sem {cls.semester})
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Login Username *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. aarav.student"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="student@institution.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">
                  {isEditing ? 'Password (leave blank to retain current)' : 'Password *'}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={isEditing ? '••••••••' : 'Initial password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Gender</Form.Label>
                <Form.Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Guardian Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Parent or Guardian's name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Guardian Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Parent or Guardian contact"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </div>

              <div className="col-12">
                <Form.Label className="small fw-bold">Permanent Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Residential address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Create Student'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete student{' '}
          <strong>{studentToDelete?.fullName}</strong> (Roll: {studentToDelete?.rollNumber})? This will
          also cascade remove related attendance and mark records.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentManagement;
