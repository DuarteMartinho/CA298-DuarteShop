from django.shortcuts import redirect, render
from django.views.generic import CreateView
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
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

class UserLoginView(LoginView):
    template_name='login.html'


def logout_user(request):
    logout(request)
    return redirect("/")

@login_required
def add_to_basket(request, prodid):
    user = request.user
    # is there a shopping basket for the user 
    basket = Basket.objects.filter(user_id=user, is_active=True).first()
    if basket is None:
        # create a new one
        Basket.objects.create(user_id = user)
        basket = Basket.objects.filter(user_id=user, is_active=True).first()
    # get the product 
    product = Product.objects.get(id=prodid)
    sbi = BasketItem.objects.filter(basketId=basket, productId = product).first()
    if sbi is None:
        # there is no basket item for that product 
        # create one 
        sbi = BasketItem(basketId=basket, productId = product)
        sbi.save()
    else:
        # a basket item already exists 
        # just add 1 to the quantity
        sbi.quantity = sbi.quantity + 1
        sbi.save()
    return render(request, 'product_individual.html', {'product': product, 'added':True})

@login_required
def show_basket(request):
    # get the user object
    # does a shopping basket exist ? if not you shopping basket is empty 
    # load all shoping basket items
    # display

    user = request.user
    basket = Basket.objects.filter(user_id=user, is_active=True).first()
    if basket is None:
        return render(request, 'basket.html', {'empty': True})
    else:
        sbi = BasketItem.objects.filter(basketId=basket)
        # is this empty ? 
        if sbi.exists():
            # normal flow
            return render(request, 'basket.html', {'basket': basket, 'sbi': sbi})
        else:
            return render(request, 'basket.html', {'empty': True})

@login_required
def remove_basket_item(request, sbi):
    basketItem = BasketItem.objects.get(id=sbi)
    if basketItem is None:
        return redirect('/basket')
    else:
        if basketItem.quantity > 1:
            basketItem.quantity = basketItem.quantity - 1
            basketItem.save()
        else:
            basketItem.delete()
    
    return redirect('/basket')

@login_required
def order(request):
    # load all the data we neeed user, basket, items
    user = request.user
    basket = Basket.objects.filter(user_id=user, is_active=True).first()
    
    # check data is ok
    if basket is None:
        return redirect('/')
    sbi = BasketItem.objects.filter(basketId=basket)
    if not sbi.exists():
        return redirect('/')
    
    # POST or GET
    if request.method == 'POST':
        # Check form is valid
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user_id = user
            order.basketId = basket
            total = 0.0
            for item in sbi:
                total += float(item.price())
            order.total_price = total
            order.save()
            basket.is_active = False
            basket.save()
            return render(request, 'ordercomplete.html', {'order': order, 'basket': basket, 'sbi': sbi})
        else:
            return render(request, 'orderform.html', {'form': form, 'basket': basket, 'sbi': sbi})
    else:
        # SHOW FORM
        form = OrderForm()
        return render(request, 'orderform.html', {'form': form, 'basket': basket, 'sbi': sbi})