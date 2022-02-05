from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from django.forms import ModelForm, ModelChoiceField
from .models import APIUser, Order
from django.db import transaction

class UserSignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = APIUser

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_admin = False
        user.save()
        return user

class UserLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(UserLoginForm, self).__init__(*args, **kwargs)
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Your username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Your password'}))


class OrderForm(ModelForm):
    class Meta:
        model=Order
        fields = ['addressline1', 'addressline2', 'city', 'county', 'eircode']
    addressline1 = forms.CharField(label='Address Line 1', max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Address Line 1'}))
    addressline2 = forms.CharField(label='Address Line 2', max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Address Line 2'}))
    city = forms.CharField(label='City', max_length=40, widget=forms.TextInput(attrs={'placeholder': 'City'}))
    county = forms.CharField(label='County', max_length=15, widget=forms.TextInput(attrs={'placeholder': 'County'}))
    eircode = forms.CharField(label='Eircode', max_length=7, widget=forms.TextInput(attrs={'placeholder': 'Eircode'}))