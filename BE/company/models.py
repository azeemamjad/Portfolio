from django.db import models
from portfolio.models import Portfolio


class CompanyProfile(models.Model):
    """Company profile information"""
    name = models.CharField(max_length=200, default="DevLink Technologies")
    tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField(help_text="Company description and mission")
    logo = models.ImageField(upload_to='company/', blank=True, null=True)
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Services/Specializations
    services = models.TextField(
        help_text="Comma-separated list of services (e.g., Web Development, AI, Mobile Apps)"
    )
    
    # Social links
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # SEO and meta
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profiles"
        ordering = ['-created_at']

    def get_services_list(self):
        """Return services as a list"""
        if self.services:
            return [s.strip() for s in self.services.split(',') if s.strip()]
        return []


class FeaturedDeveloper(models.Model):
    """Featured developers to showcase on company homepage"""
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name='featured_in_companies'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which developers appear (lower numbers first)"
    )
    is_active = models.BooleanField(default=True)
    featured_since = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Featured: {self.portfolio.username}"

    class Meta:
        ordering = ['display_order', '-featured_since']
        unique_together = ['portfolio', 'is_active']
        verbose_name = "Featured Developer"
        verbose_name_plural = "Featured Developers"
