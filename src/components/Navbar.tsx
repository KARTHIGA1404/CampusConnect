import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Bell, User, Menu, X, GraduationCap, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PostQuestionModal from './PostQuestionModal';
import { useQuestions } from '../contexts/QuestionContext';
import { FaUserCircle } from 'react-icons/fa'; // Install with npm install react-icons
export default function Navbar() {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useQuestions();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CampusConnect+</span>
            </Link>
              {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search questions, tags, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ask Question</span>
              </button>

              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/leaderboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/leaderboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Leaderboard
                </Link>
              </div>

              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                
                
              </button>

              <div className="flex items-center space-x-3">

              <Link
  to="/profile"
  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
>
  {user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="h-8 w-8 rounded-full object-cover"
    />
  ) : (
    <FaUserCircle className="h-8 w-8 text-gray-400" />
  )}
  <div className="text-left">
    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
    <p className="text-xs text-gray-500">{user?.reputation} rep</p>
  </div>
</Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/leaderboard"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/leaderboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>

              <button
                onClick={() => {
                  setIsPostModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ask Question</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <PostQuestionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
}