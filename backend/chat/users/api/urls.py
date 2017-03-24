from django.conf.urls import url
from rest_framework.authtoken import views

from .views import UserCreateAPIView

urlpatterns = [
    url(r'^$', UserCreateAPIView.as_view()),
    url(r'^token/', views.obtain_auth_token),
]
