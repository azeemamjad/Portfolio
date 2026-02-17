from django.contrib import admin
from .models import (
    Portfolio, About, Skill, Project, CaseStudy, Service,
    Testimonial, Achievement, BlogPost, Resource, Newsletter,
    ContactMessage, Hobby
)


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['username', 'name', 'user', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['username', 'name', 'user__username', 'tagline']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'username', 'name', 'tagline', 'profile_image')
        }),
        ('Settings', {
            'fields': ('is_active', 'theme_color')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'location', 'email']
    search_fields = ['portfolio__username', 'bio']
    
    fieldsets = (
        ('Portfolio', {
            'fields': ('portfolio',)
        }),
        ('Bio Information', {
            'fields': ('bio', 'background', 'career_path', 'values')
        }),
        ('Contact Information', {
            'fields': ('location', 'email', 'phone')
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'github_url', 'twitter_url', 'website_url')
        }),
        ('Resume', {
            'fields': ('resume_file',)
        }),
    )


class CaseStudyInline(admin.StackedInline):
    model = CaseStudy
    extra = 0


class TestimonialInline(admin.TabularInline):
    model = Testimonial
    extra = 0
    fields = ['client_name', 'content', 'rating', 'is_featured']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'is_featured', 'order', 'created_at']
    list_filter = ['is_featured', 'created_at', 'portfolio']
    search_fields = ['title', 'description', 'technologies']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('portfolio', 'title', 'slug', 'description', 'detailed_description')
        }),
        ('Media', {
            'fields': ('image', 'thumbnail')
        }),
        ('Project Details', {
            'fields': ('technologies', 'outcome', 'start_date', 'end_date')
        }),
        ('Links', {
            'fields': ('live_url', 'github_url', 'demo_url')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'order')
        }),
    )
    
    inlines = [CaseStudyInline, TestimonialInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'portfolio', 'category', 'proficiency', 'proficiency_percentage', 'order']
    list_filter = ['category', 'proficiency', 'portfolio']
    search_fields = ['name', 'portfolio__username']
    list_editable = ['order', 'proficiency_percentage']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'price_range', 'order']
    list_filter = ['portfolio']
    search_fields = ['title', 'description']
    list_editable = ['order']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'portfolio', 'rating', 'is_featured', 'order', 'date']
    list_filter = ['is_featured', 'rating', 'portfolio', 'date']
    search_fields = ['client_name', 'client_company', 'content']
    list_editable = ['is_featured', 'order']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'type', 'issuer', 'date_received', 'order']
    list_filter = ['type', 'portfolio', 'date_received']
    search_fields = ['title', 'issuer', 'description']
    list_editable = ['order']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'status', 'is_featured', 'views', 'published_at']
    list_filter = ['status', 'is_featured', 'portfolio', 'published_at']
    search_fields = ['title', 'content', 'tags']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'is_featured']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('portfolio', 'title', 'slug', 'excerpt', 'content')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Metadata', {
            'fields': ('tags', 'status', 'is_featured')
        }),
        ('Stats', {
            'fields': ('views', 'published_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'file_type', 'downloads', 'created_at']
    list_filter = ['portfolio', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['downloads']


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'portfolio', 'is_active', 'subscribed_at']
    list_filter = ['is_active', 'portfolio', 'subscribed_at']
    search_fields = ['email', 'name']
    list_editable = ['is_active']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'portfolio', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'portfolio', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']


@admin.register(Hobby)
class HobbyAdmin(admin.ModelAdmin):
    list_display = ['title', 'portfolio', 'order']
    list_filter = ['portfolio']
    search_fields = ['title', 'description']
    list_editable = ['order']


# Customize admin site
admin.site.site_header = 'Portfolio Admin'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Welcome to Portfolio Administration'
