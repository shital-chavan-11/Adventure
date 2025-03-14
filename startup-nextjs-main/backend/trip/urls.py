from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, ResendOTPView, LogoutView, ChangePasswordView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)