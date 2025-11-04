from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

User = get_user_model()

# Use SimpleJWT's TokenObtainPairView (it expects username/password)
# If you want to customize payload, subclass TokenObtainPairSerializer.

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    # You can provide a custom serializer here if you want additional fields in token response.

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# from django.shortcuts import redirect, render
# from django.contrib.auth import authenticate, login, logout
# from django.contrib import messages
# from .models import CustomUser

# def redirect_user_based_on_role(user):
#     if user.role == 'ADMIN':
#         return redirect('admin_dashboard')
#     elif user.role == 'MANAGER':
#         return redirect('manager_dashboard')
#     elif user.role == 'COACH':
#         return redirect('coach_dashboard')
#     elif user.role == 'REPORTER':
#         return redirect('report_dashboard')
#     elif user.role == 'COORDINATOR':
#         return redirect('coordinator_dashboard')
#     else:
#         return redirect('login')

# def login_view(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return redirect_user_based_on_role(user)
#         else:
#             messages.error(request, 'Invalid username or password')
#     return render(request, 'accounts/login.html')

# def logout_view(request):
#     logout(request)
#     return redirect('login')
