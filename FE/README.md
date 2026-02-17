# Portfolio Frontend (React + TypeScript + Vite)

A modern, responsive React frontend for displaying developer portfolios with dark/light/system theme support, smooth animations, and a beautiful UI.

## Features

- **Dynamic Portfolio Loading**: Fetch and display portfolios by username
- **Theme System**: Dark, Light, and System theme modes with persistence
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: CSS animations for better UX
- **Modern UI Components**: Clean, professional design
- **TypeScript**: Full type safety
- **Fast Development**: Vite for lightning-fast HMR

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (icons)

## Installation

1. **Install Dependencies**
```bash
cd FE
npm install
```

2. **Create Environment File**
Create a `.env` file in the FE directory:
```bash
VITE_API_URL=http://localhost:8000
```

3. **Run Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   └── sections/        # Page sections
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── ProjectsSection.tsx
│       ├── SkillsSection.tsx
│       └── ContactSection.tsx
├── contexts/
│   └── ThemeContext.tsx # Theme management
├── pages/
│   ├── HomePage.tsx     # Landing page
│   └── PortfolioPage.tsx # Portfolio display
├── services/
│   └── api.ts           # API client
├── types/
│   └── index.ts         # TypeScript types
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Features Breakdown

### Theme System
- Three modes: Light, Dark, and System
- Persists user preference in localStorage
- Automatically follows system preference when set to "System" mode
- Smooth transitions between themes

### Sections

#### Hero Section
- Profile image
- Name and tagline
- Bio excerpt
- Call-to-action buttons
- Smooth scroll indicators

#### About Section
- Detailed bio
- Background information
- Career path
- Values
- Contact information cards

#### Projects Section
- Grid layout with cards
- Project images and descriptions
- Technology tags
- Links to live demos and source code
- Featured projects filtering

#### Skills Section
- Categorized skills
- Proficiency indicators with progress bars
- Icon support
- Color-coded proficiency levels

#### Contact Section
- Contact form with validation
- Success/error states
- Direct email link
- Form submission to backend API

### Styling

The app uses Tailwind CSS with custom utilities:

- **Custom Colors**: Primary color palette
- **Custom Animations**: fade-in, slide-up, slide-in
- **Utility Classes**: Buttons, cards, inputs
- **Dark Mode**: Full dark mode support with `class` strategy

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Hamburger menu for mobile
- Optimized layouts for all screen sizes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## API Integration

The frontend communicates with the Django backend through a centralized API service (`services/api.ts`). All API calls are type-safe and handle errors gracefully.

## Customization

### Colors
Edit `tailwind.config.js` to change the primary color palette.

### Animations
Customize animations in `src/index.css` under the `@layer components` section.

### Typography
Modify font families and sizes in `tailwind.config.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading images
- Optimized bundle size with Vite
- Efficient re-renders with React hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
