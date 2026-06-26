#!/bin/bash

echo "🚀 Setting up Portfolio Platform..."
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd BE

echo "Installing Python dependencies..."
if [ ! -d .venv ]; then
    python3 -m venv .venv
fi
.venv/bin/pip install -r requirements.txt

echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created BE/.env from .env.example — edit DATABASE_URL and SECRET_KEY before production"
else
    echo "⚠️  BE/.env already exists, skipping..."
fi

echo "Running migrations..."
.venv/bin/python manage.py migrate

echo "Creating media directories..."
mkdir -p media/profiles media/projects media/projects/thumbnails media/blog media/achievements media/testimonials media/resumes media/resources media/resources/thumbnails media/company

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To create a superuser for admin access, run:"
echo "  cd BE && .venv/bin/python manage.py createsuperuser"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../FE

echo "Installing Node dependencies..."
npm install

echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created FE/.env from .env.example"
else
    echo "⚠️  FE/.env already exists, skipping..."
fi

cd ..

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "1. Copy and configure environment files (if not done already):"
echo "   cp BE/.env.example BE/.env"
echo "   cp FE/.env.example FE/.env"
echo ""
echo "2. Start the backend server:"
echo "   cd BE && .venv/bin/python manage.py runserver"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd FE && npm run dev"
echo ""
echo "4. Access the admin panel at: http://localhost:8000/admin"
echo "5. Access the frontend at: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"
