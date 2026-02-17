from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Portfolio(models.Model):
    """Main portfolio model linked to a user"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolio')
    username = models.CharField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=200, blank=True, help_text="Display name (e.g., 'Azeem Amjad')")
    tagline = models.CharField(max_length=200, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    theme_color = models.CharField(max_length=7, default='#3B82F6')  # Primary color for the portfolio
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username}'s Portfolio"

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = slugify(self.user.username)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']


class About(models.Model):
    """About Me section"""
    portfolio = models.OneToOneField(Portfolio, on_delete=models.CASCADE, related_name='about')
    bio = models.TextField()
    background = models.TextField(blank=True)
    career_path = models.TextField(blank=True)
    values = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    
    def __str__(self):
        return f"About {self.portfolio.username}"

    class Meta:
        verbose_name_plural = "About"


class Skill(models.Model):
    """Skills with proficiency levels"""
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    CATEGORY_CHOICES = [
        ('programming', 'Programming Languages'),
        ('framework', 'Frameworks & Libraries'),
        ('database', 'Databases'),
        ('tool', 'Tools & Platforms'),
        ('soft', 'Soft Skills'),
        ('other', 'Other'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')
    proficiency_percentage = models.IntegerField(default=50, help_text="0-100")
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or URL")
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.name} - {self.portfolio.username}"
    
    class Meta:
        ordering = ['order', 'name']


class Project(models.Model):
    """Portfolio projects/work samples"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True)
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='projects/thumbnails/', blank=True, null=True)
    technologies = models.CharField(max_length=500, help_text="Comma-separated technologies")
    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)
    outcome = models.TextField(blank=True, help_text="Results and outcomes of the project")
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']


class CaseStudy(models.Model):
    """Detailed case studies for projects"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='case_study')
    challenge = models.TextField(help_text="What was the problem/challenge?")
    solution = models.TextField(help_text="How did you solve it?")
    process = models.TextField(blank=True, help_text="Your process and methodology")
    results = models.TextField(blank=True, help_text="Measurable results and impact")
    lessons_learned = models.TextField(blank=True)
    
    def __str__(self):
        return f"Case Study: {self.project.title}"
    
    class Meta:
        verbose_name_plural = "Case Studies"


class Service(models.Model):
    """Services offered (for freelancers/consultants)"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    price_range = models.CharField(max_length=100, blank=True, help_text="e.g., '$500-$2000'")
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']


class Testimonial(models.Model):
    """Client or colleague testimonials"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='testimonials')
    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=100, blank=True)
    client_company = models.CharField(max_length=100, blank=True)
    client_image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    content = models.TextField()
    rating = models.IntegerField(default=5, help_text="1-5 stars")
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, blank=True, null=True, related_name='testimonials')
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"Testimonial from {self.client_name}"
    
    class Meta:
        ordering = ['-is_featured', 'order', '-date']


class Achievement(models.Model):
    """Awards, certifications, and recognitions"""
    ACHIEVEMENT_TYPES = [
        ('award', 'Award'),
        ('certification', 'Certification'),
        ('recognition', 'Recognition'),
        ('publication', 'Publication'),
        ('other', 'Other'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES, default='certification')
    issuer = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='achievements/', blank=True, null=True)
    credential_url = models.URLField(blank=True)
    date_received = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order', '-date_received']


class BlogPost(models.Model):
    """Blog posts for thought leadership"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='blog_posts')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField()
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    tags = models.CharField(max_length=300, blank=True, help_text="Comma-separated tags")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name_plural = "Blog Posts"


class Resource(models.Model):
    """Downloadable resources (templates, guides, e-books)"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=200)
    description = models.TextField()
    file = models.FileField(upload_to='resources/')
    thumbnail = models.ImageField(upload_to='resources/thumbnails/', blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True)
    file_size = models.CharField(max_length=50, blank=True)
    downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class Newsletter(models.Model):
    """Newsletter subscribers"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='subscribers')
    email = models.EmailField()
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email
    
    class Meta:
        ordering = ['-subscribed_at']
        unique_together = ['portfolio', 'email']


class ContactMessage(models.Model):
    """Contact form messages"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='messages')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.name}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Contact Messages"


class Hobby(models.Model):
    """Personal hobbies and interests"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='hobbies')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']
        verbose_name_plural = "Hobbies"
