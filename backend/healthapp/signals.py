from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Appointment, Payment, PremiumSubscription, MedicalHistory, ActivityLog

@receiver(post_save, sender=CustomUser)
def log_user_creation(sender, instance, created, **kwargs):
    if created:
        # Avoid logging the superuser creation via seed command if we don't want to, 
        # but generally logging all users is fine.
        ActivityLog.objects.create(
            user=instance,
            action='USER_REGISTER',
            description=f"New user registered: {instance.username} ({instance.role})"
        )

@receiver(post_save, sender=Appointment)
def log_appointment_save(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action='APPOINTMENT_BOOKED',
            description=f"Appointment booked for {instance.appointment_date.strftime('%Y-%m-%d %H:%M')} (Status: {instance.status})"
        )
    else:
        # If it's just an update
        ActivityLog.objects.create(
            user=instance.user,
            action='APPOINTMENT_UPDATED',
            description=f"Appointment {instance.id} status updated to {instance.status}"
        )

@receiver(post_save, sender=Payment)
def log_payment_save(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action='PAYMENT_CREATED',
            description=f"Payment of {instance.amount} ({instance.payment_method}) initiated. Status: {instance.status}"
        )
    else:
        ActivityLog.objects.create(
            user=instance.user,
            action='PAYMENT_UPDATED',
            description=f"Payment {instance.transaction_id} status updated to {instance.status}"
        )

@receiver(post_save, sender=PremiumSubscription)
def log_premium_subscription_save(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action='PREMIUM_SUBSCRIBED',
            description=f"User upgraded to Premium. Expires at: {instance.expires_at.strftime('%Y-%m-%d')}"
        )

@receiver(post_save, sender=MedicalHistory)
def log_medical_history_save(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action='SCAN_UPLOADED',
            description=f"Medical scan uploaded for analysis."
        )
