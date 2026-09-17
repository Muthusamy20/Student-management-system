import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, BookOpen, Award, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { enrollmentApi } from '../services/api';

export default function StudentDetailModal({
  isOpen,
  student,
  courses,
  onClose,
  onRefreshStudent,
  onShowToast
}) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('PENDING');
  const [enrolling, setEnrolling] = useState(false);

  if (!isOpen || !student) return null;

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setEnrolling(true);
    try {
      await enrollmentApi.create({
        student: student.id,
        course: parseInt(selectedCourseId, 10),
        grade: selectedGrade,
      });
      onShowToast({ type: 'success', message: 'Course enrolled successfully!' });
      setSelectedCourseId('');
      if (onRefreshStudent) onRefreshStudent();
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] ||
                  err.response?.data?.[0] ||
                  'Failed to enroll course. Please try again.';
      onShowToast({ type: 'error', message: msg });
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (!window.confirm('Remove this course enrollment?')) return;
    try {
      await enrollmentApi.delete(enrollmentId);
      onShowToast({ type: 'success', message: 'Enrollment removed.' });
      if (onRefreshStudent) onRefreshStudent();
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to remove enrollment.' });
    }
  };

  const statusBadgeClass = {
    ACTIVE: 'badge-active',
    INACTIVE: 'badge-inactive',
    GRADUATED: 'badge-graduated',
    SUSPENDED: 'badge-suspended',
  }[student.status] || 'badge-default';

  // Find courses student is not yet enrolled in
  const enrolledCourseIds = new Set((student.enrollments || []).map(e => e.course));
  const availableCourses = courses.filter(c => !enrolledCourseIds.has(c.id));

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <div className="student-profile-title">
            <div className="student-avatar-lg">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <h3 id="detail-modal-title">{student.full_name}</h3>
              <div className="student-meta-row">
                <span className="roll-pill">{student.roll_number}</span>
                <span className={`badge ${statusBadgeClass}`}>{student.status}</span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Personal Info Grid */}
          <div className="info-cards-grid">
            <div className="info-item">
              <span className="info-label"><Mail size={14} /> Email Address</span>
              <span className="info-value">{student.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Phone size={14} /> Phone</span>
              <span className="info-value">{student.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><BookOpen size={14} /> Department</span>
              <span className="info-value">{student.department_name || 'Unassigned'} ({student.department_code || '--'})</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Award size={14} /> Cumulative GPA</span>
              <span className="info-value highlight-gpa">{student.gpa} / 4.00</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Calendar size={14} /> Date of Birth</span>
              <span className="info-value">{student.date_of_birth || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Calendar size={14} /> Enrolled On</span>
              <span className="info-value">{student.enrollment_date || 'N/A'}</span>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="enrollment-section">
            <div className="section-header-row">
              <h4>Enrolled Courses ({student.enrollments?.length || 0})</h4>
            </div>

            {(!student.enrollments || student.enrollments.length === 0) ? (
              <p className="empty-subtext">No courses enrolled yet for this student.</p>
            ) : (
              <div className="table-responsive">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Title</th>
                      <th>Credits</th>
                      <th>Enrolled Date</th>
                      <th>Grade</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.enrollments.map((enr) => (
                      <tr key={enr.id}>
                        <td><strong>{enr.course_code}</strong></td>
                        <td>{enr.course_title}</td>
                        <td>{enr.credits} cr</td>
                        <td>{enr.enrollment_date}</td>
                        <td>
                          <span className={`grade-pill grade-${enr.grade}`}>
                            {enr.grade}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon-danger"
                            title="Drop / Unenroll Course"
                            onClick={() => handleRemoveEnrollment(enr.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick Add Course Form */}
            {availableCourses.length > 0 && (
              <form onSubmit={handleEnroll} className="quick-enroll-form">
                <div className="quick-enroll-fields">
                  <select
                    className="form-select"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                  >
                    <option value="">-- Enroll in a Course --</option>
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title} ({c.credits} cr)
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select grade-select"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="D">Grade D</option>
                    <option value="F">Grade F</option>
                  </select>

                  <button type="submit" className="btn btn-secondary" disabled={enrolling || !selectedCourseId}>
                    <Plus size={16} />
                    <span>{enrolling ? 'Adding...' : 'Add Course'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
