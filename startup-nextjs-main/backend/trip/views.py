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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from .models import CustomUser

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile_data = {
            "role": user.role,  
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "address": user.address,
            "gender": user.gender,
            "birth_date": user.birth_date,
            "bio": user.bio,
            "profile_image": user.profile_image.url if user.profile_image else None,
            "aadhaar_card": user.aadhaar_card.url if user.aadhaar_card else None
        }
        return Response(profile_data)

    def put(self, request):
        user = request.user
        data = request.data

        # Update fields
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.phone_number = data.get("phone_number", user.phone_number)
        user.address = data.get("address", user.address)
        user.gender = data.get("gender", user.gender)
        user.birth_date = data.get("birth_date", user.birth_date)
        user.bio = data.get("bio", user.bio)

        try:
            user.save()
            return Response({"message": "Profile updated successfully!"})
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.models import AnonymousUser
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF (JWT does not use it)
class FollowUserView(View):
    def post(self, request, user_id):
        """Follow or unfollow a user using JWT authentication"""
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)  # Authenticate the user using JWT

        if user is None or isinstance(user, AnonymousUser):
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        user_to_follow = get_object_or_404(User, id=user_id)

        if user == user_to_follow:
            return JsonResponse({"error": "You cannot follow yourself"}, status=400)

        if user_to_follow in user.following.all():
            user.following.remove(user_to_follow)
            return JsonResponse({"message": "You have unfollowed this user"}, status=200)
        else:
            user.following.add(user_to_follow)
            return JsonResponse({"message": "You are now following this user"}, status=200)
from django.http import JsonResponse
from django.views import View
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Story

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for JWT authentication
class StoryListCreateView(View):
    def get(self, request):
        """List all stories"""
        stories = Story.objects.all().order_by('-created_at')
        data = [{"id": story.id, "first_name": story.user.first_name, "text": story.text, 
                 "image": story.image.url if story.image else None,
                 "video": story.video.url if story.video else None,
                 "created_at": story.created_at} for story in stories]
        return JsonResponse(data, safe=False)

    def post(self, request):
        """Create a new story using JWT authentication"""
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if user is None:
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        text = request.POST.get("text", "")
        image = request.FILES.get("image")
        video = request.FILES.get("video")

        story = Story.objects.create(user=user, text=text, image=image, video=video)
        return JsonResponse({"message": "Story created successfully", "story_id": story.id}, status=201)

@method_decorator(csrf_exempt, name='dispatch')  
class StoryDetailView(View):
    def get(self, request, pk):
        """Retrieve a specific story"""
        story = get_object_or_404(Story, id=pk)
        data = {"id": story.id, "first_name": story.user.first_name, "text": story.text, 
                "image": story.image.url if story.image else None,
                "video": story.video.url if story.video else None,
                "created_at": story.created_at}
        return JsonResponse(data)

    def delete(self, request, pk):
        """Delete a story (Only owner can delete)"""
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if user is None:
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        story = get_object_or_404(Story, id=pk, user=user)
        story.delete()
        return JsonResponse({"message": "Story deleted successfully"}, status=200)
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Like, Story

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for JWT authentication
class LikeStoryView(View):
    def post(self, request, story_id):
        """Like or Unlike a Story"""
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if user is None:
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        story = get_object_or_404(Story, id=story_id)

        like, created = Like.objects.get_or_create(user=user, story=story)
        if not created:
            like.delete()
            return JsonResponse({"message": "You unliked the story"}, status=200)
        return JsonResponse({"message": "You liked the story"}, status=201)
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from .models import Comment, Story

@method_decorator(csrf_exempt, name='dispatch')
class CommentListCreateView(View):
    """List all comments for a story or add a new comment"""

    def get(self, request, story_id):
        """List all comments for a story"""
        comments = Comment.objects.filter(story_id=story_id).order_by('-created_at')
        data = [{"id": comment.id, "first_name": comment.user.first_name, "text": comment.text, 
                 "created_at": comment.created_at} for comment in comments]
        return JsonResponse(data, safe=False)

    def post(self, request, story_id):
        """Add a comment to a story"""
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if user is None:
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        try:
            body = json.loads(request.body)
            text = body.get("text", "").strip()

            if not text:
                return JsonResponse({"error": "Comment text is required"}, status=400)

            story = get_object_or_404(Story, id=story_id)
            comment = Comment.objects.create(user=user, story=story, text=text)
            return JsonResponse({"message": "Comment added successfully", "comment_id": comment.id}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class CommentDeleteView(View):
    """Delete a comment"""

    def delete(self, request, pk):
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)

        if user is None:
            return JsonResponse({"error": "Authentication failed. Invalid token."}, status=401)

        comment = get_object_or_404(Comment, id=pk, user=user)
        comment.delete()
        return JsonResponse({"message": "Comment deleted successfully"}, status=200)
