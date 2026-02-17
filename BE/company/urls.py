from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, FeaturedDeveloperViewSet

router = DefaultRouter()
router.register(r'profile', CompanyProfileViewSet, basename='company-profile')
router.register(r'featured-developers', FeaturedDeveloperViewSet, basename='featured-developers')

urlpatterns = [
    path('', include(router.urls)),
]
