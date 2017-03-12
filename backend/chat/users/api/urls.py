from django.conf.urls import url

from .views import UserCreateAPIView

urlpatterns = [
    url(r'^$', UserCreateAPIView.as_view()),
]
