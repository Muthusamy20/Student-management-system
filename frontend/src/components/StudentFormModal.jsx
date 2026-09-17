import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, BookOpen, Award, MapPin } from 'lucide-react';

export default function StudentFormModal({
  isOpen,
  student,
  departments,
  onClose,
  onSubmit,
  loading,
  serverErrors = {}
}) {
  const [formData, setFormData] = useState({
    roll_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    department: '',
    status: 'ACTIVE',
    date_of_birth: '',
    enrollment_date: '',
    gpa: '3.50',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        roll_number: student.roll_number || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone: student.phone || '',
        gender: student.gender || 'Male',
        department: student.department || '',
        status: student.status || 'ACTIVE',
        date_of_birth: student.date_of_birth || '',
        enrollment_date: student.enrollment_date || '',
        gpa: student.gpa !== undefined ? String(student.gpa) : '3.50',
        address: student.address || '',
      });
    } else {
      setFormData({
        roll_number: `STU${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'Male',
        department: departments.length > 0 ? departments[0].id : '',
        status: 'ACTIVE',
        date_of_birth: '2004-01-01',
        enrollment_date: new Date().toISOString().split('T')[0],
        gpa: '3.50',
        address: '',
      });
    }
    setErrors({});
  }, [student, departments, isOpen]);

  // Merge server errors into local error state
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      const formatted = {};
      for (const [key, val] of Object.entries(serverErrors)) {
        formatted[key] = Array.isArray(val) ? val.join(' ') : String(val);
      }
      setErrors(prev => ({ ...prev, ...formatted }));
    }
  }, [serverErrors]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.roll_number.trim()) {
      newErrors.roll_number = 'Roll number is required.';
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required.';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Phone number must contain at least 7 digits.';
    }
    const gpaNum = parseFloat(formData.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      newErrors.gpa = 'GPA must be between 0.00 and 4.00.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      roll_number: formData.roll_number.trim().toUpperCase(),
      email: formData.email.trim().toLowerCase(),
      gpa: parseFloat(formData.gpa) || 0.0,
      department: formData.department ? parseInt(formData.department, 10) : null,
      date_of_birth: formData.date_of_birth || null,
      enrollment_date: formData.enrollment_date || null,
    };

    onSubmit(payload);
  };

  const isEditing = Boolean(student);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="student-modal-title">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <h3 id="student-modal-title">{isEditing ? 'Edit Student Record' : 'Register New Student'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* Roll Number */}
              <div className="form-group">
                <label htmlFor="roll_number">Roll / Registration Number *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="roll_number"
                    name="roll_number"
                    type="text"
                    className={`form-input ${errors.roll_number ? 'input-error' : ''}`}
                    placeholder="e.g. STU2026-001"
                    value={formData.roll_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.roll_number && <span className="field-error-text">{errors.roll_number}</span>}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status">Academic Status *</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="GRADUATED">Graduated</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              {/* First Name */}
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className={`form-input ${errors.first_name ? 'input-error' : ''}`}
                  placeholder="e.g. Aarav"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                {errors.first_name && <span className="field-error-text">{errors.first_name}</span>}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className={`form-input ${errors.last_name ? 'input-error' : ''}`}
                  placeholder="e.g. Sharma"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                {errors.last_name && <span className="field-error-text">{errors.last_name}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="e.g. aarav.sharma@example.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <div className="input-with-icon">
                  <BookOpen size={16} className="input-icon" />
                  <select
                    id="department"
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* GPA */}
              <div className="form-group">
                <label htmlFor="gpa">Cumulative GPA (0.00 - 4.00) *</label>
                <div className="input-with-icon">
                  <Award size={16} className="input-icon" />
                  <input
                    id="gpa"
                    name="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className={`form-input ${errors.gpa ? 'input-error' : ''}`}
                    value={formData.gpa}
                    onChange={handleChange}
                  />
                </div>
                {errors.gpa && <span className="field-error-text">{errors.gpa}</span>}
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    className="form-input"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Enrollment Date */}
              <div className="form-group">
                <label htmlFor="enrollment_date">Admission / Enrollment Date</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <input
                    id="enrollment_date"
                    name="enrollment_date"
                    type="date"
                    className="form-input"
                    value={formData.enrollment_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label htmlFor="address">Residential Address</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-icon textarea-icon" />
                  <textarea
                    id="address"
                    name="address"
                    rows="2"
                    className="form-textarea"
                    placeholder="Enter student permanent address..."
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
