from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Department, Course, Student, Enrollment
from datetime import date


class StudentAPITests(APITestCase):
    def setUp(self):
        self.dept_cs = Department.objects.create(name="Computer Science", code="CS")
        self.dept_it = Department.objects.create(name="Information Technology", code="IT")
        
        self.course_algo = Course.objects.create(
            code="CS201",
            title="Algorithms",
            credits=4,
            department=self.dept_cs
        )

        self.student = Student.objects.create(
            roll_number="STU2026-100",
            first_name="Jane",
            last_name="Doe",
            email="jane.doe@example.edu",
            phone="9876543210",
            department=self.dept_cs,
            status="ACTIVE",
            gpa=3.90
        )

    def test_create_student_success(self):
        """Test creating a student with valid inputs returns 201 Created"""
        url = reverse('student-list')
        payload = {
            "roll_number": "STU2026-101",
            "first_name": "John",
            "last_name": "Smith",
            "email": "john.smith@example.edu",
            "phone": "9876543211",
            "gender": "Male",
            "department": self.dept_cs.id,
            "status": "ACTIVE",
            "gpa": 3.75
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.filter(roll_number="STU2026-101").count(), 1)
        self.assertEqual(response.data["full_name"], "John Smith")

    def test_create_student_duplicate_roll_number(self):
        """Test creating a student with an existing roll number fails with 400"""
        url = reverse('student-list')
        payload = {
            "roll_number": "STU2026-100",  # Duplicate!
            "first_name": "Duplicate",
            "last_name": "User",
            "email": "diff.email@example.edu",
            "phone": "9876543212",
            "department": self.dept_cs.id
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("roll_number", response.data)

    def test_create_student_duplicate_email(self):
        """Test creating a student with an existing email fails with 400"""
        url = reverse('student-list')
        payload = {
            "roll_number": "STU2026-102",
            "first_name": "Unique",
            "last_name": "Person",
            "email": "jane.doe@example.edu",  # Duplicate!
            "phone": "9876543213",
            "department": self.dept_cs.id
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_read_student_list(self):
        """Test listing students returns 200 and records"""
        url = reverse('student-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_read_single_student(self):
        """Test retrieving single student returns 200 and correct details"""
        url = reverse('student-detail', kwargs={'pk': self.student.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["roll_number"], "STU2026-100")

    def test_update_student(self):
        """Test updating student details via PATCH returns 200 and persisted data"""
        url = reverse('student-detail', kwargs={'pk': self.student.id})
        payload = {"first_name": "Janet", "gpa": 3.98}
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.first_name, "Janet")
        self.assertEqual(float(self.student.gpa), 3.98)

    def test_delete_student(self):
        """Test deleting a student returns 204 No Content and removes the record"""
        url = reverse('student-detail', kwargs={'pk': self.student.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.filter(id=self.student.id).count(), 0)

    def test_course_validation_credits(self):
        """Test course with invalid credits (e.g. 10) returns 400"""
        url = reverse('course-list')
        payload = {
            "code": "CS999",
            "title": "Invalid Course",
            "credits": 10,  # Max is 6
            "department": self.dept_cs.id
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_enrollment_creation_and_duplicate_prevention(self):
        """Test enrolling student in course and preventing duplicate enrollment"""
        url = reverse('enrollment-list')
        payload = {
            "student": self.student.id,
            "course": self.course_algo.id,
            "grade": "A"
        }
        response1 = self.client.post(url, payload, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Attempt duplicate enrollment
        response2 = self.client.post(url, payload, format='json')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dashboard_stats_api(self):
        """Test GET /api/stats/ returns 200 with summary metrics"""
        url = reverse('dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_students", response.data)
        self.assertIn("active_students", response.data)
        self.assertIn("total_courses", response.data)
        self.assertIn("average_gpa", response.data)
