import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import CompanyHomePage from './pages/CompanyHomePage';
import PortfolioRouter from './pages/portfolio/PortfolioRouter';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CompanyHomePage />} />
          <Route path="/:username/*" element={<PortfolioRouter />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
