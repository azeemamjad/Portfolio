# Portfolio Backend (Django REST API)

A powerful Django REST API backend for managing developer portfolios with comprehensive sections including projects, skills, blog posts, testimonials, and more.

## Features

- **User Portfolio Management**: Each user gets a unique portfolio accessible at `/<username>`
- **Comprehensive Sections**: About, Projects, Skills, Services, Testimonials, Achievements, Blog, Resources, and more
- **RESTful API**: Built with Django REST Framework
- **Admin Interface**: Full-featured Django admin for content management
- **Media Handling**: Support for images, resumes, and downloadable resources
- **CORS Enabled**: Ready for frontend integration

## Tech Stack

- Python 3.10+
- Django 5.2
- Django REST Framework 3.16
- SQLite (development) / PostgreSQL (production ready)
- Pillow for image processing

## Installation

1. **Install Dependencies**
```bash
cd BE
pip install -r requirements.txt
```

2. **Run Migrations**
```bash
python manage.py migrate
```

3. **Create Superuser**
```bash
python manage.py createsuperuser
```

4. **Run Development Server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Portfolio Endpoints
- `GET /api/portfolios/` - List all portfolios
- `GET /api/portfolios/{username}/` - Get specific portfolio with all data

### Projects
- `GET /api/{username}/projects/` - List all projects
- `GET /api/{username}/projects/{id}/` - Get project detail
- `GET /api/{username}/projects/featured/` - Get featured projects

### Blog
- `GET /api/{username}/blog/` - List blog posts
- `GET /api/{username}/blog/{id}/` - Get blog post detail
- `GET /api/{username}/blog/featured/` - Get featured posts

### Resources
- `GET /api/{username}/resources/` - List downloadable resources
- `GET /api/{username}/resources/{id}/` - Get resource detail
- `POST /api/{username}/resources/{id}/download/` - Track downloads

### Contact & Newsletter
- `POST /api/{username}/contact/` - Send contact message
- `POST /api/{username}/newsletter/subscribe/` - Subscribe to newsletter

## Admin Interface

Access the admin interface at `http://localhost:8000/admin/`

### Creating a Portfolio

1. Log in to admin
2. Create a User (if not exists)
3. Create a Portfolio linked to that user
4. Add sections (About, Projects, Skills, etc.)

## Models

### Portfolio
Main model representing a user's portfolio with username, tagline, profile image, and theme color.

### About
Detailed information about the portfolio owner including bio, background, career path, contact info, and social links.

### Project
Showcase projects with images, descriptions, technologies, links, and optional case studies.

### Skill
Technical and soft skills with categories, proficiency levels, and visual indicators.

### BlogPost
Blog posts for thought leadership with markdown support.

### Service
Services offered (useful for freelancers/consultants).

### Testimonial
Client testimonials with ratings and optional project links.

### Achievement
Awards, certifications, and recognitions with credentials.

### Resource
Downloadable resources (templates, guides, e-books).

### Newsletter
Newsletter subscriber management.

### ContactMessage
Contact form submissions.

### Hobby
Personal interests and hobbies.

## Settings Configuration

### CORS Settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative
]
```

### Media Files
```python
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## Production Deployment

1. Update `SECRET_KEY` in settings
2. Set `DEBUG = False`
3. Configure `ALLOWED_HOSTS`
4. Use PostgreSQL instead of SQLite
5. Set up proper media file storage (e.g., AWS S3)
6. Configure HTTPS
7. Set up proper CORS origins

## License

MIT License
