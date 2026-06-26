from django.conf import settings
from django.http import HttpResponse
from portfolio.models import Portfolio, BlogPost
from company.models import CompanyProfile

SITE_URL = 'https://dev-link.cloud'


def _abs_image(field):
    """Convert an ImageField or path string to an absolute URL."""
    if not field:
        return ''
    if hasattr(field, 'url'):
        try:
            return field.url
        except ValueError:
            return ''
    name = str(field)
    if not name:
        return ''
    if name.startswith('http'):
        return name
    base = settings.MEDIA_URL
    if not base.endswith('/'):
        base += '/'
    name = name.lstrip('/')
    if name.startswith('media/'):
        name = name[len('media/'):]
    return base + name


def _html(title, description, image, url):
    title = (title or '').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
    description = (description or '').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
    return HttpResponse(f'''<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Dev Link">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{image}">
</head>
<body></body>
</html>''', content_type='text/html')


def og_company(request):
    company = CompanyProfile.objects.filter(is_active=True).first()
    if company:
        title = company.name
        description = company.description or company.tagline or ''
        image = _abs_image(company.logo)
    else:
        title = 'Dev Link'
        description = ''
        image = ''
    return _html(title, description, image, SITE_URL)


def og_portfolio(request, username, **kwargs):
    try:
        p = Portfolio.objects.get(username=username, is_active=True)
        name = p.name or username
        tagline = p.tagline or ''
        # "Azeem Amjad: Software Engineer" format
        title = f'{name}: {tagline}' if tagline else name
        description = tagline
        image = _abs_image(p.profile_image)
        url = f'{SITE_URL}/{username}'
    except Portfolio.DoesNotExist:
        title = username
        description = ''
        image = ''
        url = f'{SITE_URL}/{username}'
    return _html(title, description, image, url)


def og_blog_post(request, username, slug):
    try:
        p = Portfolio.objects.get(username=username, is_active=True)
        post = BlogPost.objects.get(portfolio=p, slug=slug, status='published')
        title = post.title
        description = post.excerpt or p.tagline or ''
        # Prefer post thumbnail, fall back to profile picture
        image = _abs_image(post.featured_image) or _abs_image(p.profile_image)
        url = f'{SITE_URL}/{username}/blog/{slug}'
    except (Portfolio.DoesNotExist, BlogPost.DoesNotExist):
        title = 'Blog Post'
        description = ''
        image = ''
        url = f'{SITE_URL}/{username}/blog/{slug}'
    return _html(title, description, image, url)
