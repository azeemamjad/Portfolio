from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CompanyProfile, FeaturedDeveloper
from .serializers import (
    CompanyProfileSerializer,
    FeaturedDeveloperSerializer,
    FeaturedDeveloperDetailSerializer
)


class CompanyProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for company profile
    Returns the active company profile
    """
    queryset = CompanyProfile.objects.filter(is_active=True)
    serializer_class = CompanyProfileSerializer
    
    def list(self, request, *args, **kwargs):
        """Return the active company profile"""
        profile = self.queryset.first()
        if not profile:
            return Response(
                {'detail': 'No active company profile found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        """Return the active company profile by ID"""
        return self.list(request, *args, **kwargs)


class FeaturedDeveloperViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for featured developers
    Returns active featured developers ordered by display_order
    """
    queryset = FeaturedDeveloper.objects.filter(
        is_active=True,
        portfolio__is_active=True
    ).select_related('portfolio').prefetch_related('portfolio__about', 'portfolio__skills')
    serializer_class = FeaturedDeveloperSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FeaturedDeveloperDetailSerializer
        return FeaturedDeveloperSerializer
    
    @action(detail=False, methods=['get'])
    def best(self, request):
        """Get best/featured developers (same as list but with explicit endpoint)"""
        developers = self.queryset[:12]  # Limit to top 12
        serializer = self.get_serializer(developers, many=True)
        return Response(serializer.data)
