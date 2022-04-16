from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 
            'price', 'image', 'isOnSale']

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'basketId', 'datetimeOrder', 'user_id', 'total_price']

class BasketItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasketItem
        fields = ['productId', 'quantity', 'price', 'product_name', 'product_desc', 'product_price', 'product_img', 'product_isOnSale', 'product_isInStock']


class BasketSerializer(serializers.ModelSerializer):
    items = BasketItemSerializer(many=True, read_only=True, source='basketitem_set')

    class Meta:
        model = Basket
        fields = ['id', 'user_id', 'is_active', 'items']

class APIUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = APIUser
        fields = ['id','email','username']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data['username']
        passsword = validated_data['password'] # Extract the username, email and passwor from the serializer
        new_user = APIUser.objects.create_user(username=username, 
						email=email, password=passsword) # Create a new APIUser
        new_user.save() # Save the new user
        return new_user

class AddBasketItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasketItem
        fields = ['productId']
    
    def create(self, validated_data):
        productId = validated_data['productId']
        request = self.context.get('request', None)
        if request:
            current_user = request.user
            shopping_basket = Basket.objects.filter(user_id=current_user, is_active=True).first()
            if shopping_basket is None:
                # create a new one
                Basket.objects.create(user_id = current_user)
                shopping_basket = Basket.objects.filter(user_id=current_user, is_active=True).first()
            # Check if the item is already in the basket
            basket_items = BasketItem.objects.filter(productId=productId, basketId=shopping_basket).first()
            if basket_items is None:
                new_basket_item = BasketItem.objects.create(basketId = shopping_basket, productId=productId)
                return new_basket_item
            else:
                basket_items.quantity = basket_items.quantity + 1 # if it is already in the basket, add to the quantity
                basket_items.save()
                return basket_items
            
        else:
            return None

class RemoveBasketItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasketItem
        fields = ['productId']

    def create(self, validated_data):
        productId = validated_data['productId']
        request = self.context.get('request', None)
        if request:
            current_user = request.user
            shopping_basket = Basket.objects.filter(user_id=current_user, is_active=True).first()
            # Check if the item is already in the basket
            basket_items = BasketItem.objects.filter(productId=productId, basketId=shopping_basket).first()
            if basket_items:
                if basket_items.quantity > 1:
                    basket_items.quantity = basket_items.quantity - 1 # if it is already in the basket, add to the quantity
                    basket_items.save()
                    return basket_items
                else:
                    basket_items.delete()
                    return BasketItem(basketId=shopping_basket, productId=productId, quantity=0)
            else:
                return BasketItem(basketId=shopping_basket, productId=productId, quantity=0)
        else:
            return None

class CheckoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['addressline1', 'addressline2', 'city', 'county', 'eircode']

    def create(self, validated_data):
        request = self.context.get('request', None)
        current_user = request.user
        addressline1 = validated_data['addressline1']
        addressline2 = validated_data['addressline2']
        city = validated_data['city']
        county = validated_data['county']
        eircode = validated_data['eircode']
        # get the shopping basket
        # mark as inactive
        basket = Basket.objects.filter(user_id=current_user, is_active=True).first()
        basket.is_active = False
        basket.save()
        # Get the individual items and show the total
        sbi = BasketItem.objects.filter(basketId=basket)
        total = 0.0
        for item in sbi:
            total += float(item.price())
        # create a new order 
        order = Order.objects.create(basketId = basket, user_id = current_user, addressline1 = addressline1, addressline2 = addressline2, city = city, county = county, eircode = eircode, total_price = total )
        # create a new empty basket for the customer 
        new_basket = Basket.objects.create(user_id = current_user)# Create a shopping basket 
        # return the order
        return order