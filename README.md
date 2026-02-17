# 🌟 Developer Portfolio Platform

A full-stack web application for creating and displaying professional developer portfolios. Built with Django REST Framework backend and React frontend with TypeScript.

![Portfolio Platform](https://img.shields.io/badge/Django-5.2-green) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ Features

### 🎨 Modern UI/UX
- **Theme Modes**: Light, Dark, and System theme support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: CSS animations and transitions
- **Clean Layout**: Professional, minimalist design

### 📦 Portfolio Sections
- **Hero Section**: Eye-catching introduction with profile image
- **About Me**: Detailed bio, background, career path, and values
- **Projects**: Showcase work with images, descriptions, and links
- **Skills**: Display technical skills with proficiency levels
- **Services**: List offered services (for freelancers)
- **Testimonials**: Client reviews and ratings
- **Achievements**: Certifications and awards
- **Blog**: Share insights and tutorials
- **Resources**: Offer downloadable content
- **Contact**: Contact form with email integration

### 🔧 Admin Features
- **Django Admin**: Full-featured content management
- **Media Management**: Upload images, resumes, and files
- **Newsletter**: Subscriber management
- **Messages**: Contact form submissions tracking

### 🚀 Technical Features
- **RESTful API**: Well-structured Django REST Framework API
- **Type Safety**: Full TypeScript support in frontend
- **State Management**: React Context API for theme
- **Routing**: React Router for navigation
- **CORS Enabled**: Seamless frontend-backend communication

## 🏗️ Architecture

```
portfolio/
├── BE/                      # Django Backend
│   ├── BE/                  # Project settings
│   ├── portfolio/           # Portfolio app
│   │   ├── models.py       # Data models
│   │   ├── serializers.py  # API serializers
│   │   ├── views.py        # API views
│   │   ├── admin.py        # Admin configuration
│   │   └── urls.py         # URL routing
│   ├── manage.py
│   └── requirements.txt
│
└── FE/                      # React Frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── types/          # TypeScript types
    │   └── App.tsx         # Main app
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 20+
- pip
- npm

### Backend Setup

```bash
# Navigate to backend directory
cd BE

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will run at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin`

### Frontend Setup

```bash
# Navigate to frontend directory
cd FE

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📖 Usage

### Creating Your First Portfolio

1. **Access Admin Panel**
   - Go to `http://localhost:8000/admin`
   - Login with your superuser credentials

2. **Create a User**
   - Navigate to Users
   - Add a new user

3. **Create a Portfolio**
   - Navigate to Portfolios
   - Click "Add Portfolio"
   - Select the user
   - Set username (this will be the URL: `/<username>`)
   - Add tagline and profile image
   - Save

4. **Add Content**
   - Add About information
   - Create Projects
   - Add Skills
   - Add other sections as needed

5. **View Portfolio**
   - Go to `http://localhost:5173/<username>`
   - Your portfolio is live!

## 🎯 Portfolio URL Structure

- **Home Page**: `http://localhost:5173/`
- **Portfolio**: `http://localhost:5173/<username>`

Example: `http://localhost:5173/johndoe`

## 🎨 Customization

### Backend

**Theme Color**: Each portfolio can have a custom theme color set in the admin panel.

**Sections**: Enable/disable sections by adding or removing content in the admin.

### Frontend

**Colors**: Edit `FE/tailwind.config.js` to change the color scheme.

**Sections**: Customize section components in `FE/src/components/sections/`.

**Layout**: Modify `FE/src/pages/PortfolioPage.tsx` to change section order or layout.

## 📡 API Documentation

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolios/` | List all portfolios |
| GET | `/api/portfolios/<username>/` | Get portfolio details |
| GET | `/api/<username>/projects/` | List projects |
| GET | `/api/<username>/blog/` | List blog posts |
| POST | `/api/<username>/contact/` | Send contact message |
| POST | `/api/<username>/newsletter/subscribe/` | Subscribe to newsletter |

See `BE/README.md` for complete API documentation.

## 🎨 Design Principles

### Clean and Minimal
- Focus on content over design
- Ample white space
- Simple, modern typography
- Subtle animations

### Professional
- Business-appropriate color schemes
- High-quality images
- Consistent branding
- Clear call-to-actions

### Responsive
- Mobile-first design
- Touch-friendly interfaces
- Optimized for all screen sizes
- Fast loading times

## 🛠️ Tech Stack

### Backend
- **Django 5.2**: Web framework
- **Django REST Framework**: API framework
- **django-cors-headers**: CORS support
- **Pillow**: Image processing
- **SQLite**: Development database

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## 📦 Deployment

### Backend (Django)
- Use Gunicorn or uWSGI
- Configure PostgreSQL for production
- Set up media file storage (AWS S3, etc.)
- Configure environment variables
- Set up HTTPS

### Frontend (React)
- Build: `npm run build`
- Deploy `dist` folder to:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - GitHub Pages

## 🔒 Security Considerations

- Change `SECRET_KEY` in production
- Set `DEBUG = False` in production
- Configure `ALLOWED_HOSTS`
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Validate and sanitize user inputs
- Enable HTTPS in production

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for developers who want to showcase their work professionally.

## 🙏 Acknowledgments

- Django community for excellent documentation
- React team for the amazing library
- Tailwind CSS for the utility-first approach
- All open-source contributors

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation in `BE/README.md` and `FE/README.md`

---

**Happy Coding! 🚀**
