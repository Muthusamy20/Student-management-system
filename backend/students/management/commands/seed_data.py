from django.core.management.base import BaseCommand
from students.models import Department, Course, Student, Enrollment
from datetime import date


class Command(BaseCommand):
    help = 'Seeds database with realistic initial data for departments, courses, students, and enrollments'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Departments
        departments_data = [
            {"code": "CSE", "name": "Computer Science & Engineering", "description": "Core computer science, software engineering, and systems."},
            {"code": "IT", "name": "Information Technology", "description": "Applied computing, cloud technologies, and network infrastructure."},
            {"code": "ECE", "name": "Electronics & Communication Engineering", "description": "Signal processing, VLSI, microprocessors, and IoT."},
            {"code": "MECH", "name": "Mechanical Engineering", "description": "Thermodynamics, robotics, and manufacturing engineering."},
        ]

        depts = {}
        for d in departments_data:
            dept, _ = Department.objects.get_or_create(code=d["code"], defaults=d)
            depts[d["code"]] = dept

        # 2. Courses
        courses_data = [
            {"code": "CS101", "title": "Introduction to Computer Science", "credits": 4, "department": depts["CSE"]},
            {"code": "CS201", "title": "Data Structures & Algorithms", "credits": 4, "department": depts["CSE"]},
            {"code": "CS301", "title": "Database Management Systems", "credits": 3, "department": depts["CSE"]},
            {"code": "IT202", "title": "Full-Stack Web Development", "credits": 3, "department": depts["IT"]},
            {"code": "IT305", "title": "Cloud Computing & DevOps", "credits": 3, "department": depts["IT"]},
            {"code": "EC102", "title": "Digital Logic & Circuit Design", "credits": 4, "department": depts["ECE"]},
            {"code": "EC304", "title": "Embedded Systems & Microcontrollers", "credits": 3, "department": depts["ECE"]},
            {"code": "ME105", "title": "Engineering Mechanics & CAD", "credits": 3, "department": depts["MECH"]},
        ]

        courses = {}
        for c in courses_data:
            course, _ = Course.objects.get_or_create(code=c["code"], defaults=c)
            courses[c["code"]] = course

        # 3. Students
        students_data = [
            {
                "roll_number": "STU2026-001",
                "first_name": "Aarav",
                "last_name": "Sharma",
                "email": "aarav.sharma@example.edu",
                "phone": "+91 98765 43210",
                "gender": "Male",
                "date_of_birth": date(2003, 5, 14),
                "enrollment_date": date(2023, 8, 1),
                "department": depts["CSE"],
                "status": "ACTIVE",
                "gpa": 3.85,
                "address": "42 Tech Park Avenue, Bangalore"
            },
            {
                "roll_number": "STU2026-002",
                "first_name": "Diya",
                "last_name": "Patel",
                "email": "diya.patel@example.edu",
                "phone": "+91 98765 12345",
                "gender": "Female",
                "date_of_birth": date(2003, 11, 20),
                "enrollment_date": date(2023, 8, 1),
                "department": depts["IT"],
                "status": "ACTIVE",
                "gpa": 3.92,
                "address": "15 Green Valley, Ahmedabad"
            },
            {
                "roll_number": "STU2026-003",
                "first_name": "Rohan",
                "last_name": "Verma",
                "email": "rohan.verma@example.edu",
                "phone": "+91 98111 22334",
                "gender": "Male",
                "date_of_birth": date(2002, 3, 10),
                "enrollment_date": date(2022, 8, 1),
                "department": depts["ECE"],
                "status": "ACTIVE",
                "gpa": 3.40,
                "address": "88 Metro Residency, New Delhi"
            },
            {
                "roll_number": "STU2026-004",
                "first_name": "Ananya",
                "last_name": "Iyer",
                "email": "ananya.iyer@example.edu",
                "phone": "+91 94440 55667",
                "gender": "Female",
                "date_of_birth": date(2002, 7, 25),
                "enrollment_date": date(2022, 8, 1),
                "department": depts["CSE"],
                "status": "ACTIVE",
                "gpa": 3.78,
                "address": "12 Temple Street, Chennai"
            },
            {
                "roll_number": "STU2026-005",
                "first_name": "Vikram",
                "last_name": "Reddy",
                "email": "vikram.reddy@example.edu",
                "phone": "+91 99887 76655",
                "gender": "Male",
                "date_of_birth": date(2001, 1, 18),
                "enrollment_date": date(2021, 8, 1),
                "department": depts["MECH"],
                "status": "GRADUATED",
                "gpa": 3.65,
                "address": "77 Cyber Heights, Hyderabad"
            },
            {
                "roll_number": "STU2026-006",
                "first_name": "Sneha",
                "last_name": "Mukherjee",
                "email": "sneha.m@example.edu",
                "phone": "+91 98300 11223",
                "gender": "Female",
                "date_of_birth": date(2003, 9, 30),
                "enrollment_date": date(2023, 8, 1),
                "department": depts["IT"],
                "status": "INACTIVE",
                "gpa": 2.95,
                "address": "23 Salt Lake City, Kolkata"
            },
        ]

        for s in students_data:
            student, created = Student.objects.get_or_create(roll_number=s["roll_number"], defaults=s)

        # 4. Enrollments
        enrollments_data = [
            ("STU2026-001", "CS101", "A"),
            ("STU2026-001", "CS201", "A"),
            ("STU2026-001", "CS301", "B"),
            ("STU2026-002", "CS101", "A"),
            ("STU2026-002", "IT202", "A"),
            ("STU2026-002", "IT305", "B"),
            ("STU2026-003", "EC102", "B"),
            ("STU2026-003", "EC304", "A"),
            ("STU2026-004", "CS201", "A"),
            ("STU2026-004", "CS301", "A"),
            ("STU2026-005", "ME105", "B"),
        ]

        for roll, c_code, grade in enrollments_data:
            try:
                st = Student.objects.get(roll_number=roll)
                co = Course.objects.get(code=c_code)
                Enrollment.objects.get_or_create(student=st, course=co, defaults={"grade": grade})
            except Exception as e:
                self.stderr.write(f"Error enrolling {roll} in {c_code}: {e}")

        self.stdout.write(self.style.SUCCESS("Successfully seeded initial data!"))
