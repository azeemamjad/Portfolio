#!/bin/bash

echo "🚀 Setting up Portfolio Platform..."
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd BE

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
python manage.py migrate

echo "Creating media directories..."
mkdir -p media/profiles media/projects media/projects/thumbnails media/blog media/achievements media/testimonials media/resumes media/resources media/resources/thumbnails

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To create a superuser for admin access, run:"
echo "  cd BE && python manage.py createsuperuser"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../FE

echo "Installing Node dependencies..."
npm install

echo "Creating .env file..."
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists, skipping..."
fi

cd ..

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "1. Start the backend server:"
echo "   cd BE && python manage.py runserver"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd FE && npm run dev"
echo ""
echo "3. Access the admin panel at: http://localhost:8000/admin"
echo "4. Access the frontend at: http://localhost:5173"
echo ""
echo "Happy coding! 🚀"
