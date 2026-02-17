from django.core.management.base import BaseCommand
from company.models import CompanyProfile, FeaturedDeveloper
from portfolio.models import Portfolio


class Command(BaseCommand):
    help = 'Seeds the database with company profile data for DevLink Technologies'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating company profile for DevLink Technologies...'))
        
        # Create or update company profile
        company, created = CompanyProfile.objects.get_or_create(
            name="DevLink Technologies",
            defaults={
                'tagline': 'Connecting Innovation with Excellence',
                'description': 'DevLink Technologies is a leading software development company specializing in Web Development and Artificial Intelligence. We bring together the best developers to create cutting-edge solutions that drive business success.',
                'services': 'Web Development, AI, Machine Learning, Full-Stack Development',
                'email': 'contact@devlinktech.com',
                'phone': '+1 (555) 123-4567',
                'address': '123 Innovation Drive, Tech City, TC 12345',
                'website': 'https://www.devlinktech.com',
                'linkedin_url': 'https://linkedin.com/company/devlinktech',
                'github_url': 'https://github.com/devlinktech',
                'twitter_url': 'https://twitter.com/devlinktech',
                'meta_title': 'DevLink Technologies - Web Development & AI Solutions',
                'meta_description': 'Leading software development company specializing in Web Development and AI. Connect with our expert developers.',
                'is_active': True,
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created company profile'))
        else:
            # Update existing profile
            company.tagline = 'Connecting Innovation with Excellence'
            company.description = 'DevLink Technologies is a leading software development company specializing in Web Development and Artificial Intelligence. We bring together the best developers to create cutting-edge solutions that drive business success.'
            company.services = 'Web Development, AI, Machine Learning, Full-Stack Development'
            company.is_active = True
            company.save()
            self.stdout.write(self.style.SUCCESS('✓ Updated company profile'))
        
        # Feature active portfolios
        active_portfolios = Portfolio.objects.filter(is_active=True)[:6]
        if active_portfolios.exists():
            self.stdout.write(self.style.SUCCESS(f'Featuring {active_portfolios.count()} developers...'))
            
            for index, portfolio in enumerate(active_portfolios, start=1):
                featured, created = FeaturedDeveloper.objects.get_or_create(
                    portfolio=portfolio,
                    defaults={
                        'display_order': index,
                        'is_active': True,
                    }
                )
                if not created:
                    featured.display_order = index
                    featured.is_active = True
                    featured.save()
                self.stdout.write(self.style.SUCCESS(f'  ✓ Featured: {portfolio.username}'))
        else:
            self.stdout.write(self.style.WARNING('No active portfolios found to feature'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Company seeding completed!'))
        self.stdout.write(self.style.SUCCESS(f'Company: {company.name}'))
        self.stdout.write(self.style.SUCCESS(f'Services: {company.services}'))
