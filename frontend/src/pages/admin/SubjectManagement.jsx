import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsPlusCircleFill,
  BsSearch,
  BsPencilSquare,
  BsTrashFill,
  BsBookHalf
} from 'react-icons/bs';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: 'Computer Applications',
    semester: 3,
    credits: 4
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectAPI.getAll();
      setSubjects(res.data);
    } catch (err) {
      toast.error('Failed to load subjects list');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      subjectCode: '',
      subjectName: '',
      department: 'Computer Applications',
      semester: 3,
      credits: 4
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (subject) => {
    setIsEditing(true);
    setCurrentId(subject.id);
    setFormData({
      subjectCode: subject.subjectCode || '',
      subjectName: subject.subjectName || '',
      department: subject.department || 'Computer Applications',
      semester: subject.semester || 1,
      credits: subject.credits || 4
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await subjectAPI.update(currentId, formData);
        toast.success('Subject details updated');
      } else {
        await subjectAPI.create(formData);
        toast.success('Subject created successfully');
      }
      setShowModal(false);
      loadSubjects();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed. Code must be unique.';
      toast.error(msg);
    }
  };

  const confirmDelete = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await subjectAPI.delete(subjectToDelete.id);
      toast.success(`Subject ${subjectToDelete.subjectCode} removed.`);
      setShowDeleteModal(false);
      setSubjectToDelete(null);
      loadSubjects();
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  const filtered = subjects.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.subjectCode?.toLowerCase().includes(term) ||
      s.subjectName?.toLowerCase().includes(term) ||
      s.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Subject Curriculum</h2>
          <p className="text-muted small mb-0">
            Define academic course offerings, course codes, semester scheduling, and credit units
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
          <BsPlusCircleFill /> Add New Subject
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
              placeholder="Search by code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Total <strong>{filtered.length}</strong> subjects configured
          </span>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Subject Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Assigned Faculty</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading subjects...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No subjects match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">
                        {sub.subjectCode}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{sub.subjectName}</td>
                    <td>{sub.department}</td>
                    <td>Semester {sub.semester}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{sub.credits} Credits</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {sub.facultyNames && sub.facultyNames.length > 0 ? (
                          sub.facultyNames.map((name, i) => (
                            <Badge key={i} bg="secondary" className="fw-normal">
                              {name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted small">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleOpenEditModal(sub)}
                          title="Edit Subject"
                        >
                          <BsPencilSquare />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => confirmDelete(sub)}
                          title="Delete Subject"
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

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {isEditing ? 'Edit Subject' : 'Create New Subject'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <Form.Label className="small fw-bold">Subject Code *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. MCA301"
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <Form.Label className="small fw-bold">Subject Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Advanced Database Management Systems"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <Form.Label className="small fw-bold">Department *</Form.Label>
              <Form.Control
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="row g-2">
              <div className="col-6">
                <Form.Label className="small fw-bold">Semester *</Form.Label>
                <Form.Select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-6">
                <Form.Label className="small fw-bold">Credits *</Form.Label>
                <Form.Select
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  required
                >
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <option key={c} value={c}>
                      {c} Credits
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Create Subject'}
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
          Are you sure you want to delete subject <strong>{subjectToDelete?.subjectName}</strong> ({subjectToDelete?.subjectCode})?
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

export default SubjectManagement;
