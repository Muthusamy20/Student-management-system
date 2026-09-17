from rest_framework import serializers
from .models import Department, Course, Student, Enrollment
import re


class DepartmentSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'student_count', 'course_count', 'created_at']

    def get_student_count(self, obj):
        return obj.students.count()

    def get_course_count(self, obj):
        return obj.courses.count()


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    department_code = serializers.ReadOnlyField(source='department.code')
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'code', 'title', 'credits', 'department', 'department_name', 'department_code', 'description', 'enrolled_count', 'created_at']

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()

    def validate_credits(self, value):
        if value < 1 or value > 6:
            raise serializers.ValidationError("Credits must be between 1 and 6.")
        return value


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
    student_roll = serializers.ReadOnlyField(source='student.roll_number')
    course_title = serializers.ReadOnlyField(source='course.title')
    course_code = serializers.ReadOnlyField(source='course.code')
    credits = serializers.ReadOnlyField(source='course.credits')

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'student_name', 'student_roll', 'course_title', 'course_code', 'credits', 'enrollment_date', 'grade']

    def validate(self, data):
        # Check duplicate enrollment only on creation
        request = self.context.get('request')
        if request and request.method == 'POST':
            student = data.get('student')
            course = data.get('course')
            if Enrollment.objects.filter(student=student, course=course).exists():
                raise serializers.ValidationError("This student is already enrolled in this course.")
        return data


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    department_name = serializers.ReadOnlyField(source='department.name')
    department_code = serializers.ReadOnlyField(source='department.code')
    enrollments = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'roll_number', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'date_of_birth', 'gender', 'department',
            'department_name', 'department_code', 'status', 'enrollment_date',
            'gpa', 'address', 'enrollments', 'created_at', 'updated_at'
        ]

    def validate_roll_number(self, value):
        value = value.strip().upper()
        if not value:
            raise serializers.ValidationError("Roll number cannot be empty.")
        # Check uniqueness taking instance into account
        qs = Student.objects.filter(roll_number__iexact=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("A student with this roll number already exists.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if not value:
            raise serializers.ValidationError("Email address is required.")
        qs = Student.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("A student with this email address already exists.")
        return value

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)\+]', '', value)
        if not cleaned.isdigit() or len(cleaned) < 7:
            raise serializers.ValidationError("Please provide a valid phone number (at least 7 digits).")
        return value
