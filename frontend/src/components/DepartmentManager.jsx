import React, { useState } from 'react';
import { Plus, Building2, Trash2, X } from 'lucide-react';
import { departmentApi } from '../services/api';

export default function DepartmentManager({ departments, onRefresh, onShowToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      onShowToast({ type: 'error', message: 'Department code and name are required.' });
      return;
    }
    setSubmitting(true);
    try {
      await departmentApi.create({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
      });
      onShowToast({ type: 'success', message: 'Department created successfully!' });
      setIsModalOpen(false);
      setFormData({ name: '', code: '', description: '' });
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.code?.[0] ||
                  err.response?.data?.name?.[0] ||
                  'Failed to create department.';
      onShowToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete department "${dept.name}"? This may impact affiliated students and courses.`)) return;
    try {
      await departmentApi.delete(dept.id);
      onShowToast({ type: 'success', message: 'Department deleted.' });
      onRefresh();
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to delete department.' });
    }
  };

  return (
    <div className="card departments-card">
      <div className="table-toolbar">
        <div>
          <h3>Academic Departments</h3>
          <p className="subtext">Configure faculties, divisions, and branches</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="dept-card">
            <div className="dept-card-top">
              <div className="dept-code-tag">{dept.code}</div>
              <button
                className="btn-icon-danger"
                title="Delete Department"
                onClick={() => handleDelete(dept)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4>{dept.name}</h4>
            <p className="dept-desc">{dept.description || 'No description provided.'}</p>
            <div className="dept-metrics">
              <span className="metric-pill">{dept.student_count || 0} Students</span>
              <span className="metric-pill">{dept.course_count || 0} Courses</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <h3>Create New Department</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body form-grid">
                <div className="form-group">
                  <label htmlFor="dept_code">Code (e.g. CSE) *</label>
                  <input
                    id="dept_code"
                    type="text"
                    className="form-input"
                    placeholder="e.g. CSE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dept_name">Department Name *</label>
                  <input
                    id="dept_name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="dept_desc">Description</label>
                  <textarea
                    id="dept_desc"
                    rows="3"
                    className="form-textarea"
                    placeholder="Brief description of department scope..."
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
                  {submitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
