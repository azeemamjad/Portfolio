from rest_framework import serializers
from .models import CompanyProfile, FeaturedDeveloper
from portfolio.serializers import SkillSerializer, ProjectCardSerializer, PortfolioSerializer
from portfolio.models import Portfolio


class CompanyProfileSerializer(serializers.ModelSerializer):
    services_list = serializers.SerializerMethodField()
    
    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'name', 'tagline', 'description', 'logo', 'website',
            'email', 'phone', 'address', 'services', 'services_list',
            'linkedin_url', 'github_url', 'twitter_url',
            'meta_title', 'meta_description', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_services_list(self, obj):
        return obj.get_services_list()


class PortfolioCarouselSerializer(serializers.ModelSerializer):
    """Serializer for portfolio carousel with skills and featured projects."""
    skills = SkillSerializer(many=True, read_only=True)
    featured_projects = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = [
            'id', 'username', 'name', 'tagline', 'profile_image', 'theme_color',
            'skills', 'featured_projects',
        ]

    def get_featured_projects(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'projects' in obj._prefetched_objects_cache:
            projects = list(obj.projects.all())
        else:
            projects = list(obj.projects.filter(is_featured=True).order_by('order'))
        featured = [p for p in projects if p.is_featured]
        featured.sort(key=lambda p: (p.order, p.id))
        return ProjectCardSerializer(featured[:4], many=True).data


class FeaturedDeveloperSerializer(serializers.ModelSerializer):
    portfolio = PortfolioCarouselSerializer(read_only=True)
    
    class Meta:
        model = FeaturedDeveloper
        fields = [
            'id', 'portfolio', 'display_order', 'is_active',
            'featured_since', 'updated_at'
        ]
        read_only_fields = ['featured_since', 'updated_at']


class FeaturedDeveloperDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with full portfolio information"""
    portfolio = serializers.SerializerMethodField()
    
    class Meta:
        model = FeaturedDeveloper
        fields = [
            'id', 'portfolio', 'display_order', 'is_active',
            'featured_since', 'updated_at'
        ]
        read_only_fields = ['featured_since', 'updated_at']

    def get_portfolio(self, obj):
        return PortfolioSerializer(obj.portfolio).data
