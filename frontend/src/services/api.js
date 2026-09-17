import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2500, // Quick timeout for fallback detection
});

// Seed data for offline / GitHub Pages mode
const INITIAL_DEPARTMENTS = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering', description: 'Core computer science, software engineering, and systems.', student_count: 3, course_count: 3 },
  { id: 2, code: 'IT', name: 'Information Technology', description: 'Applied computing, cloud technologies, and network infrastructure.', student_count: 2, course_count: 2 },
  { id: 3, code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Signal processing, VLSI, microprocessors, and IoT.', student_count: 1, course_count: 2 },
  { id: 4, code: 'MECH', name: 'Mechanical Engineering', description: 'Thermodynamics, robotics, and manufacturing engineering.', student_count: 1, course_count: 1 },
];

const INITIAL_COURSES = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', credits: 4, department: 1, department_name: 'Computer Science & Engineering', department_code: 'CSE', enrolled_count: 2, description: 'Foundations of computing and problem solving.' },
  { id: 2, code: 'CS201', title: 'Data Structures & Algorithms', credits: 4, department: 1, department_name: 'Computer Science & Engineering', department_code: 'CSE', enrolled_count: 2, description: 'Arrays, trees, graphs, sorting, and dynamic programming.' },
  { id: 3, code: 'CS301', title: 'Database Management Systems', credits: 3, department: 1, department_name: 'Computer Science & Engineering', department_code: 'CSE', enrolled_count: 2, description: 'Relational algebra, SQL, normalization, and ACID properties.' },
  { id: 4, code: 'IT202', title: 'Full-Stack Web Development', credits: 3, department: 2, department_name: 'Information Technology', department_code: 'IT', enrolled_count: 1, description: 'HTML, CSS, modern JavaScript, React, and REST APIs.' },
  { id: 5, code: 'IT305', title: 'Cloud Computing & DevOps', credits: 3, department: 2, department_name: 'Information Technology', department_code: 'IT', enrolled_count: 1, description: 'Containers, CI/CD pipelines, and cloud architecture.' },
  { id: 6, code: 'EC102', title: 'Digital Logic & Circuit Design', credits: 4, department: 3, department_name: 'Electronics & Communication Engineering', department_code: 'ECE', enrolled_count: 1, description: 'Boolean algebra, logic gates, and sequential circuits.' },
  { id: 7, code: 'EC304', title: 'Embedded Systems & Microcontrollers', credits: 3, department: 3, department_name: 'Electronics & Communication Engineering', department_code: 'ECE', enrolled_count: 1, description: 'Microcontrollers, sensors, and firmware design.' },
  { id: 8, code: 'ME105', title: 'Engineering Mechanics & CAD', credits: 3, department: 4, department_name: 'Mechanical Engineering', department_code: 'MECH', enrolled_count: 1, description: 'Statics, dynamics, and computer-aided drafting.' },
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    roll_number: 'STU2026-001',
    first_name: 'Aarav',
    last_name: 'Sharma',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@example.edu',
    phone: '+91 98765 43210',
    gender: 'Male',
    department: 1,
    department_name: 'Computer Science & Engineering',
    department_code: 'CSE',
    status: 'ACTIVE',
    gpa: '3.85',
    date_of_birth: '2003-05-14',
    enrollment_date: '2023-08-01',
    address: '42 Tech Park Avenue, Bangalore',
    enrollments: [
      { id: 101, student: 1, course: 1, course_code: 'CS101', course_title: 'Introduction to Computer Science', credits: 4, grade: 'A', enrollment_date: '2023-08-01' },
      { id: 102, student: 1, course: 2, course_code: 'CS201', course_title: 'Data Structures & Algorithms', credits: 4, grade: 'A', enrollment_date: '2023-08-01' },
      { id: 103, student: 1, course: 3, course_code: 'CS301', course_title: 'Database Management Systems', credits: 3, grade: 'B', enrollment_date: '2024-01-10' }
    ]
  },
  {
    id: 2,
    roll_number: 'STU2026-002',
    first_name: 'Diya',
    last_name: 'Patel',
    full_name: 'Diya Patel',
    email: 'diya.patel@example.edu',
    phone: '+91 98765 12345',
    gender: 'Female',
    department: 2,
    department_name: 'Information Technology',
    department_code: 'IT',
    status: 'ACTIVE',
    gpa: '3.92',
    date_of_birth: '2003-11-20',
    enrollment_date: '2023-08-01',
    address: '15 Green Valley, Ahmedabad',
    enrollments: [
      { id: 104, student: 2, course: 1, course_code: 'CS101', course_title: 'Introduction to Computer Science', credits: 4, grade: 'A', enrollment_date: '2023-08-01' },
      { id: 105, student: 2, course: 4, course_code: 'IT202', course_title: 'Full-Stack Web Development', credits: 3, grade: 'A', enrollment_date: '2023-08-01' }
    ]
  },
  {
    id: 3,
    roll_number: 'STU2026-003',
    first_name: 'Rohan',
    last_name: 'Verma',
    full_name: 'Rohan Verma',
    email: 'rohan.verma@example.edu',
    phone: '+91 98111 22334',
    gender: 'Male',
    department: 3,
    department_name: 'Electronics & Communication Engineering',
    department_code: 'ECE',
    status: 'ACTIVE',
    gpa: '3.40',
    date_of_birth: '2002-03-10',
    enrollment_date: '2022-08-01',
    address: '88 Metro Residency, New Delhi',
    enrollments: [
      { id: 106, student: 3, course: 6, course_code: 'EC102', course_title: 'Digital Logic & Circuit Design', credits: 4, grade: 'B', enrollment_date: '2022-08-01' },
      { id: 107, student: 3, course: 7, course_code: 'EC304', course_title: 'Embedded Systems & Microcontrollers', credits: 3, grade: 'A', enrollment_date: '2023-01-15' }
    ]
  },
  {
    id: 4,
    roll_number: 'STU2026-004',
    first_name: 'Ananya',
    last_name: 'Iyer',
    full_name: 'Ananya Iyer',
    email: 'ananya.iyer@example.edu',
    phone: '+91 94440 55667',
    gender: 'Female',
    department: 1,
    department_name: 'Computer Science & Engineering',
    department_code: 'CSE',
    status: 'ACTIVE',
    gpa: '3.78',
    date_of_birth: '2002-07-25',
    enrollment_date: '2022-08-01',
    address: '12 Temple Street, Chennai',
    enrollments: [
      { id: 108, student: 4, course: 2, course_code: 'CS201', course_title: 'Data Structures & Algorithms', credits: 4, grade: 'A', enrollment_date: '2022-08-01' }
    ]
  },
  {
    id: 5,
    roll_number: 'STU2026-005',
    first_name: 'Vikram',
    last_name: 'Reddy',
    full_name: 'Vikram Reddy',
    email: 'vikram.reddy@example.edu',
    phone: '+91 99887 76655',
    gender: 'Male',
    department: 4,
    department_name: 'Mechanical Engineering',
    department_code: 'MECH',
    status: 'GRADUATED',
    gpa: '3.65',
    date_of_birth: '2001-01-18',
    enrollment_date: '2021-08-01',
    address: '77 Cyber Heights, Hyderabad',
    enrollments: [
      { id: 109, student: 5, course: 8, course_code: 'ME105', course_title: 'Engineering Mechanics & CAD', credits: 3, grade: 'B', enrollment_date: '2021-08-01' }
    ]
  },
  {
    id: 6,
    roll_number: 'STU2026-006',
    first_name: 'Sneha',
    last_name: 'Mukherjee',
    full_name: 'Sneha Mukherjee',
    email: 'sneha.m@example.edu',
    phone: '+91 98300 11223',
    gender: 'Female',
    department: 2,
    department_name: 'Information Technology',
    department_code: 'IT',
    status: 'INACTIVE',
    gpa: '2.95',
    date_of_birth: '2003-09-30',
    enrollment_date: '2023-08-01',
    address: '23 Salt Lake City, Kolkata',
    enrollments: []
  }
];

// Helper to access LocalStorage cache
const getStorage = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage unavailable', e);
  }
};

// Initialize LocalStorage if empty
if (!localStorage.getItem('edutrack_students')) {
  setStorage('edutrack_students', INITIAL_STUDENTS);
  setStorage('edutrack_departments', INITIAL_DEPARTMENTS);
  setStorage('edutrack_courses', INITIAL_COURSES);
}

// Mode flag tracking backend availability
let backendAvailable = null;

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    await apiClient.get('/stats/');
    backendAvailable = true;
    return true;
  } catch (err) {
    backendAvailable = false;
    return false;
  }
}

export const studentApi = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/students/', { params });
      backendAvailable = true;
      return res;
    } catch (err) {
      backendAvailable = false;
      let list = getStorage('edutrack_students', INITIAL_STUDENTS);
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(s =>
          s.first_name.toLowerCase().includes(q) ||
          s.last_name.toLowerCase().includes(q) ||
          s.roll_number.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
      if (params.department) {
        list = list.filter(s => String(s.department) === String(params.department));
      }
      if (params.status) {
        list = list.filter(s => s.status === params.status);
      }
      return { data: list };
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/students/${id}/`);
      backendAvailable = true;
      return res;
    } catch (err) {
      backendAvailable = false;
      const list = getStorage('edutrack_students', INITIAL_STUDENTS);
      const student = list.find(s => s.id === parseInt(id, 10));
      if (!student) throw new Error('Student not found');
      return { data: student };
    }
  },

  create: async (data) => {
    try {
      const res = await apiClient.post('/students/', data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const list = getStorage('edutrack_students', INITIAL_STUDENTS);
      const depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);
      const deptObj = depts.find(d => d.id === parseInt(data.department, 10));

      if (list.some(s => s.roll_number.toUpperCase() === data.roll_number.toUpperCase())) {
        const error = new Error('Duplicate roll number');
        error.response = { data: { roll_number: ['A student with this roll number already exists.'] } };
        throw error;
      }
      if (list.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
        const error = new Error('Duplicate email');
        error.response = { data: { email: ['A student with this email address already exists.'] } };
        throw error;
      }

      const newStudent = {
        ...data,
        id: Date.now(),
        full_name: `${data.first_name} ${data.last_name}`,
        department_name: deptObj ? deptObj.name : 'General Dept',
        department_code: deptObj ? deptObj.code : 'GEN',
        enrollments: [],
      };
      list.unshift(newStudent);
      setStorage('edutrack_students', list);
      return { data: newStudent };
    }
  },

  update: async (id, data) => {
    try {
      const res = await apiClient.put(`/students/${id}/`, data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const list = getStorage('edutrack_students', INITIAL_STUDENTS);
      const depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);
      const deptObj = depts.find(d => d.id === parseInt(data.department, 10));

      const idx = list.findIndex(s => s.id === parseInt(id, 10));
      if (idx === -1) throw new Error('Student not found');

      list[idx] = {
        ...list[idx],
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        department_name: deptObj ? deptObj.name : list[idx].department_name,
        department_code: deptObj ? deptObj.code : list[idx].department_code,
      };
      setStorage('edutrack_students', list);
      return { data: list[idx] };
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/students/${id}/`);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      let list = getStorage('edutrack_students', INITIAL_STUDENTS);
      list = list.filter(s => s.id !== parseInt(id, 10));
      setStorage('edutrack_students', list);
      return { status: 204 };
    }
  },
};

export const departmentApi = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/departments/', { params });
      backendAvailable = true;
      return res;
    } catch (err) {
      backendAvailable = false;
      return { data: getStorage('edutrack_departments', INITIAL_DEPARTMENTS) };
    }
  },

  create: async (data) => {
    try {
      const res = await apiClient.post('/departments/', data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);
      const newDept = { ...data, id: Date.now(), student_count: 0, course_count: 0 };
      depts.push(newDept);
      setStorage('edutrack_departments', depts);
      return { data: newDept };
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/departments/${id}/`);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      let depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);
      depts = depts.filter(d => d.id !== parseInt(id, 10));
      setStorage('edutrack_departments', depts);
      return { status: 204 };
    }
  },
};

export const courseApi = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/courses/', { params });
      backendAvailable = true;
      return res;
    } catch (err) {
      backendAvailable = false;
      return { data: getStorage('edutrack_courses', INITIAL_COURSES) };
    }
  },

  create: async (data) => {
    try {
      const res = await apiClient.post('/courses/', data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const courses = getStorage('edutrack_courses', INITIAL_COURSES);
      const depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);
      const deptObj = depts.find(d => d.id === parseInt(data.department, 10));
      const newCourse = {
        ...data,
        id: Date.now(),
        department_name: deptObj ? deptObj.name : '',
        department_code: deptObj ? deptObj.code : '',
        enrolled_count: 0,
      };
      courses.push(newCourse);
      setStorage('edutrack_courses', courses);
      return { data: newCourse };
    }
  },

  update: async (id, data) => {
    try {
      const res = await apiClient.put(`/courses/${id}/`, data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const courses = getStorage('edutrack_courses', INITIAL_COURSES);
      const idx = courses.findIndex(c => c.id === parseInt(id, 10));
      if (idx !== -1) {
        courses[idx] = { ...courses[idx], ...data };
        setStorage('edutrack_courses', courses);
        return { data: courses[idx] };
      }
      throw new Error('Course not found');
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/courses/${id}/`);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      let courses = getStorage('edutrack_courses', INITIAL_COURSES);
      courses = courses.filter(c => c.id !== parseInt(id, 10));
      setStorage('edutrack_courses', courses);
      return { status: 204 };
    }
  },
};

export const enrollmentApi = {
  create: async (data) => {
    try {
      const res = await apiClient.post('/enrollments/', data);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const students = getStorage('edutrack_students', INITIAL_STUDENTS);
      const courses = getStorage('edutrack_courses', INITIAL_COURSES);
      const st = students.find(s => s.id === parseInt(data.student, 10));
      const co = courses.find(c => c.id === parseInt(data.course, 10));

      if (!st || !co) throw new Error('Student or Course not found');

      if (!st.enrollments) st.enrollments = [];
      if (st.enrollments.some(e => e.course === co.id)) {
        const error = new Error('Already enrolled');
        error.response = { data: { non_field_errors: ['This student is already enrolled in this course.'] } };
        throw error;
      }

      const newEnrollment = {
        id: Date.now(),
        student: st.id,
        course: co.id,
        course_code: co.code,
        course_title: co.title,
        credits: co.credits,
        grade: data.grade || 'PENDING',
        enrollment_date: new Date().toISOString().split('T')[0],
      };
      st.enrollments.push(newEnrollment);
      co.enrolled_count = (co.enrolled_count || 0) + 1;

      setStorage('edutrack_students', students);
      setStorage('edutrack_courses', courses);
      return { data: newEnrollment };
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/enrollments/${id}/`);
      backendAvailable = true;
      return res;
    } catch (err) {
      if (backendAvailable === true && err.response) throw err;
      backendAvailable = false;
      const students = getStorage('edutrack_students', INITIAL_STUDENTS);
      for (const st of students) {
        if (st.enrollments) {
          st.enrollments = st.enrollments.filter(e => e.id !== parseInt(id, 10));
        }
      }
      setStorage('edutrack_students', students);
      return { status: 204 };
    }
  },
};

export const statsApi = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/stats/');
      backendAvailable = true;
      return res;
    } catch (err) {
      backendAvailable = false;
      const students = getStorage('edutrack_students', INITIAL_STUDENTS);
      const courses = getStorage('edutrack_courses', INITIAL_COURSES);
      const depts = getStorage('edutrack_departments', INITIAL_DEPARTMENTS);

      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
      let totalGPA = 0;
      students.forEach(s => {
        totalGPA += parseFloat(s.gpa) || 0;
      });
      const avgGPA = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : '0.00';

      return {
        data: {
          total_students: totalStudents,
          active_students: activeStudents,
          total_courses: courses.length,
          total_departments: depts.length,
          average_gpa: avgGPA,
        }
      };
    }
  },
};

export { checkBackend };
export default apiClient;
