from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, ResendOTPView, LogoutView, ChangePasswordView,UserProfileView,FollowUserView, StoryListCreateView, StoryDetailView,LikeStoryView,CommentListCreateView,CommentDeleteView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
     path('profile/', UserProfileView.as_view(), name='user-profile'),
     path('follow/<int:user_id>/', FollowUserView.as_view(), name='follow-user'),
    path('stories/', StoryListCreateView.as_view(), name='story-list-create'),
    path('stories/<int:pk>/', StoryDetailView.as_view(), name='story-detail'),
    path('story/<int:story_id>/like/', LikeStoryView.as_view(), name='like-story'),
     path('story/<int:story_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comment/<int:pk>/delete/', CommentDeleteView.as_view(), name='comment-delete'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)