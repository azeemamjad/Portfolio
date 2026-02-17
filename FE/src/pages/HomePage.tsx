import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import AnimatedBackground from '../components/common/AnimatedBackground';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 
                  dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center 
                          shadow-2xl animate-bounce">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Portfolio <span className="text-gradient">Hub</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Welcome to the portfolio platform. View amazing developer portfolios by entering a username.
          </p>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const username = formData.get('username') as string;
                if (username) {
                  window.location.href = `/${username}`;
                }
              }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="username" className="block text-left text-sm font-medium 
                                                    text-gray-700 dark:text-gray-300 mb-2">
                  Enter Username
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                                   text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="e.g., johndoe"
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 
                             transition-colors duration-200 text-lg"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-lg">
                View Portfolio
              </button>
            </form>
          </div>

          {/* Example */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Try an example: 
            <Link to="/demo" className="text-primary-600 dark:text-primary-400 hover:underline ml-2 font-medium">
              /demo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
