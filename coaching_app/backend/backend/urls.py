from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r"programs", views.ProgramViewSet)
router.register(r"sites", views.SiteViewSet)
router.register(r"children", views.ChildViewSet)
router.register(r"transfers", views.TransferHistoryViewSet)
router.register(r"coaches", views.CoachViewSet)
router.register(r"sessions", views.SessionViewSet)
router.register(r"attendances", views.AttendanceViewSet)
router.register(r"homevisits", views.HomeVisitViewSet)
router.register(r"assessments", views.AssessmentViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    # JWT Auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
