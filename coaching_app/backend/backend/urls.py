from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/childprofiles/', include('childprofiles.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/coaches/', include('coaches.urls')),
    path('api/homevisits/', include('homevisits.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/', include('notifications.urls')),
    path('api/reports/', include('reports.urls')),

]
