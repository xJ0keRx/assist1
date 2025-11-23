from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('quests', views.quests, name='quests'),
    path('compare', views.compare, name='compare'),
    path('process-questionnaire/', views.process_questionnaire, name='process_questionnaire'),
    path('api/recommendations/', views.get_recommendations, name='api_recommendations'),
]