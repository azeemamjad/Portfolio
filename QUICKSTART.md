# 🚀 Quick Start Guide

Get your portfolio platform up and running in 5 minutes!

## Prerequisites

- Python 3.10+ installed
- Node.js 20+ installed
- pip and npm available

## Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./setup.sh
```

Then create a superuser:

```bash
cd BE
python manage.py createsuperuser
```

## Option 2: Manual Setup

### Backend Setup

```bash
# Navigate to backend
cd BE

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create media directories
mkdir -p media/{profiles,projects,blog,achievements,testimonials,resumes,resources}
```

### Frontend Setup

```bash
# Navigate to frontend
cd FE

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd BE
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Start Frontend (Terminal 2)

```bash
cd FE
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Creating Your First Portfolio

### Method 1: Using Django Admin (Recommended)

1. **Access Admin Panel**
   ```
   http://localhost:8000/admin
   ```
   Login with your superuser credentials.

2. **Create a Portfolio**
   - Click on "Portfolios" → "Add Portfolio"
   - Select your user
   - Set a username (e.g., "johndoe")
   - Add a tagline: "Full-Stack Developer"
   - Choose a theme color (default: #3B82F6)
   - Save

3. **Add About Section**
   - Click on "Abouts" → "Add About"
   - Select your portfolio
   - Fill in bio, background, career path, values
   - Add contact info and social links
   - Upload resume (optional)
   - Save

4. **Add Projects**
   - Click on "Projects" → "Add Project"
   - Select your portfolio
   - Fill in project details
   - Add technologies (comma-separated)
   - Add links (live URL, GitHub, demo)
   - Mark as featured (optional)
   - Save

5. **Add Skills**
   - Click on "Skills" → "Add Skill"
   - Select your portfolio
   - Add skill name and category
   - Set proficiency level and percentage
   - Add icon (emoji or icon class)
   - Save

6. **View Your Portfolio**
   ```
   http://localhost:5173/johndoe
   ```
   Replace "johndoe" with your username.

### Method 2: Using Seed Command (Quick Demo)

Create a demo portfolio with sample data:

```bash
cd BE
python manage.py seed_portfolio demo
```

This creates:
- User: `demo` (password: `password123`)
- Portfolio at: `http://localhost:5173/demo`
- Sample projects, skills, services, testimonials, and achievements

**View Demo Portfolio:**
```
http://localhost:5173/demo
```

## Testing the Features

### 1. Theme Toggle
- Click the theme icon in the header
- Try Light, Dark, and System modes
- Theme preference is saved

### 2. Navigation
- Click on navigation links
- Smooth scroll to sections
- Mobile menu works on small screens

### 3. Projects Filter
- Click "All Projects" or "Featured"
- See projects filtered accordingly

### 4. Contact Form
- Scroll to Contact section
- Fill in the form
- Submit and check Django admin for the message

### 5. Responsive Design
- Resize your browser
- Check mobile view (< 768px)
- Test tablet view (768px - 1024px)

## Customization

### Change Theme Color

1. Go to Django Admin
2. Edit your Portfolio
3. Change "Theme color" field
4. Refresh frontend

### Add Profile Image

1. Go to Django Admin
2. Edit your Portfolio
3. Upload "Profile image"
4. Refresh frontend

### Customize Frontend Colors

Edit `FE/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

## Common Issues

### Backend not connecting

**Problem:** CORS errors in browser console

**Solution:** Check `BE/BE/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Frontend API errors

**Problem:** "Network Error" or 404

**Solution:** 
1. Ensure backend is running
2. Check `.env` file has correct API URL
3. Verify CORS settings

### Images not showing

**Problem:** Uploaded images return 404

**Solution:**
1. Check media directories exist
2. Verify `MEDIA_URL` and `MEDIA_ROOT` in settings
3. Ensure Django is serving media files in development

## Next Steps

1. **Add More Content**
   - Add more projects
   - Create blog posts
   - Add testimonials
   - Upload resources

2. **Customize Styling**
   - Edit Tailwind config
   - Modify component styles
   - Add custom animations

3. **Deploy to Production**
   - See deployment guides in `BE/README.md` and `FE/README.md`
   - Configure production database
   - Set up media storage
   - Enable HTTPS

## Useful Commands

### Django Commands

```bash
# Create superuser
python manage.py createsuperuser

# Seed demo portfolio
python manage.py seed_portfolio <username>

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic
```

### npm Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Support

- **Documentation**: Check `README.md` files in `BE/` and `FE/`
- **Issues**: Look for common issues above
- **Django Admin**: `http://localhost:8000/admin`

## Tips

1. **Start Simple**: Create basic portfolio first, then add optional sections
2. **Use Featured**: Mark best projects/testimonials as featured
3. **Optimize Images**: Compress images before uploading
4. **Test Mobile**: Always check mobile responsiveness
5. **Backup Data**: Export data before making major changes

---

**Ready to build your portfolio? Start now!** 🎉
