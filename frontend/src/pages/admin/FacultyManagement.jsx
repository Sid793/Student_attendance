import React, { useState, useEffect } from 'react';
import { facultyAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsPlusCircleFill,
  BsSearch,
  BsPencilSquare,
  BsTrashFill,
  BsBookHalf,
  BsPersonBadgeFill
} from 'react-icons/bs';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

const FacultyManagement = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Assign Subjects Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [assignedSubjectIds, setAssignedSubjectIds] = useState([]);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    department: 'Computer Applications',
    designation: 'Assistant Professor',
    qualification: 'M.Tech / Ph.D.',
    dateOfJoining: '',
    subjectIds: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facRes, subRes] = await Promise.all([
        facultyAPI.getAll(),
        subjectAPI.getAll()
      ]);
      setFacultyList(facRes.data);
      setSubjects(subRes.data);
    } catch (err) {
      toast.error('Failed to load faculty information');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      department: 'Computer Applications',
      designation: 'Assistant Professor',
      qualification: 'M.Tech / Ph.D.',
      dateOfJoining: '',
      subjectIds: []
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (faculty) => {
    setIsEditing(true);
    setCurrentId(faculty.id);
    setFormData({
      employeeId: faculty.employeeId || '',
      fullName: faculty.fullName || '',
      username: faculty.username || '',
      email: faculty.email || '',
      password: '',
      phone: faculty.phone || '',
      department: faculty.department || 'Computer Applications',
      designation: faculty.designation || 'Assistant Professor',
      qualification: faculty.qualification || '',
      dateOfJoining: faculty.dateOfJoining || '',
      subjectIds: faculty.subjectIds || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await facultyAPI.update(currentId, formData);
        toast.success('Faculty profile updated successfully');
      } else {
        await facultyAPI.create(formData);
        toast.success('Faculty member added successfully');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed. Verify unique fields.';
      toast.error(msg);
    }
  };

  const openAssignSubjectsModal = (faculty) => {
    setSelectedFaculty(faculty);
    setAssignedSubjectIds(faculty.subjectIds || []);
    setShowAssignModal(true);
  };

  const handleToggleSubject = (subjectId) => {
    if (assignedSubjectIds.includes(subjectId)) {
      setAssignedSubjectIds(assignedSubjectIds.filter((id) => id !== subjectId));
    } else {
      setAssignedSubjectIds([...assignedSubjectIds, subjectId]);
    }
  };

  const handleSaveAssignedSubjects = async () => {
    try {
      await facultyAPI.assignSubjects(selectedFaculty.id, assignedSubjectIds);
      toast.success('Subject assignments updated');
      setShowAssignModal(false);
      loadData();
    } catch (err) {
      toast.error('Failed to update assigned subjects');
    }
  };

  const confirmDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!facultyToDelete) return;
    try {
      await facultyAPI.delete(facultyToDelete.id);
      toast.success(`Faculty ${facultyToDelete.fullName} removed.`);
      setShowDeleteModal(false);
      setFacultyToDelete(null);
      loadData();
    } catch (err) {
      toast.error('Failed to delete faculty member');
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      f.employeeId?.toLowerCase().includes(term) ||
      f.fullName?.toLowerCase().includes(term) ||
      f.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Faculty Management</h2>
          <p className="text-muted small mb-0">
            Manage academic staff profiles, department designations, and subject teaching allocations
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
          <BsPlusCircleFill /> Add New Faculty
        </button>
      </div>

      <div className="content-card">
        {/* Search */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID, name, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing <strong>{filteredFaculty.length}</strong> of {facultyList.length} faculty
          </span>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Faculty Member</th>
                <th>Employee ID</th>
                <th>Department & Designation</th>
                <th>Assigned Subjects</th>
                <th>Contact</th>
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
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No faculty found matching the search.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((fac) => (
                  <tr key={fac.id}>
                    <td>
                      <div className="fw-semibold text-dark">{fac.fullName}</div>
                      <small className="text-muted">@{fac.username}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{fac.employeeId}</span>
                    </td>
                    <td>
                      <div>{fac.designation || 'Faculty'}</div>
                      <small className="text-muted">{fac.department}</small>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {fac.subjectNames && fac.subjectNames.length > 0 ? (
                          fac.subjectNames.map((sub, i) => (
                            <Badge key={i} bg="primary" className="fw-normal">
                              {sub}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted small">No subjects assigned</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{fac.email}</div>
                      <small className="text-muted">{fac.phone || 'N/A'}</small>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => openAssignSubjectsModal(fac)}
                          title="Assign Subjects"
                        >
                          <BsBookHalf />
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleOpenEditModal(fac)}
                          title="Edit Faculty"
                        >
                          <BsPencilSquare />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => confirmDelete(fac)}
                          title="Delete Faculty"
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

      {/* Add / Edit Faculty Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {isEditing ? 'Edit Faculty Details' : 'Register New Faculty'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold">Employee ID *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. FAC-MCA-03"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Prof. / Dr. Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Login Username *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. faculty.username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="faculty@institution.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">
                  {isEditing ? 'Password (leave blank to keep existing)' : 'Password *'}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={isEditing ? '••••••••' : 'Initial login password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Department *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Designation</Form.Label>
                <Form.Select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Guest Faculty">Guest Faculty</option>
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Academic Qualification</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Ph.D. in Computer Science"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="small fw-bold">Date of Joining</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Create Faculty Member'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign Subjects Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Assign Subjects to {selectedFaculty?.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            Select the subjects this faculty member is authorized to teach and mark attendance for:
          </p>
          <div className="d-flex flex-column gap-2">
            {subjects.map((sub) => (
              <div key={sub.id} className="form-check p-2 rounded bg-light border">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  id={`sub-${sub.id}`}
                  checked={assignedSubjectIds.includes(sub.id)}
                  onChange={() => handleToggleSubject(sub.id)}
                />
                <label className="form-check-label fw-semibold" htmlFor={`sub-${sub.id}`}>
                  {sub.subjectCode} - {sub.subjectName}{' '}
                  <span className="text-muted small">(Sem {sub.semester})</span>
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveAssignedSubjects}>
            Save Subject Assignments
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove faculty member{' '}
          <strong>{facultyToDelete?.fullName}</strong> ({facultyToDelete?.employeeId})? This action
          will delete their account.
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

export default FacultyManagement;
