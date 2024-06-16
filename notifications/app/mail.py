from redmail import EmailSender
from smtplib import SMTP_SSL

from app.settings import Settings

Sender = EmailSender(
    host=Settings.EMAIL_HOST,
    port=Settings.EMAIL_PORT,
    username=Settings.EMAIL_USER,
    password=Settings.EMAIL_PASS,
    cls_smtp=SMTP_SSL,
    use_starttls=False
)
