from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from portfolio.models import (
    Portfolio, About, Skill, Project, Service, Testimonial, Achievement, Hobby
)
from datetime import date


class Command(BaseCommand):
    help = 'Seeds the database with sample portfolio data'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username for the portfolio')

    def handle(self, *args, **options):
        username = options['username']
        
        self.stdout.write(self.style.SUCCESS(f'Creating portfolio for {username}...'))
        
        # Create or get user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': f'{username}@example.com',
                'first_name': username.capitalize(),
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {username}'))
        
        # Create portfolio
        portfolio, created = Portfolio.objects.get_or_create(
            user=user,
            defaults={
                'username': username,
                'tagline': 'Full-Stack Developer | Building Amazing Web Applications',
                'theme_color': '#3B82F6',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created portfolio'))
        
        # Create About section
        About.objects.get_or_create(
            portfolio=portfolio,
            defaults={
                'bio': 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and Python, and I love creating elegant solutions to complex problems.',
                'background': 'Started coding at age 15 and never looked back. Studied Computer Science at University and have been working professionally for the past 5 years.',
                'career_path': 'From junior developer to tech lead, I have worked on various projects ranging from startups to enterprise applications.',
                'values': 'I believe in clean code, continuous learning, and collaboration. Quality over quantity, always.',
                'location': 'San Francisco, CA',
                'email': f'{username}@example.com',
                'phone': '+1 (555) 123-4567',
                'github_url': f'https://github.com/{username}',
                'linkedin_url': f'https://linkedin.com/in/{username}',
                'twitter_url': f'https://twitter.com/{username}',
            }
        )
        self.stdout.write(self.style.SUCCESS('Created About section'))
        
        # Create Skills
        skills_data = [
            {'name': 'JavaScript', 'category': 'programming', 'proficiency': 'expert', 'proficiency_percentage': 95, 'icon': '🟨', 'order': 1},
            {'name': 'Python', 'category': 'programming', 'proficiency': 'advanced', 'proficiency_percentage': 90, 'icon': '🐍', 'order': 2},
            {'name': 'TypeScript', 'category': 'programming', 'proficiency': 'advanced', 'proficiency_percentage': 88, 'icon': '🔷', 'order': 3},
            {'name': 'React', 'category': 'framework', 'proficiency': 'expert', 'proficiency_percentage': 92, 'icon': '⚛️', 'order': 4},
            {'name': 'Django', 'category': 'framework', 'proficiency': 'advanced', 'proficiency_percentage': 85, 'icon': '🌿', 'order': 5},
            {'name': 'Node.js', 'category': 'framework', 'proficiency': 'advanced', 'proficiency_percentage': 87, 'icon': '🟢', 'order': 6},
            {'name': 'PostgreSQL', 'category': 'database', 'proficiency': 'advanced', 'proficiency_percentage': 80, 'icon': '🐘', 'order': 7},
            {'name': 'MongoDB', 'category': 'database', 'proficiency': 'intermediate', 'proficiency_percentage': 75, 'icon': '🍃', 'order': 8},
            {'name': 'Docker', 'category': 'tool', 'proficiency': 'advanced', 'proficiency_percentage': 82, 'icon': '🐳', 'order': 9},
            {'name': 'Git', 'category': 'tool', 'proficiency': 'expert', 'proficiency_percentage': 93, 'icon': '📦', 'order': 10},
            {'name': 'Problem Solving', 'category': 'soft', 'proficiency': 'expert', 'proficiency_percentage': 90, 'icon': '🧩', 'order': 11},
            {'name': 'Team Collaboration', 'category': 'soft', 'proficiency': 'advanced', 'proficiency_percentage': 88, 'icon': '🤝', 'order': 12},
        ]
        
        for skill_data in skills_data:
            Skill.objects.get_or_create(
                portfolio=portfolio,
                name=skill_data['name'],
                defaults=skill_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(skills_data)} skills'))
        
        # Create Projects
        projects_data = [
            {
                'title': 'E-Commerce Platform',
                'description': 'A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
                'detailed_description': 'Built with React and Django, this platform handles thousands of products and transactions daily.',
                'technologies': 'React, Django, PostgreSQL, Redis, Stripe, AWS',
                'live_url': 'https://example.com',
                'github_url': f'https://github.com/{username}/ecommerce',
                'outcome': 'Successfully launched and serving 10,000+ users',
                'is_featured': True,
                'order': 1,
            },
            {
                'title': 'Task Management App',
                'description': 'A collaborative task management application with real-time updates and team features.',
                'technologies': 'React, Node.js, Socket.io, MongoDB',
                'github_url': f'https://github.com/{username}/task-app',
                'is_featured': True,
                'order': 2,
            },
            {
                'title': 'Weather Dashboard',
                'description': 'A beautiful weather dashboard with forecasts, maps, and historical data.',
                'technologies': 'React, TypeScript, OpenWeather API, Tailwind CSS',
                'live_url': 'https://weather.example.com',
                'github_url': f'https://github.com/{username}/weather',
                'is_featured': False,
                'order': 3,
            },
        ]
        
        for project_data in projects_data:
            Project.objects.get_or_create(
                portfolio=portfolio,
                title=project_data['title'],
                defaults=project_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(projects_data)} projects'))
        
        # Create Services
        services_data = [
            {
                'title': 'Web Development',
                'description': 'Custom web applications built with modern technologies and best practices.',
                'icon': '💻',
                'price_range': '$3,000 - $10,000',
                'order': 1,
            },
            {
                'title': 'API Development',
                'description': 'RESTful and GraphQL APIs designed for scalability and performance.',
                'icon': '🔌',
                'price_range': '$2,000 - $5,000',
                'order': 2,
            },
            {
                'title': 'Consulting',
                'description': 'Technical consulting and architecture design for your projects.',
                'icon': '💡',
                'price_range': '$150/hour',
                'order': 3,
            },
        ]
        
        for service_data in services_data:
            Service.objects.get_or_create(
                portfolio=portfolio,
                title=service_data['title'],
                defaults=service_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(services_data)} services'))
        
        # Create Testimonials
        testimonials_data = [
            {
                'client_name': 'Sarah Johnson',
                'client_role': 'CEO',
                'client_company': 'TechStart Inc',
                'content': 'Excellent work! Delivered the project on time and exceeded expectations. Highly recommended!',
                'rating': 5,
                'is_featured': True,
                'order': 1,
                'date': date(2024, 1, 15),
            },
            {
                'client_name': 'Mike Chen',
                'client_role': 'Product Manager',
                'client_company': 'InnovateCo',
                'content': 'Great communication and technical skills. A pleasure to work with.',
                'rating': 5,
                'is_featured': True,
                'order': 2,
                'date': date(2024, 3, 20),
            },
        ]
        
        for testimonial_data in testimonials_data:
            Testimonial.objects.get_or_create(
                portfolio=portfolio,
                client_name=testimonial_data['client_name'],
                defaults=testimonial_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(testimonials_data)} testimonials'))
        
        # Create Achievements
        achievements_data = [
            {
                'title': 'AWS Certified Solutions Architect',
                'type': 'certification',
                'issuer': 'Amazon Web Services',
                'description': 'Professional level certification for cloud architecture',
                'date_received': date(2023, 6, 15),
                'credential_url': 'https://aws.amazon.com',
                'order': 1,
            },
            {
                'title': 'Best Developer Award 2023',
                'type': 'award',
                'issuer': 'Tech Conference 2023',
                'description': 'Recognized for outstanding contribution to open source',
                'date_received': date(2023, 12, 1),
                'order': 2,
            },
        ]
        
        for achievement_data in achievements_data:
            Achievement.objects.get_or_create(
                portfolio=portfolio,
                title=achievement_data['title'],
                defaults=achievement_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(achievements_data)} achievements'))
        
        # Create Hobbies
        hobbies_data = [
            {'title': 'Open Source', 'description': 'Contributing to open source projects', 'icon': '💻', 'order': 1},
            {'title': 'Photography', 'description': 'Landscape and street photography', 'icon': '📸', 'order': 2},
            {'title': 'Hiking', 'description': 'Exploring nature trails', 'icon': '🥾', 'order': 3},
        ]
        
        for hobby_data in hobbies_data:
            Hobby.objects.get_or_create(
                portfolio=portfolio,
                title=hobby_data['title'],
                defaults=hobby_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(hobbies_data)} hobbies'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully created portfolio for {username}!'))
        self.stdout.write(self.style.SUCCESS(f'Visit: http://localhost:5173/{username}'))
