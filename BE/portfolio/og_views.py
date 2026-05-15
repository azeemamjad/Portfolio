from django.http import HttpResponse
from portfolio.models import Portfolio, BlogPost
from company.models import CompanyProfile

SITE_URL = 'https://dev-link.cloud'
MEDIA_BASE = 'https://backend.dev-link.cloud/media/'


def _abs_image(path):
    if not path:
        return ''
    if str(path).startswith('http'):
        return str(path)
    return MEDIA_BASE + str(path)


def _html(title, description, image, url):
    title = (title or '').replace('"', '&quot;')
    description = (description or '').replace('"', '&quot;')
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
        title = f'{p.name or username} : Portfolio'
        description = p.tagline or ''
        image = _abs_image(p.profile_image)
        url = f'{SITE_URL}/{username}'
    except Portfolio.DoesNotExist:
        title = f'{username} : Portfolio'
        description = ''
        image = ''
        url = f'{SITE_URL}/{username}'
    return _html(title, description, image, url)


def og_blog_post(request, username, slug):
    try:
        p = Portfolio.objects.get(username=username, is_active=True)
        post = BlogPost.objects.get(portfolio=p, slug=slug, status='published')
        title = f'{post.title} | {p.name or username}'
        description = post.excerpt or p.tagline or ''
        image = _abs_image(post.featured_image) or _abs_image(p.profile_image)
        url = f'{SITE_URL}/{username}/blog/{slug}'
    except (Portfolio.DoesNotExist, BlogPost.DoesNotExist):
        title = 'Blog Post'
        description = ''
        image = ''
        url = f'{SITE_URL}/{username}/blog/{slug}'
    return _html(title, description, image, url)
