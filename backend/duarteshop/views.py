from django.shortcuts import render
from django.views.generic import CreateView
from django.contrib.auth import login, logout
from .forms import *
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

class UserSignupView(CreateView):
    model = APIUser
    form_class = UserSignupForm
    template_name = 'user_signup.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('/')