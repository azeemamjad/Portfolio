from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from portfolio.models import Portfolio, Project, ProjectImage
import urllib.request


class Command(BaseCommand):
    help = 'Download sample gallery images for portfolio projects'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Portfolio username')
        parser.add_argument('--count', type=int, default=4, help='Images per project')

    def handle(self, *args, **options):
        username = options['username']
        count = options['count']
        portfolio = Portfolio.objects.get(username=username)
        projects = Project.objects.filter(portfolio=portfolio)

        for project in projects:
            if project.images.exists():
                self.stdout.write(f'Skipping {project.title} (gallery exists)')
                continue

            created = 0
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
                    created += 1
                except Exception as exc:
                    self.stdout.write(self.style.WARNING(f'{project.title} image {i}: {exc}'))

            self.stdout.write(self.style.SUCCESS(f'{project.title}: {created} images'))
