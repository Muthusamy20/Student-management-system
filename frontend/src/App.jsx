import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import StudentList from './components/StudentList';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import CourseManager from './components/CourseManager';
import DepartmentManager from './components/DepartmentManager';
import Toast from './components/Toast';
import { studentApi, departmentApi, courseApi, statsApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [apiOnline, setApiOnline] = useState(false);

  // Data states
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);

  // UI / Loading states
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ type, message }) => {
    setToast({ type, message });
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await statsApi.getStats();
      setStats(res.data);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch departments & courses
  const fetchAuxData = useCallback(async () => {
    try {
      const [deptRes, courseRes] = await Promise.all([
        departmentApi.getAll(),
        courseApi.getAll(),
      ]);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
    }
  }, []);

  // Fetch students with active search/filters
  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDept) params.department = selectedDept;
      if (selectedStatus) params.status = selectedStatus;

      const res = await studentApi.getAll(params);
      setStudents(res.data);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      showToast({ type: 'error', message: 'Unable to connect to Django REST API.' });
    } finally {
      setLoadingStudents(false);
    }
  }, [search, selectedDept, selectedStatus, showToast]);

  // Initial mount
  useEffect(() => {
    fetchAuxData();
    fetchStats();
  }, [fetchAuxData, fetchStats]);

  // Refetch students on filter change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchStudents]);

  // Refresh single student details when in detail modal
  const refreshCurrentStudentDetail = async () => {
    if (!selectedStudentForDetail) return;
    try {
      const res = await studentApi.getById(selectedStudentForDetail.id);
      setSelectedStudentForDetail(res.data);
      fetchStudents();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Student CRUD operations
  const handleOpenAddModal = () => {
    setSelectedStudentForEdit(null);
    setServerErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudentForEdit(student);
    setServerErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (student) => {
    setSelectedStudentForDetail(student);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleSaveStudent = async (payload) => {
    setFormSubmitting(true);
    setServerErrors({});
    try {
      if (selectedStudentForEdit) {
        await studentApi.update(selectedStudentForEdit.id, payload);
        showToast({ type: 'success', message: `Student ${payload.full_name || payload.roll_number} updated!` });
      } else {
        await studentApi.create(payload);
        showToast({ type: 'success', message: `Student ${payload.full_name || payload.roll_number} added!` });
      }
      setIsFormModalOpen(false);
      fetchStudents();
      fetchStats();
      fetchAuxData();
    } catch (err) {
      if (err.response?.data) {
        setServerErrors(err.response.data);
        showToast({ type: 'error', message: 'Please correct the highlighted fields.' });
      } else {
        showToast({ type: 'error', message: 'Failed to save student. Check backend connection.' });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleteSubmitting(true);
    try {
      await studentApi.delete(studentToDelete.id);
      showToast({ type: 'success', message: `Deleted ${studentToDelete.full_name} (${studentToDelete.roll_number}).` });
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents();
      fetchStats();
      fetchAuxData();
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to delete student record.' });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
      />

      <main className="main-container">
        {/* Metric Cards Banner */}
        <StatCards stats={stats} loading={loadingStats} />

        {/* Tab Content */}
        {activeTab === 'students' && (
          <StudentList
            students={students}
            departments={departments}
            search={search}
            setSearch={setSearch}
            selectedDept={selectedDept}
            setSelectedDept={setSelectedDept}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onAddStudent={handleOpenAddModal}
            onViewStudent={handleOpenDetailModal}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={handleOpenDeleteModal}
            loading={loadingStudents}
          />
        )}

        {activeTab === 'courses' && (
          <CourseManager
            courses={courses}
            departments={departments}
            onRefresh={() => {
              fetchAuxData();
              fetchStats();
            }}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentManager
            departments={departments}
            onRefresh={() => {
              fetchAuxData();
              fetchStats();
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        student={selectedStudentForEdit}
        departments={departments}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveStudent}
        loading={formSubmitting}
        serverErrors={serverErrors}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        student={selectedStudentForDetail}
        courses={courses}
        onClose={() => setIsDetailModalOpen(false)}
        onRefreshStudent={refreshCurrentStudentDetail}
        onShowToast={showToast}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirm Student Removal"
        message={studentToDelete ? `Are you sure you want to remove ${studentToDelete.full_name} (${studentToDelete.roll_number})? All course enrollments for this student will also be removed.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        loading={deleteSubmitting}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
