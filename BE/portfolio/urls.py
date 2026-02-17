from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PortfolioViewSet, ProjectViewSet, BlogPostViewSet,
    ResourceViewSet, NewsletterSubscribeView, ContactMessageView
)

# Create a router for the portfolio viewset
router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')

# URL patterns
urlpatterns = [
    # Router URLs
    path('api/', include(router.urls)),
    
    # Portfolio-specific endpoints
    path('api/<str:username>/projects/', ProjectViewSet.as_view({'get': 'list'}), name='portfolio-projects'),
    path('api/<str:username>/projects/<int:pk>/', ProjectViewSet.as_view({'get': 'retrieve'}), name='portfolio-project-detail'),
    path('api/<str:username>/projects/featured/', ProjectViewSet.as_view({'get': 'featured'}), name='portfolio-projects-featured'),
    
    path('api/<str:username>/blog/', BlogPostViewSet.as_view({'get': 'list'}), name='portfolio-blog'),
    path('api/<str:username>/blog/<int:pk>/', BlogPostViewSet.as_view({'get': 'retrieve'}), name='portfolio-blog-detail'),
    path('api/<str:username>/blog/featured/', BlogPostViewSet.as_view({'get': 'featured'}), name='portfolio-blog-featured'),
    
    path('api/<str:username>/resources/', ResourceViewSet.as_view({'get': 'list'}), name='portfolio-resources'),
    path('api/<str:username>/resources/<int:pk>/', ResourceViewSet.as_view({'get': 'retrieve'}), name='portfolio-resource-detail'),
    path('api/<str:username>/resources/<int:pk>/download/', ResourceViewSet.as_view({'post': 'download'}), name='portfolio-resource-download'),
    
    path('api/<str:username>/newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='portfolio-newsletter-subscribe'),
    path('api/<str:username>/contact/', ContactMessageView.as_view(), name='portfolio-contact'),
]
