from django.contrib import admin
from .models import Department, Course, Student, Enrollment

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'created_at')
    search_fields = ('code', 'name')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'credits', 'department')
    list_filter = ('department', 'credits')
    search_fields = ('code', 'title')

class EnrollmentInline(admin.TabularInline):
    model = Enrollment
    extra = 1

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('roll_number', 'first_name', 'last_name', 'email', 'department', 'status', 'gpa')
    list_filter = ('department', 'status', 'gender')
    search_fields = ('roll_number', 'first_name', 'last_name', 'email')
    inlines = [EnrollmentInline]

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'grade', 'enrollment_date')
    list_filter = ('grade', 'course')
    search_fields = ('student__roll_number', 'student__first_name', 'student__last_name', 'course__code')
