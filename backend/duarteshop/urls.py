from django.urls import path
from . import views

urlpatterns = [
   path('', views.home, name="home"),
   path('product/<int:prodId>', views.product_individual, name="product_individual"),
   path('register/', views.UserSignupView.as_view(), name="register"),
]