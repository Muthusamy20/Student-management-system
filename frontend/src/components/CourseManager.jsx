import React, { useState } from 'react';
import { Plus, BookOpen, Trash2, Edit3, X } from 'lucide-react';
import { courseApi } from '../services/api';

export default function CourseManager({ courses, departments, onRefresh, onShowToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: 3,
    department: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      title: '',
      credits: 3,
      department: departments.length > 0 ? departments[0].id : '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      credits: course.credits,
      department: course.department || '',
      description: course.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      onShowToast({ type: 'error', message: 'Course code and title are required.' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingCourse) {
        await courseApi.update(editingCourse.id, formData);
        onShowToast({ type: 'success', message: 'Course updated successfully!' });
      } else {
        await courseApi.create(formData);
        onShowToast({ type: 'success', message: 'Course created successfully!' });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.code?.[0] ||
                  err.response?.data?.credits?.[0] ||
                  'Failed to save course. Ensure course code is unique.';
      onShowToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete course ${course.code}?`)) return;
    try {
      await courseApi.delete(course.id);
      onShowToast({ type: 'success', message: 'Course deleted.' });
      onRefresh();
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to delete course.' });
    }
  };

  return (
    <div className="card courses-card">
      <div className="table-toolbar">
        <div>
          <h3>Academic Courses</h3>
          <p className="subtext">Manage course curriculum, credits, and department affiliations</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-card-top">
              <span className="course-code-badge">{course.code}</span>
              <span className="course-credits">{course.credits} Credits</span>
            </div>
            <h4 className="course-title">{course.title}</h4>
            <span className="course-dept-tag">{course.department_name || 'General Dept'}</span>
            <p className="course-desc">{course.description || 'No description provided.'}</p>
            <div className="course-card-footer">
              <span className="course-enrolled-count">{course.enrolled_count || 0} students enrolled</span>
              <div className="course-actions">
                <button
                  className="btn-action edit"
                  title="Edit Course"
                  onClick={() => openEditModal(course)}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  className="btn-action delete"
                  title="Delete Course"
                  onClick={() => handleDelete(course)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body form-grid">
                <div className="form-group">
                  <label htmlFor="c_code">Course Code *</label>
                  <input
                    id="c_code"
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS201"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="c_credits">Credits (1 - 6) *</label>
                  <input
                    id="c_credits"
                    type="number"
                    min="1"
                    max="6"
                    className="form-input"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value, 10) || 1 })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="c_title">Course Title *</label>
                  <input
                    id="c_title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Data Structures & Algorithms"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="c_dept">Department</label>
                  <select
                    id="c_dept"
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="c_desc">Description</label>
                  <textarea
                    id="c_desc"
                    rows="2"
                    className="form-textarea"
                    placeholder="Course outline and syllabus details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
