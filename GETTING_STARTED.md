# 🎓 Getting Started Tutorial

Welcome! This guide will walk you through setting up your portfolio platform step-by-step.

## Part 1: Initial Setup (5 minutes)

### Step 1: Run the Setup Script

```bash
cd /home/dev/Documents/portfolio
./setup.sh
```

This will install all dependencies for both backend and frontend.

### Step 2: Create Superuser

```bash
cd BE
python manage.py createsuperuser
```

Enter:
- Username: `admin` (or your choice)
- Email: your email
- Password: choose a secure password

### Step 3: Start the Backend

In your current terminal:

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Backend is running!**

### Step 4: Start the Frontend

Open a **new terminal** and run:

```bash
cd /home/dev/Documents/portfolio/FE
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

✅ **Frontend is running!**

## Part 2: Create Your First Portfolio (10 minutes)

### Option A: Quick Demo (1 minute)

Create a demo portfolio with sample data:

```bash
# In the backend terminal (or new terminal)
cd /home/dev/Documents/portfolio/BE
python manage.py seed_portfolio demo
```

**View it:** Open `http://localhost:5173/demo`

✨ You now have a fully populated demo portfolio!

### Option B: Create Your Own Portfolio

#### Step 1: Access Django Admin

Open: `http://localhost:8000/admin`

Login with your superuser credentials.

#### Step 2: Create Your Portfolio

1. Click **"Portfolios"** in the left sidebar
2. Click **"ADD PORTFOLIO"** (top right)
3. Fill in:
   - **User**: Select your user (dropdown)
   - **Username**: `yourname` (will be your URL)
   - **Tagline**: "Full-Stack Developer" (or your own)
   - **Theme color**: Keep default or choose your own
   - **Is active**: ✅ Checked
4. Click **"SAVE"**

✅ **Portfolio created!**

#### Step 3: Add About Section

1. Click **"Abouts"** in sidebar
2. Click **"ADD ABOUT"**
3. Fill in:
   - **Portfolio**: Select your portfolio
   - **Bio**: Your introduction (2-3 sentences)
   - **Background**: Your background (optional)
   - **Career path**: Your career journey (optional)
   - **Values**: What matters to you (optional)
   - **Location**: Your city/country
   - **Email**: your@email.com
   - **Github url**: https://github.com/yourusername
   - **Linkedin url**: https://linkedin.com/in/yourusername
4. Click **"SAVE"**

✅ **About section added!**

#### Step 4: Add Skills (Add 3-5 skills)

For each skill:

1. Click **"Skills"** in sidebar
2. Click **"ADD SKILL"**
3. Fill in:
   - **Portfolio**: Select your portfolio
   - **Name**: "JavaScript" (or your skill)
   - **Category**: Select from dropdown
   - **Proficiency**: Select level
   - **Proficiency percentage**: 85 (or your level)
   - **Icon**: "🟨" (or any emoji)
   - **Order**: 1, 2, 3... (for ordering)
4. Click **"SAVE"**

Repeat for more skills like:
- Python 🐍
- React ⚛️
- Django 🌿
- Docker 🐳

✅ **Skills added!**

#### Step 5: Add Projects (Add 2-3 projects)

For each project:

1. Click **"Projects"** in sidebar
2. Click **"ADD PROJECT"**
3. Fill in:
   - **Portfolio**: Select your portfolio
   - **Title**: "E-Commerce Platform"
   - **Description**: Brief description (2-3 sentences)
   - **Technologies**: "React, Django, PostgreSQL" (comma-separated)
   - **Github url**: Link to code (optional)
   - **Live url**: Link to live site (optional)
   - **Is featured**: ✅ (to show in featured section)
   - **Order**: 1, 2, 3...
4. Click **"SAVE"**

✅ **Projects added!**

#### Step 6: View Your Portfolio

Open: `http://localhost:5173/yourname`

(Replace `yourname` with your username)

🎉 **Your portfolio is live!**

## Part 3: Enhance Your Portfolio (Optional)

### Add Services (for Freelancers)

1. Go to **"Services"** in admin
2. Add services you offer:
   - Web Development
   - API Development
   - Consulting
3. Include pricing and descriptions

### Add Testimonials

1. Go to **"Testimonials"** in admin
2. Add client reviews:
   - Client name and company
   - Review text
   - Rating (1-5 stars)
   - Mark as featured

### Add Achievements

1. Go to **"Achievements"** in admin
2. Add certifications/awards:
   - Title and type
   - Issuer
   - Date received
   - Credential URL

### Add Hobbies

1. Go to **"Hobbies"** in admin
2. Add your interests:
   - Title and description
   - Icon (emoji)

## Part 4: Customize Your Portfolio

### Change Theme Color

1. Go to admin
2. Edit your Portfolio
3. Change **"Theme color"**
4. Save and refresh frontend

Colors to try:
- Blue: `#3B82F6` (default)
- Purple: `#8B5CF6`
- Green: `#10B981`
- Red: `#EF4444`
- Orange: `#F59E0B`

### Upload Profile Image

1. Edit your Portfolio in admin
2. Click **"Choose File"** under Profile image
3. Select your photo
4. Save

**Tip:** Use a square image (400x400px or similar)

### Upload Resume

1. Edit your About section
2. Click **"Choose File"** under Resume file
3. Select your PDF resume
4. Save

Visitors can now download your resume!

## Part 5: Test All Features

### Test Theme Toggle

1. Visit your portfolio
2. Click the theme icon (☀️/🌙) in header
3. Try: Light → Dark → System
4. Refresh page (theme should persist)

### Test Navigation

1. Click navigation links
2. Should smooth scroll to sections
3. Try on mobile (resize browser)

### Test Projects Filter

1. Go to Projects section
2. Click "All Projects"
3. Click "Featured"
4. Should filter accordingly

### Test Contact Form

1. Scroll to Contact section
2. Fill in the form
3. Click "Send Message"
4. Check admin for the message (ContactMessages)

### Test Mobile View

1. Open browser DevTools (F12)
2. Click responsive mode
3. Test iPhone/iPad sizes
4. Mobile menu should work

## Part 6: Going Further

### Add Blog Posts

1. Go to **"Blog Posts"** in admin
2. Create posts with:
   - Title and content
   - Tags (comma-separated)
   - Featured image
   - Status: Published
3. They'll appear in the blog section

### Add Downloadable Resources

1. Go to **"Resources"** in admin
2. Upload files:
   - Templates
   - Guides
   - E-books
3. Add descriptions

### Monitor Engagement

Check in admin:
- **Contact Messages**: See who reached out
- **Newsletter Subscribers**: See who subscribed
- **Blog Post Views**: Track popularity

## Troubleshooting

### "Portfolio not found"

**Fix:**
1. Check username in URL matches admin
2. Ensure "Is active" is checked
3. Refresh page

### Images not showing

**Fix:**
1. Check images uploaded successfully
2. Verify file size (< 5MB recommended)
3. Try different image format (JPEG/PNG)

### Form not submitting

**Fix:**
1. Check backend is running
2. Verify API URL in `.env` file
3. Check browser console for errors

### Theme not persisting

**Fix:**
1. Clear browser cache
2. Check localStorage is enabled
3. Try different browser

## Tips for Success

### Content Tips
1. **Be Concise**: Keep descriptions clear and brief
2. **Show Impact**: Include outcomes in projects
3. **Use Numbers**: "10,000+ users", "50% faster"
4. **Professional Photos**: Use high-quality images
5. **Update Regularly**: Keep content fresh

### Design Tips
1. **Consistent Icons**: Use similar style emojis
2. **Quality Images**: Compress before uploading
3. **Featured Content**: Highlight your best work
4. **Order Matters**: Put best projects first
5. **Test Mobile**: Always check responsiveness

### SEO Tips
1. **Descriptive Titles**: Clear project titles
2. **Keywords**: Use relevant tech terms
3. **Complete Bio**: Fill all About fields
4. **Social Links**: Add all profiles
5. **Regular Updates**: Post blog content

## Next Steps

Now that you have your portfolio:

1. ✅ **Customize**: Make it yours
2. ✅ **Add Content**: More projects, blogs
3. ✅ **Share**: Send your link to others
4. ✅ **Deploy**: Put it on the internet
5. ✅ **Maintain**: Keep it updated

### Ready to Deploy?

See:
- `BE/README.md` - Backend deployment
- `FE/README.md` - Frontend deployment
- `README.md` - General info

## Support

- **Stuck?** Check `QUICKSTART.md`
- **Need details?** See `README.md` files
- **Want overview?** Read `PROJECT_SUMMARY.md`

## Congratulations! 🎉

You now have a professional portfolio website!

**Your portfolio URL:** `http://localhost:5173/yourname`

Share it with the world! 🚀

---

**Happy Portfolio Building!** ✨
