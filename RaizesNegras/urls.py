from django.urls import path
from RaizesNegras.views import index
urlpatterns = [
    path('', index)
]