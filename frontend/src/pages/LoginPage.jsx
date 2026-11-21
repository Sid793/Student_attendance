import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BsMortarboardFill,
  BsLockFill,
  BsPersonFill,
  BsEyeFill,
  BsEyeSlashFill,
  BsArrowLeft
} from 'react-icons/bs';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(username.trim(), password.trim());
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'ROLE_FACULTY') {
        navigate('/faculty/dashboard');
      } else if (data.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Invalid username or password, or server is unreachable.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
            <BsMortarboardFill className="fs-2" />
          </div>
          <h2>Portal Sign In</h2>
          <p className="text-muted small">
            Enter your institutional credentials to access your account
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 px-3 small rounded-3" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <BsPersonFill className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="e.g. admin or aarav.student"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <BsLockFill className="text-muted" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 ps-0"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-muted"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Viva/Testing */}
        <div className="mt-4 pt-3 border-top text-center">
          <small className="text-muted d-block mb-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
            DEMO PRESETS (1-CLICK FILL):
          </small>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              type="button"
              className="demo-pill-btn text-danger fw-semibold"
              onClick={() => fillCredentials('admin', 'admin123')}
            >
              Admin
            </button>
            <button
              type="button"
              className="demo-pill-btn text-primary fw-semibold"
              onClick={() => fillCredentials('neha.faculty', 'faculty123')}
            >
              Faculty
            </button>
            <button
              type="button"
              className="demo-pill-btn text-success fw-semibold"
              onClick={() => fillCredentials('aarav.student', 'student123')}
            >
              Student
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
            <BsArrowLeft /> Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
