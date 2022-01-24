from django.shortcuts import render

# Create your views here.
def home(request):
    args = {
        'title': 'Hello World',
        'name':'There!',
        'names': ['Duarte1', 'Duarte2', 'Duarte3', 'Duarte4'],
    }
    return render(request, 'home.html', args)