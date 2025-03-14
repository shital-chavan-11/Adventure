import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
CustomUser = get_user_model() 
# Function to send OTP
def send_otp_email(email, otp):
    subject = "Your OTP for Account Verification"
    message = f"Your OTP is: {otp}. Use this to verify your email."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [email])

# ✅ Register View (For Admin & User)
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        phone_number = data.get("phone_number")
        address = data.get("address")
        gender = data.get("gender")
        birth_date = data.get("birth_date")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        profile_image = request.FILES.get("profile_image")
        aadhaar_card = request.FILES.get("aadhaar_card")
        
        # Get role from frontend, default to 'user'
        role = data.get("role", "user")
        is_admin = role.lower() == "admin"
        is_user = not is_admin  # If not admin, it's a user
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))  # Generate 6-digit OTP
        send_otp_email(email, otp)  # Send OTP to email

         
        user = CustomUser.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            address=address,
            gender=gender,
            birth_date=birth_date,
            otp=otp,
            role=role,  # Save the role properly
            is_admin=is_admin,
            is_user=is_user,
            profile_image=profile_image,
            aadhaar_card=aadhaar_card,

        )

        user.set_password(password)  # Hash password
        user.save()


        return Response({"message": "OTP sent to email for verification"}, status=status.HTTP_201_CREATED)

# ✅ OTP Verification View
class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        user = get_object_or_404(CustomUser, email=email)

        if user.otp == otp:
            user.is_verified = True
            user.otp = None  # Clear OTP after verification
            user.save()
            return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_verified:
            return Response({"error": "Email not verified. Please verify your email first."}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        # Debugging: Print user details in the backend console
        print(f"User: {user.email}, is_admin: {user.is_admin}")

        # Determine role in response
        user_role = "Admin" if user.is_admin else "User"

        return Response({
            "message": "Login successful",
            "role": user_role,  # This is what frontend receives
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

# 📍 Resend OTP View
class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        user = get_object_or_404(CustomUser, email=email)

        if user.is_verified:
            return Response({"message": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))  # Generate new OTP
        user.otp = otp
        user.save()

        send_otp_email(email, otp)  # Send OTP to user's email

        return Response({"message": "New OTP sent to email"}, status=status.HTTP_200_OK)

 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can logout

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")  # Get refresh token from request

            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token (if blacklisting is enabled)

            return Response({"message": "Successfully logged out"}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# 📍 Change Password View
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
