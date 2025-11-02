from rest_framework import serializers
from .models import Program, Site, Child, Coach, Session, Attendance, HomeVisit, Assessment, TransferHistory

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"

class SiteSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)
    program_id = serializers.PrimaryKeyRelatedField(write_only=True, source="program", queryset=Program.objects.all())

    class Meta:
        model = Site
        fields = ["id", "name", "site_type", "address", "program", "program_id"]

class ChildSerializer(serializers.ModelSerializer):
    current_sites = SiteSerializer(many=True, read_only=True)
    current_site_ids = serializers.PrimaryKeyRelatedField(write_only=True, many=True, source="current_sites", queryset=Site.objects.all(), required=False)

    class Meta:
        model = Child
        fields = ["id", "first_name", "last_name", "dob", "gender", "unique_id", "current_sites", "current_site_ids", "notes", "created_at"]

class TransferHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferHistory
        fields = "__all__"

class CoachSerializer(serializers.ModelSerializer):
    sites = SiteSerializer(many=True, read_only=True)
    site_ids = serializers.PrimaryKeyRelatedField(write_only=True, many=True, source="sites", queryset=Site.objects.all(), required=False)

    class Meta:
        model = Coach
        fields = ["id", "name", "phone", "email", "sites", "site_ids", "active"]

class SessionSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True)
    site_id = serializers.PrimaryKeyRelatedField(write_only=True, source="site", queryset=Site.objects.all())
    coach = CoachSerializer(read_only=True)
    coach_id = serializers.PrimaryKeyRelatedField(write_only=True, source="coach", queryset=Coach.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Session
        fields = ["id", "site", "site_id", "coach", "coach_id", "date", "start_time", "end_time", "notes", "created_at"]

class AttendanceSerializer(serializers.ModelSerializer):
    session = SessionSerializer(read_only=True)
    session_id = serializers.PrimaryKeyRelatedField(write_only=True, source="session", queryset=Session.objects.all())
    child = ChildSerializer(read_only=True)
    child_id = serializers.PrimaryKeyRelatedField(write_only=True, source="child", queryset=Child.objects.all())

    class Meta:
        model = Attendance
        fields = ["id", "session", "session_id", "child", "child_id", "present", "recorded_by", "recorded_at"]
        read_only_fields = ["recorded_by", "recorded_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["recorded_by"] = request.user
        return super().create(validated_data)

class HomeVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisit
        fields = "__all__"

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = "__all__"
