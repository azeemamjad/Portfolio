from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from portfolio.models import (
    Portfolio, About, Skill, Project, ProjectImage, Service, Testimonial, Achievement, Hobby
)
from datetime import date
import urllib.request


class Command(BaseCommand):
    help = 'Seeds the database with sample portfolio data'

    def seed_project_gallery(self, project: Project, count: int = 4) -> None:
        if project.images.exists():
            return
        for i in range(count):
            seed = f'{project.slug or project.id}-{i}'
            url = f'https://picsum.photos/seed/{seed}/1200/800'
            try:
                with urllib.request.urlopen(url, timeout=20) as response:
                    data = response.read()
                gallery_image = ProjectImage(
                    project=project,
                    order=i,
                    caption='' if i == 0 else f'Screenshot {i + 1}',
                )
                gallery_image.image.save(
                    f'{project.slug or project.id}-{i}.jpg',
                    ContentFile(data),
                    save=True,
                )
            except Exception as exc:
                self.stdout.write(
                    self.style.WARNING(f'Gallery image {i} skipped for {project.title}: {exc}')
                )

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
            {'name': 'JavaScript', 'category': 'programming', 'proficiency': 'expert', 'proficiency_percentage': 95, 'icon': '🟨', 'order': 1, 'summary': 'Core language for modern web development — ES6+, async/await, and building interactive client-side experiences.'},
            {'name': 'Python', 'category': 'programming', 'proficiency': 'advanced', 'proficiency_percentage': 90, 'icon': '🐍', 'order': 2, 'summary': 'Versatile backend and scripting language used for APIs, automation, data work, and rapid product development.'},
            {'name': 'TypeScript', 'category': 'programming', 'proficiency': 'advanced', 'proficiency_percentage': 88, 'icon': '🔷', 'order': 3, 'summary': 'Typed JavaScript for safer, scalable codebases with strong IDE support and fewer runtime surprises.'},
            {'name': 'React', 'category': 'framework', 'proficiency': 'expert', 'proficiency_percentage': 92, 'icon': '⚛️', 'order': 4, 'summary': 'Component-based UI library for building fast, maintainable single-page applications with hooks and modern patterns.'},
            {'name': 'Django', 'category': 'framework', 'proficiency': 'advanced', 'proficiency_percentage': 85, 'icon': '🌿', 'order': 5, 'summary': 'High-level Python web framework for secure, batteries-included APIs and admin-backed applications.'},
            {'name': 'Node.js', 'category': 'framework', 'proficiency': 'advanced', 'proficiency_percentage': 87, 'icon': '🟢', 'order': 6, 'summary': 'JavaScript runtime for scalable server-side apps, REST APIs, and real-time services.'},
            {'name': 'PostgreSQL', 'category': 'database', 'proficiency': 'advanced', 'proficiency_percentage': 80, 'icon': '🐘', 'order': 7, 'summary': 'Reliable relational database for complex queries, transactions, and production-grade data modeling.'},
            {'name': 'MongoDB', 'category': 'database', 'proficiency': 'intermediate', 'proficiency_percentage': 75, 'icon': '🍃', 'order': 8, 'summary': 'Document database for flexible schemas, rapid iteration, and horizontally scalable workloads.'},
            {'name': 'Docker', 'category': 'tool', 'proficiency': 'advanced', 'proficiency_percentage': 82, 'icon': '🐳', 'order': 9, 'summary': 'Containerization for consistent dev/prod environments and simplified deployment pipelines.'},
            {'name': 'Git', 'category': 'tool', 'proficiency': 'expert', 'proficiency_percentage': 93, 'icon': '📦', 'order': 10, 'summary': 'Version control for branching workflows, code review, and reliable collaboration across teams.'},
            {'name': 'Problem Solving', 'category': 'soft', 'proficiency': 'expert', 'proficiency_percentage': 90, 'icon': '🧩', 'order': 11, 'summary': 'Breaking down complex requirements, debugging systematically, and delivering practical solutions under constraints.'},
            {'name': 'Team Collaboration', 'category': 'soft', 'proficiency': 'advanced', 'proficiency_percentage': 88, 'icon': '🤝', 'order': 12, 'summary': 'Clear communication, code reviews, and cross-functional teamwork to ship quality software on schedule.'},
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
            {
                'title': 'DevLink Portfolio Platform',
                'description': 'Multi-tenant portfolio platform with custom themes, blog, and contact inbox for developers and agencies.',
                'detailed_description': 'Full-stack SaaS built with Django REST and React. Supports per-user accent colors, OG image generation, and MinIO media storage.',
                'technologies': 'React, Django, PostgreSQL, MinIO, Docker, Tailwind CSS',
                'live_url': 'https://dev-link.cloud',
                'github_url': f'https://github.com/{username}/portfolio',
                'outcome': 'Powers live developer portfolios with admin dashboard and deployment pipeline',
                'is_featured': True,
                'order': 4,
                'start_date': date(2024, 3, 1),
                'end_date': None,
            },
            {
                'title': 'AI Code Review Assistant',
                'description': 'GitHub App that analyzes pull requests and suggests improvements for security, performance, and style.',
                'detailed_description': 'Integrates with GitHub webhooks, runs static analysis, and posts inline review comments using an LLM pipeline.',
                'technologies': 'Python, FastAPI, Redis, OpenAI API, GitHub Actions',
                'github_url': f'https://github.com/{username}/ai-code-review',
                'demo_url': 'https://demo.example.com/code-review',
                'outcome': 'Reduced review turnaround time by 40% across pilot teams',
                'is_featured': True,
                'order': 5,
                'start_date': date(2024, 6, 1),
                'end_date': date(2025, 1, 15),
            },
            {
                'title': 'Restaurant POS System',
                'description': 'Point-of-sale web app for small restaurants with table management, kitchen display, and daily sales reports.',
                'technologies': 'React, Node.js, PostgreSQL, Socket.io, Stripe',
                'live_url': 'https://pos.example.com',
                'github_url': f'https://github.com/{username}/restaurant-pos',
                'is_featured': False,
                'order': 6,
                'start_date': date(2023, 1, 1),
                'end_date': date(2023, 9, 30),
            },
            {
                'title': 'DevOps Monitoring Suite',
                'description': 'Lightweight monitoring dashboard for server health, uptime checks, and alert notifications via Slack and email.',
                'technologies': 'Python, Django, Celery, Redis, Grafana, Docker',
                'github_url': f'https://github.com/{username}/devops-monitor',
                'outcome': 'Monitors 50+ services with sub-minute alert latency',
                'is_featured': False,
                'order': 7,
                'start_date': date(2023, 4, 1),
                'end_date': date(2024, 2, 28),
            },
            {
                'title': 'Social Media Scheduler',
                'description': 'Schedule and publish posts across Twitter, LinkedIn, and Instagram with a unified content calendar.',
                'technologies': 'Next.js, TypeScript, Prisma, PostgreSQL, BullMQ',
                'live_url': 'https://scheduler.example.com',
                'github_url': f'https://github.com/{username}/social-scheduler',
                'is_featured': False,
                'order': 8,
                'start_date': date(2024, 8, 1),
                'end_date': None,
            },
        ]
        
        for project_data in projects_data:
            project, _ = Project.objects.get_or_create(
                portfolio=portfolio,
                title=project_data['title'],
                defaults=project_data
            )
            self.seed_project_gallery(project)
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
