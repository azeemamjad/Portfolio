from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    Portfolio, About, Skill, Project, CaseStudy, Service,
    Testimonial, Achievement, BlogPost, Resource, Newsletter,
    ContactMessage, Hobby
)
from .serializers import (
    PortfolioSerializer, PortfolioSummarySerializer, AboutSerializer,
    SkillSerializer, ProjectSerializer, ServiceSerializer,
    TestimonialSerializer, AchievementSerializer, BlogPostSerializer,
    BlogPostListSerializer, ResourceSerializer, NewsletterSerializer,
    ContactMessageSerializer, HobbySerializer
)


class PortfolioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for portfolios
    Retrieve a portfolio by username
    """
    queryset = Portfolio.objects.filter(is_active=True)
    serializer_class = PortfolioSerializer
    lookup_field = 'username'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioSummarySerializer
        return PortfolioSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for projects within a portfolio
    """
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        return Project.objects.filter(portfolio=portfolio)
    
    @action(detail=False, methods=['get'])
    def featured(self, request, username=None):
        """Get featured projects"""
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        projects = Project.objects.filter(portfolio=portfolio, is_featured=True)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for blog posts within a portfolio
    """
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        return BlogPost.objects.filter(portfolio=portfolio, status='published')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request, username=None):
        """Get featured blog posts"""
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        posts = BlogPost.objects.filter(portfolio=portfolio, status='published', is_featured=True)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for downloadable resources
    """
    serializer_class = ResourceSerializer
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        return Resource.objects.filter(portfolio=portfolio)
    
    @action(detail=True, methods=['post'])
    def download(self, request, username=None, pk=None):
        """Increment download count"""
        resource = self.get_object()
        resource.downloads += 1
        resource.save(update_fields=['downloads'])
        return Response({'status': 'download count updated'})


class NewsletterSubscribeView(generics.CreateAPIView):
    """
    API endpoint for newsletter subscription
    """
    serializer_class = NewsletterSerializer
    
    def create(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if already subscribed
        email = serializer.validated_data['email']
        subscriber, created = Newsletter.objects.get_or_create(
            portfolio=portfolio,
            email=email,
            defaults={'name': serializer.validated_data.get('name', '')}
        )
        
        if created:
            return Response(
                {'message': 'Successfully subscribed to newsletter'},
                status=status.HTTP_201_CREATED
            )
        else:
            if not subscriber.is_active:
                subscriber.is_active = True
                subscriber.save()
                return Response(
                    {'message': 'Successfully resubscribed to newsletter'},
                    status=status.HTTP_200_OK
                )
            return Response(
                {'message': 'Already subscribed'},
                status=status.HTTP_200_OK
            )


class ContactMessageView(generics.CreateAPIView):
    """
    API endpoint for contact form messages
    """
    serializer_class = ContactMessageSerializer
    
    def create(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        portfolio = get_object_or_404(Portfolio, username=username, is_active=True)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        ContactMessage.objects.create(
            portfolio=portfolio,
            **serializer.validated_data
        )
        
        return Response(
            {'message': 'Message sent successfully'},
            status=status.HTTP_201_CREATED
        )
