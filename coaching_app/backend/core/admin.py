from django.contrib import admin
from .models import Program, Site, Child, TransferHistory, Coach, Session, Attendance, HomeVisit, Assessment

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "active")

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("name", "site_type", "program")

@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ("unique_id", "first_name", "last_name", "gender", "created_at")
    search_fields = ("unique_id", "first_name", "last_name")

@admin.register(TransferHistory)
class TransferAdmin(admin.ModelAdmin):
    list_display = ("child", "date", "from_site", "to_site")

@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "active")

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("site", "coach", "date", "start_time", "end_time")

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("session", "child", "present", "recorded_at")

@admin.register(HomeVisit)
class HomeVisitAdmin(admin.ModelAdmin):
    list_display = ("child", "coach", "date")

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ("child", "date", "type", "score")
