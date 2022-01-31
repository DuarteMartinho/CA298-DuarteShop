from django.shortcuts import render
from .models import *

# Create your views here.
def home(request):
    products = Product.objects.all()
    args = {
        'title': 'Website Title',
        'products': products,
    }
    return render(request, 'home.html', args)

def product_individual(request, prodId):
    product = Product.objects.get(id=prodId)
    return render(request, 'product_individual.html', {'product': product})

