from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class APIUser(AbstractUser):
    pass

class Product(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    description = models.TextField(null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    image = models.FileField(upload_to='products', null=True)
    isOnSale = models.BooleanField(default=False)
    isInStock = models.BooleanField(default=True)

class Basket(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(APIUser, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

class BasketItem(models.Model):
    id = models.IntegerField(primary_key=True)
    basketId = models.ForeignKey(Basket, on_delete=models.CASCADE)
    productId = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def price(self):
        return self.productId.price * self.quantity
    
    def product_name(self):
        return f"{self.productId.name}"

    def product_desc(self):
        return f"{self.productId.description}"

    def product_img(self):
        return f"{self.productId.image}"

    def product_price(self):
        return self.productId.price

    def product_isOnSale(self):
        return self.productId.isOnSale

    def product_isInStock(self):
        return self.productId.isInStock

class Order(models.Model):
    id = models.IntegerField(primary_key=True)
    basketId = models.ForeignKey(Basket, on_delete=models.CASCADE)
    user_id = models.ForeignKey(APIUser, on_delete=models.CASCADE)
    addressline1 = models.CharField(max_length=100, default = '')
    addressline2 = models.CharField(max_length=100, default = '')
    city = models.CharField(max_length=40, default = '')
    
    county = models.CharField(max_length=15, default = '') 

    country = models.CharField(max_length=7, default='IRELAND', editable=False)
    eircode = models.CharField(max_length=7, default = '')
    datetimeOrder = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
