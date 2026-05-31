from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from healthapp.models import (
    CustomUser, Role, AppointedDoctor, SpecialtyChoices, WilayaEnum, DoctorStatus,
    Coupon, Appointment, AppointmentStatus, Ticket, TicketStatus, AIModel,
    AIModelStatus, PremiumSubscription, Payment, PaymentMethod, Notification,
    NotificationType, Message, MedicalHistory
)

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seed...')

        # Create Admin
        admin, created = CustomUser.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'role': Role.ADMIN,
                'age': 35,
                'phone_number': '0000000000',
                'gender': 'm'
            }
        )
        if created:
            admin.set_password('adminpassword')
            admin.is_superuser = True
            admin.is_staff = True
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin user created.'))
        else:
            self.stdout.write('Admin user already exists.')

        # Create Normal User
        testuser, created = CustomUser.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'user@example.com',
                'role': Role.USER,
                'age': 25,
                'phone_number': '1111111111',
                'gender': 'm',
                'ai_tries': 3
            }
        )
        if created:
            testuser.set_password('testpassword')
            testuser.save()
            self.stdout.write(self.style.SUCCESS('Test user created.'))
        else:
            self.stdout.write('Test user already exists.')

        # Create Patient User
        patient, created = CustomUser.objects.get_or_create(
            username='testpatient',
            defaults={
                'email': 'patient@example.com',
                'role': Role.PATIENT,
                'age': 40,
                'phone_number': '2222222222',
                'gender': 'f',
            }
        )
        if created:
            patient.set_password('patientpassword')
            patient.save()
            self.stdout.write(self.style.SUCCESS('Patient user created.'))
        else:
            self.stdout.write('Patient user already exists.')

        # Create Appointed Doctors
        if not AppointedDoctor.objects.exists():
            doctors_data = [
                {
                    "first_name": "Ali",
                    "last_name": "Benali",
                    "specialty": SpecialtyChoices.CARDIOLOGY,
                    "wilaya": WilayaEnum.CONSTANTINE,
                    "license_number": "DOC-001",
                    "phone_number": "0555123456",
                    "address": "123 Rue Example",
                    "email": "ali.benali@example.com",
                    "external_id": "fastapi-001",
                    "status": DoctorStatus.ACTIVE
                },
                {
                    "first_name": "Nora",
                    "last_name": "Mekki",
                    "specialty": SpecialtyChoices.DERMATOLOGY,
                    "wilaya": WilayaEnum.ALGIERS,
                    "license_number": "DOC-002",
                    "phone_number": "0555789456",
                    "address": "456 Boulevard Central",
                    "email": "nora.mekki@example.com",
                    "external_id": "fastapi-002",
                    "status": DoctorStatus.ACTIVE
                }
            ]
            for doc_data in doctors_data:
                AppointedDoctor.objects.create(**doc_data)
            self.stdout.write(self.style.SUCCESS('Appointed Doctors created.'))
        else:
            self.stdout.write('Appointed Doctors already exist.')

        # Create a Coupon
        if not Coupon.objects.exists():
            Coupon.objects.create(
                coupon_code='FREE50',
                description='50% off for new users'
            )
            self.stdout.write(self.style.SUCCESS('Coupon created.'))
        else:
            self.stdout.write('Coupon already exists.')

        # Create AI Model
        if not AIModel.objects.exists():
            AIModel.objects.create(
                model_name='CancerDetector_v1',
                model_file='models/dummy_model.pkl',
                status=AIModelStatus.DEPLOYED,
                parameters={"threshold": 0.85}
            )
            self.stdout.write(self.style.SUCCESS('AI Model created.'))
        else:
            self.stdout.write('AI Model already exists.')
            
        # Create Appointment
        if not Appointment.objects.exists():
            appointment = Appointment.objects.create(
                user=patient,
                appointment_date=timezone.now() + timedelta(days=2),
                reference='REF123',
                status=AppointmentStatus.CONFIRMED
            )
            self.stdout.write(self.style.SUCCESS('Appointment created.'))
        else:
            self.stdout.write('Appointment already exists.')
            appointment = Appointment.objects.first()

        # Create Medical History
        if not MedicalHistory.objects.exists():
            MedicalHistory.objects.create(
                user=patient,
                scan='scans/dummy_scan.jpg',
                ai_interpretation={"result": "No anomalies detected", "confidence": 0.95},
                appointment=appointment
            )
            self.stdout.write(self.style.SUCCESS('Medical History created.'))
        else:
            self.stdout.write('Medical History already exists.')

        # Create Ticket
        if not Ticket.objects.exists():
            Ticket.objects.create(
                subject='Issue with login',
                description='I cannot log in from the mobile app.',
                reported_by=testuser,
                status=TicketStatus.OPEN
            )
            self.stdout.write(self.style.SUCCESS('Ticket created.'))
        else:
            self.stdout.write('Ticket already exists.')

        # Create Premium Subscription
        if not PremiumSubscription.objects.exists():
            PremiumSubscription.objects.create(
                user=patient,
                expires_at=timezone.now() + timedelta(days=30)
            )
            patient.premium_status = True
            patient.save()
            self.stdout.write(self.style.SUCCESS('Premium Subscription created.'))
        else:
            self.stdout.write('Premium Subscription already exists.')

        # Create Payment
        if not Payment.objects.exists():
            Payment.objects.create(
                user=patient,
                amount=1500.00,
                payment_method=PaymentMethod.CIB,
                transaction_id='TXN-999888777',
                status='completed'
            )
            self.stdout.write(self.style.SUCCESS('Payment created.'))
        else:
            self.stdout.write('Payment already exists.')

        # Create Notification
        if not Notification.objects.exists():
            Notification.objects.create(
                user=patient,
                notification_type=NotificationType.APPOINTMENT,
                message='Your appointment is confirmed for tomorrow.',
                is_read=False
            )
            self.stdout.write(self.style.SUCCESS('Notification created.'))
        else:
            self.stdout.write('Notification already exists.')

        # Create Message
        if not Message.objects.exists():
            Message.objects.create(
                sender=admin,
                receiver=patient,
                content='Welcome to our healthcare platform!',
                is_read=False
            )
            self.stdout.write(self.style.SUCCESS('Message created.'))
        else:
            self.stdout.write('Message already exists.')

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
