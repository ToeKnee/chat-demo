from django.conf.urls import url

from .views import MessageListCreateAPIView

urlpatterns = [url(r"^$", MessageListCreateAPIView.as_view())]
