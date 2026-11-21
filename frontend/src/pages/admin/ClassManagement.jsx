import React, { useState, useEffect } from 'react';
import { classAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsPlusCircleFill,
  BsSearch,
  BsPencilSquare,
  BsTrashFill,
  BsBuildingCheck,
  BsPeopleFill
} from 'react-icons/bs';
import { Modal, Button, Form } from 'react-bootstrap';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const [formData, setFormData] = useState({
    className: '',
    department: 'Computer Applications',
    semester: 3,
    academicYear: '2026-2027',
    section: 'A'
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.getAll();
      setClasses(res.data);
    } catch (err) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      className: '',
      department: 'Computer Applications',
      semester: 3,
      academicYear: '2026-2027',
      section: 'A'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (cls) => {
    setIsEditing(true);
    setCurrentId(cls.id);
    setFormData({
      className: cls.className || '',
      department: cls.department || 'Computer Applications',
      semester: cls.semester || 1,
      academicYear: cls.academicYear || '2026-2027',
      section: cls.section || 'A'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await classAPI.update(currentId, formData);
        toast.success('Class updated successfully');
      } else {
        await classAPI.create(formData);
        toast.success('Class created successfully');
      }
      setShowModal(false);
      loadClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const confirmDelete = (cls) => {
    setClassToDelete(cls);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!classToDelete) return;
    try {
      await classAPI.delete(classToDelete.id);
      toast.success(`Class ${classToDelete.className} deleted.`);
      setShowDeleteModal(false);
      setClassToDelete(null);
      loadClasses();
    } catch (err) {
      toast.error('Failed to delete class');
    }
  };

  const filtered = classes.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.className?.toLowerCase().includes(term) ||
      c.department?.toLowerCase().includes(term) ||
      c.academicYear?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Class & Cohort Management</h2>
          <p className="text-muted small mb-0">
            Define academic cohorts, semesters, academic year calendars, and section divisions
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
          <BsPlusCircleFill /> Add New Class
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
              placeholder="Search by class name or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing <strong>{filtered.length}</strong> classes
          </span>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Section</th>
                <th>Enrolled Students</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading classes...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No classes found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((cls) => (
                  <tr key={cls.id}>
                    <td className="fw-bold text-dark">{cls.className}</td>
                    <td>{cls.department}</td>
                    <td>Semester {cls.semester}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{cls.academicYear}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border">
                        Sec {cls.section || 'A'}
                      </span>
                    </td>
                    <td>
                      <span className="d-inline-flex align-items-center gap-1 text-secondary fw-semibold">
                        <BsPeopleFill className="text-muted" /> {cls.studentCount || 0} Students
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleOpenEditModal(cls)}
                          title="Edit Class"
                        >
                          <BsPencilSquare />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => confirmDelete(cls)}
                          title="Delete Class"
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

      {/* Add / Edit Class Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {isEditing ? 'Edit Class Details' : 'Create New Class'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <Form.Label className="small fw-bold">Class / Cohort Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. MCA II Year - Sec A"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
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

            <div className="row g-2 mb-3">
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
                <Form.Label className="small fw-bold">Section *</Form.Label>
                <Form.Select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                >
                  {['A', 'B', 'C', 'D'].map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>

            <div className="mb-3">
              <Form.Label className="small fw-bold">Academic Year *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 2026-2027"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Create Class'}
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
          Are you sure you want to remove <strong>{classToDelete?.className}</strong>?
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

export default ClassManagement;
