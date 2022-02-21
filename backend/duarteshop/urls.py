from django.urls import path, include
from . import views
from .forms import *

from rest_framework import routers

router = routers.DefaultRouter()
router.register('products', views.ProductViewSet)

urlpatterns = [
   path('', views.home, name="home"),
   path('product/<int:prodId>', views.product_individual, name="product_individual"),
   path('register/', views.UserSignupView.as_view(), name="register"),
   path('login/',views.UserLoginView.as_view(template_name="login.html", authentication_form=UserLoginForm)),
   path('logout/', views.logout_user, name="logout"),
   path('addbasket/<int:prodid>', views.add_to_basket, name="add_basket"),
   path('basket/', views.show_basket, name="show_basket"),
   path('removeBasketItem/<int:sbi>', views.remove_basket_item, name="remove_basket_item"),
   path('order/', views.order, name="order"),
   path('success/', views.success, name="success"),
   path('orderhistory/', views.previous_orders, name="order_history"),
   path('prevorder/<int:orderId>', views.view_prev_order, name="view_prev_order"),

   path('api/', include(router.urls)),
]