from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = None  # Remove username field
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    birth_date = models.DateField()
    
    otp = models.CharField(max_length=6, blank=True, null=True)  # OTP field for verification
    is_verified = models.BooleanField(default=False)  # Track email verification
    ROLE_CHOICES = [("admin", "Admin"), ("user", "User")]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    # Role Selection (Admin/User)
    is_admin = models.BooleanField(default=False)  # True if admin
    is_user = models.BooleanField(default=True)  # True if regular user

    # Profile Image
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    # Aadhaar Card for verification (upload document)
    aadhaar_card = models.ImageField(upload_to='aadhaar_cards/', blank=True, null=True)

    USERNAME_FIELD = 'email'  # Use email instead of username
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.email
