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
    counties = [
        ('Co. Carlow', 'Co. Carlow'), ('Co. Cavan', 'Co. Cavan'), ('Co. Clare', 'Co. Clare'), 
        ('Co. Cork', 'Co. Cork'), ('Co. Donegal', 'Co. Donegal'), ('Co. Dublin', 'Co. Dublin'), 
        ('Co. Galway', 'Co. Galway'), ('Co. Kerry', 'Co. Kerry'), ('Co. Kildare', 'Co. Kildare'), 
        ('Co. Kilkenny', 'Co. Kilkenny'), ('Co. Laois', 'Co. Laois'), ('Co. Leitrim', 'Co. Leitrim'), 
        ('Co. Limerick', 'Co. Limerick'), ('Co. Longford','Co. Longford'), ('Co. Louth', 'Co. Louth'), 
        ('Co. Mayo', 'Co. Mayo'), ('Co. Meath', 'Co. Meath'), ('Co. Monaghan', 'Co. Monaghan'), 
        ('Co. Offaly', 'Co. Offaly'), ('Co. Roscommon', 'Co. Roscommon'), ('Co. Sligo', 'Co. Sligo'),
        ('Co. Tipperary', 'Co. Tipperary'), ('Co. Waterford', 'Co. Waterford'), ('Co. Westmeath', 'Co. Westmeath'),
        ('Co. Wexford', 'Co. Wexford'), ('Co. Wicklow', 'Co. Wicklow')
    ]
    class Meta:
        model=Order
        fields = ['addressline1', 'addressline2', 'city', 'county', 'eircode']
    addressline1 = forms.CharField(label='Address Line 1', max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Address Line 1'}))
    addressline2 = forms.CharField(label='Address Line 2', max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Address Line 2'}))
    city = forms.CharField(label='City', max_length=40, widget=forms.TextInput(attrs={'placeholder': 'City'}))
    county = forms.ChoiceField(choices=counties, widget=forms.Select)
    eircode = forms.CharField(label='Eircode', max_length=7, widget=forms.TextInput(attrs={'placeholder': 'Eircode'}))