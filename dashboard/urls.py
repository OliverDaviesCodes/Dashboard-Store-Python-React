from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    path('recent-orders/', views.recent_orders, name='recent-orders'),
]
