import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BsPersonCircle,
  BsMortarboardFill,
  BsBuildingCheck,
  BsPersonHeart,
  BsGeoAltFill,
  BsTelephoneFill,
  BsEnvelopeFill
} from 'react-icons/bs';

const StudentProfile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getByUserId(user.id);
      setStudent(res.data);
    } catch (err) {
      toast.error('Failed to load academic profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title mb-4">Official Student Profile</h2>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-lg-4">
          <div className="content-card text-center py-4">
            <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
              <BsPersonCircle style={{ fontSize: '4.5rem' }} />
            </div>
            <h4 className="fw-bold mb-1 text-dark">{student?.fullName}</h4>
            <div className="text-muted small mb-2">@{student?.username}</div>
            <span className="badge bg-primary px-3 py-2 rounded-pill mb-3">
              Roll No: {student?.rollNumber}
            </span>

            <div className="p-3 bg-light rounded-3 text-start mt-3 small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-semibold">Registration No:</span>
                <span className="fw-bold">{student?.registrationNumber || 'Pending'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-semibold">Class Cohort:</span>
                <span className="fw-bold">{student?.className || 'MCA II Year'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-semibold">Department:</span>
                <span className="fw-bold">{student?.department}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted fw-semibold">Semester:</span>
                <span className="fw-bold">Semester {student?.semester || 3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs / Panels */}
        <div className="col-lg-8">
          {/* Personal Information */}
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h5 className="d-flex align-items-center gap-2">
                <BsMortarboardFill className="text-primary" /> Personal & Contact Details
              </h5>
            </div>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Email Address</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2 mt-1">
                  <BsEnvelopeFill className="text-muted" /> {student?.email}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Phone Number</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2 mt-1">
                  <BsTelephoneFill className="text-muted" /> {student?.phone || 'Not registered'}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Date of Birth</div>
                <div className="fw-bold text-dark mt-1">{student?.dateOfBirth || 'N/A'}</div>
              </div>

              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Gender</div>
                <div className="fw-bold text-dark mt-1">{student?.gender || 'N/A'}</div>
              </div>

              <div className="col-12">
                <div className="text-muted small fw-semibold">Permanent Residential Address</div>
                <div className="fw-semibold text-dark d-flex align-items-start gap-2 mt-1">
                  <BsGeoAltFill className="text-muted mt-1" />
                  <span>{student?.address || 'On campus / Institutional Hostel'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="content-card">
            <div className="card-header-custom">
              <h5 className="d-flex align-items-center gap-2">
                <BsPersonHeart className="text-danger" /> Guardian / Emergency Contact
              </h5>
            </div>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Parent / Guardian Name</div>
                <div className="fw-bold text-dark mt-1">{student?.guardianName || 'N/A'}</div>
              </div>

              <div className="col-sm-6">
                <div className="text-muted small fw-semibold">Emergency Contact Phone</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2 mt-1">
                  <BsTelephoneFill className="text-muted" /> {student?.guardianPhone || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
