from rest_framework import serializers
from .models import (
    Portfolio, About, Skill, Project, CaseStudy, Service,
    Testimonial, Achievement, BlogPost, Resource, Newsletter,
    ContactMessage, Hobby
)


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        exclude = ['portfolio', 'id']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        exclude = ['portfolio', 'id']


class CaseStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        exclude = ['project', 'id']


class TestimonialSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Testimonial
        exclude = ['portfolio']


class ProjectSerializer(serializers.ModelSerializer):
    technologies_list = serializers.SerializerMethodField()
    case_study = CaseStudySerializer(read_only=True)
    testimonials = TestimonialSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        exclude = ['portfolio']
    
    def get_technologies_list(self, obj):
        if obj.technologies:
            return [tech.strip() for tech in obj.technologies.split(',')]
        return []


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        exclude = ['portfolio']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        exclude = ['portfolio']


class BlogPostSerializer(serializers.ModelSerializer):
    tags_list = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        exclude = ['portfolio']
    
    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lighter serializer for blog post lists"""
    tags_list = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image', 
                  'tags_list', 'is_featured', 'views', 'published_at', 'created_at']
    
    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        exclude = ['portfolio']


class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        exclude = ['portfolio']


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['email', 'name']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']


class PortfolioSerializer(serializers.ModelSerializer):
    about = AboutSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)
    testimonials = TestimonialSerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)
    hobbies = HobbySerializer(many=True, read_only=True)
    
    class Meta:
        model = Portfolio
        fields = [
            'id', 'username', 'name', 'tagline', 'profile_image', 'theme_color',
            'about', 'skills', 'projects', 'services', 'testimonials',
            'achievements', 'hobbies', 'created_at', 'updated_at'
        ]


class PortfolioSummarySerializer(serializers.ModelSerializer):
    """Lighter version for portfolio listings"""
    class Meta:
        model = Portfolio
        fields = ['id', 'username', 'name', 'tagline', 'profile_image', 'theme_color']
