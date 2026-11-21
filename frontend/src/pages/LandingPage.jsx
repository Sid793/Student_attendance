import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsMortarboardFill,
  BsShieldCheck,
  BsPersonCheckFill,
  BsGraphUpArrow,
  BsSpeedometer2,
  BsCheckCircleFill,
  BsArrowRight
} from 'react-icons/bs';

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 px-4 shadow-sm" style={{ background: '#0f172a' }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
            <BsMortarboardFill className="text-primary" />
            <span>SAPTS</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-outline-light btn-sm px-3 fw-semibold">
              Sign In
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm px-3">
              Access Portal <BsArrowRight className="ms-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <div className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill mb-3 fw-normal">
            MCA Major Academic Project &bull; Spring Boot + React + MySQL
          </div>
          <h1>Student Attendance &<br />Academic Performance Tracker</h1>
          <p>
            An institutional grade web application designed to streamline daily attendance
            recording, academic assessment management, and real-time performance analytics
            for administrators, faculty, and students.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/login" className="btn btn-light btn-lg px-4 py-3 fw-bold text-primary shadow">
              Open Portal Login <BsArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary text-uppercase fw-bold letter-spacing-1">System Capabilities</h6>
            <h2 className="fw-extrabold text-dark">Built for Academic Excellence</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Empowering colleges and universities with automated attendance calculations,
              assessment grading, and transparent student reports.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon-wrapper bg-primary bg-opacity-10 text-primary">
                  <BsPersonCheckFill />
                </div>
                <h4 className="fw-bold mb-3">Daily Attendance Tracking</h4>
                <p className="text-muted mb-0">
                  Faculty can select class, subject, and date to mark attendance in batch.
                  Calculates real-time percentages and automatically flags defaulters below 75%.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon-wrapper bg-success bg-opacity-10 text-success">
                  <BsGraphUpArrow />
                </div>
                <h4 className="fw-bold mb-3">Performance Analytics</h4>
                <p className="text-muted mb-0">
                  Record and evaluate Quizzes, Assignments, Mid-Terms, and Final Exams.
                  Automatic grade computation (A+, A, B, C, D, F) with visual score comparisons.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon-wrapper bg-info bg-opacity-10 text-info">
                  <BsShieldCheck />
                </div>
                <h4 className="fw-bold mb-3">Role-Based Security</h4>
                <p className="text-muted mb-0">
                  Granular Spring Security architecture powered by JWT. Discrete role dashboards
                  for Institutional Administrators, Faculty members, and enrolled Students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Roles Preview */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 fw-semibold">
                Three Distinct Stakeholder Roles
              </div>
              <h2 className="fw-bold mb-4">Designed for College Project Evaluation</h2>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3 align-items-start">
                  <BsCheckCircleFill className="text-success fs-5 mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Administrator Portal</h6>
                    <p className="text-muted small mb-0">
                      Manage institutional master records: Students, Faculty, Classes, Subjects,
                      and view institute-wide compliance reports.
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-start">
                  <BsCheckCircleFill className="text-success fs-5 mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Faculty Portal</h6>
                    <p className="text-muted small mb-0">
                      View assigned subjects, take attendance on selected dates, enter marks for
                      multiple assessment types, and monitor student progress.
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-3 align-items-start">
                  <BsCheckCircleFill className="text-success fs-5 mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Student Portal</h6>
                    <p className="text-muted small mb-0">
                      Self-service access to attendance percentage, subject breakdown, assessment marks,
                      grade reports, and academic history.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-lg p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-3 text-dark">Quick Portal Access</h5>
                <p className="text-muted small mb-4">
                  Default credentials are pre-seeded in the database for demonstration and college evaluation:
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm small mb-4">
                    <thead className="table-light">
                      <tr>
                        <th>Role</th>
                        <th>Username</th>
                        <th>Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge bg-danger">Administrator</span></td>
                        <td><code>admin</code></td>
                        <td><code>admin123</code></td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-primary">Faculty</span></td>
                        <td><code>neha.faculty</code></td>
                        <td><code>faculty123</code></td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-success">Student</span></td>
                        <td><code>aarav.student</code></td>
                        <td><code>student123</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Link to="/login" className="btn btn-primary w-100 py-2 fw-semibold">
                  Proceed to Login Screen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center">
        <div className="container">
          <small className="text-secondary">
            Student Attendance and Performance Tracking System &bull; MCA Academic Project &copy; {new Date().getFullYear()}
          </small>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
