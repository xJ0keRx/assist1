from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    # path('start', views.start),
    path('quests', views.quests),
    path('compare', views.compare),
]
