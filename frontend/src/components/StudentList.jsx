import React from 'react';
import { Search, Plus, Eye, Edit3, Trash2, Filter, AlertCircle } from 'lucide-react';

export default function StudentList({
  students,
  departments,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus,
  onAddStudent,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  loading
}) {
  const statusColors = {
    ACTIVE: 'badge-active',
    INACTIVE: 'badge-inactive',
    GRADUATED: 'badge-graduated',
    SUSPENDED: 'badge-suspended',
  };

  return (
    <div className="card data-table-card">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-search-filters">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search query"
              >
                ×
              </button>
            )}
          </div>

          <div className="filters-group">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="filter-select"
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="GRADUATED">Graduated</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddStudent}>
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Contact</th>
              <th>GPA</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">
                  <div className="loading-spinner-wrapper">
                    <div className="spinner"></div>
                    <span>Loading student records...</span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">
                  <div className="empty-state">
                    <AlertCircle size={36} className="empty-icon" />
                    <h4>No student records found</h4>
                    <p>Try adjusting your search keywords or filter criteria, or add a new student.</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const initials = `${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`.toUpperCase();
                return (
                  <tr key={student.id} className="student-row">
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{initials}</div>
                        <div>
                          <div className="user-name">{student.full_name}</div>
                          <div className="user-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="roll-pill">{student.roll_number}</span>
                    </td>
                    <td>
                      <span className="dept-badge">
                        {student.department_code || student.department_name || 'General'}
                      </span>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span>{student.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="gpa-badge">{student.gpa}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[student.status] || 'badge-default'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        <button
                          className="btn-action view"
                          title="View Profile & Enrollments"
                          onClick={() => onViewStudent(student)}
                          aria-label={`View ${student.full_name}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-action edit"
                          title="Edit Student"
                          onClick={() => onEditStudent(student)}
                          aria-label={`Edit ${student.full_name}`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-action delete"
                          title="Delete Student"
                          onClick={() => onDeleteStudent(student)}
                          aria-label={`Delete ${student.full_name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer-info">
        <span>Showing {students.length} student{students.length === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}
