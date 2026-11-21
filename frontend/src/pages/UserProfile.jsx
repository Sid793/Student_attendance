import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  BsPersonCircle,
  BsShieldLockFill,
  BsCheckCircleFill,
  BsKeyFill
} from 'react-icons/bs';

const UserProfile = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password. Check your current password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Profile & Account Settings</h2>

      <div className="row g-4">
        {/* User Information Card */}
        <div className="col-lg-5">
          <div className="content-card">
            <div className="text-center py-3">
              <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
                <BsPersonCircle style={{ fontSize: '4rem' }} />
              </div>
              <h4 className="fw-bold mb-1">{user?.fullName || user?.username}</h4>
              <span className="badge bg-primary px-3 py-2 rounded-pill">
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>

            <hr className="my-3 text-muted" />

            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex justify-content-between">
                <span className="text-muted fw-semibold">Username</span>
                <span className="fw-bold">{user?.username}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted fw-semibold">Email Address</span>
                <span className="fw-bold">{user?.email || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted fw-semibold">Account Status</span>
                <span className="badge bg-success">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-lg-7">
          <div className="content-card">
            <div className="card-header-custom">
              <h5 className="d-flex align-items-center gap-2">
                <BsShieldLockFill className="text-primary" /> Change Password
              </h5>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Current Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <BsKeyFill className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter existing password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">
                  New Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <BsCheckCircleFill /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
