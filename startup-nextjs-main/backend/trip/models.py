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
    bio = models.TextField(blank=True, null=True)
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

    following = models.ManyToManyField("self", symmetrical=False, related_name="followers", blank=True)

    def follow(self, user):
        """Follow another user"""
        if user != self:
            self.following.add(user)

    def unfollow(self, user):
        """Unfollow a user"""
        if user in self.following.all():
            self.following.remove(user)

    def is_following(self, user):
        """Check if following a user"""
        return self.following.filter(id=user.id).exists()
class Story(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='stories')
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    video = models.FileField(upload_to='story_videos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"
class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story')  # Prevent duplicate likes
class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text}"
