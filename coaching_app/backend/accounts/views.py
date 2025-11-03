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
