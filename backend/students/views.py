from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count, Q
from .models import Department, Course, Student, Enrollment
from .serializers import (
    DepartmentSerializer,
    CourseSerializer,
    StudentSerializer,
    EnrollmentSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'created_at']


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('department').all()
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'title', 'department__name']
    ordering_fields = ['code', 'title', 'credits', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        dept_id = self.request.query_params.get('department')
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        return qs


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('department').prefetch_related('enrollments__course').all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['roll_number', 'first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['roll_number', 'first_name', 'last_name', 'gpa', 'created_at', 'enrollment_date']

    def get_queryset(self):
        qs = super().get_queryset()
        dept = self.request.query_params.get('department')
        stat = self.request.query_params.get('status')
        gender = self.request.query_params.get('gender')
        search = self.request.query_params.get('search')

        if dept:
            qs = qs.filter(department_id=dept)
        if stat:
            qs = qs.filter(status__iexact=stat)
        if gender:
            qs = qs.filter(gender__iexact=gender)
        if search:
            qs = qs.filter(
                Q(roll_number__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search)
            )
        return qs


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['enrollment_date', 'grade']

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student')
        course_id = self.request.query_params.get('course')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs


class DashboardStatsView(APIView):
    """
    Returns high-level statistics for the dashboard
    """
    def get(self, request):
        total_students = Student.objects.count()
        active_students = Student.objects.filter(status='ACTIVE').count()
        inactive_students = Student.objects.filter(status='INACTIVE').count()
        graduated_students = Student.objects.filter(status='GRADUATED').count()
        total_courses = Course.objects.count()
        total_departments = Department.objects.count()
        total_enrollments = Enrollment.objects.count()
        avg_gpa = Student.objects.aggregate(avg=Avg('gpa'))['avg'] or 0.0

        dept_distribution = list(
            Department.objects.annotate(count=Count('students'))
            .values('name', 'code', 'count')
        )

        status_distribution = [
            {'status': 'Active', 'count': active_students},
            {'status': 'Inactive', 'count': inactive_students},
            {'status': 'Graduated', 'count': graduated_students},
            {'status': 'Suspended', 'count': total_students - active_students - inactive_students - graduated_students},
        ]

        return Response({
            'total_students': total_students,
            'active_students': active_students,
            'total_courses': total_courses,
            'total_departments': total_departments,
            'total_enrollments': total_enrollments,
            'average_gpa': round(avg_gpa, 2),
            'department_distribution': dept_distribution,
            'status_distribution': status_distribution,
        }, status=status.HTTP_200_OK)
