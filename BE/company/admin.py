from django.contrib import admin
from .models import CompanyProfile, FeaturedDeveloper


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'tagline', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'tagline', 'description']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tagline', 'description', 'logo', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('website', 'email', 'phone', 'address')
        }),
        ('Services', {
            'fields': ('services',),
            'description': 'Enter services as comma-separated values (e.g., Web Development, AI, Mobile Apps)'
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'github_url', 'twitter_url')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FeaturedDeveloper)
class FeaturedDeveloperAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'display_order', 'is_active', 'featured_since']
    list_filter = ['is_active', 'featured_since']
    search_fields = ['portfolio__username', 'portfolio__user__username']
    ordering = ['display_order', '-featured_since']
    list_editable = ['display_order', 'is_active']
