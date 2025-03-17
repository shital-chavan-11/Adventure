from celery import shared_task
from datetime import timedelta
from django.utils.timezone import now
from .models import Story

@shared_task
def delete_expired_stories():
    expiration_time = now() - timedelta(hours=24)
    deleted_count, _ = Story.objects.filter(created_at__lte=expiration_time).delete()
    return f"Deleted {deleted_count} expired stories"
