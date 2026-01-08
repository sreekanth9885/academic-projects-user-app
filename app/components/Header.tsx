'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  GraduationCap,
  Home,
  BookOpen,
  Tag,
  Download
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'projects' | 'categories' | 'freeprojects';
  setCurrentView: (view: 'home' | 'projects' | 'categories' | 'freeprojects') => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
    }
  }, []);

  const menuItems = [
    { 
      name: 'Home', 
      id: 'home' as const, 
      icon: <Home size={18} />,
      color: 'text-blue-600'
    },
    { 
      name: 'Projects', 
      id: 'projects' as const, 
      icon: <BookOpen size={18} />,
      color: 'text-green-600'
    },
    { 
      name: 'Categories', 
      id: 'categories' as const, 
      icon: <Tag size={18} />,
      color: 'text-purple-600'
    },
    { 
      name: 'Free Projects', 
      id: 'freeprojects' as const, 
      icon: <Download size={18} />,
      color: 'text-orange-600'
    },
  ];

  const handleNavigation = (viewId: 'home' | 'projects' | 'categories' | 'freeprojects') => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
    // Scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'bg-blue-100 group-hover:bg-blue-200' 
                  : 'bg-white/20 group-hover:bg-white/30'
              }`}>
                <GraduationCap className={`${isScrolled ? 'text-blue-600' : 'text-white'} transition-colors duration-300`} size={28} />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Academic Projects
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}>
                  Marketplace
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  currentView === item.id
                    ? isScrolled 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100' 
                      : 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : isScrolled
                      ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                } cursor-pointer`}
              >
                <span className={`${currentView === item.id ? item.color : isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Right Side - User & Mobile Menu */}
          {/* <div className="flex items-center space-x-3">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className={`font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {user.name}
                  </p>
                  <p className={`${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                    Student
                  </p>
                </div>
              </div>
            ) : (
              <button className={`hidden md:block px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg' 
                  : 'bg-white text-blue-600 hover:bg-white/90'
              }`}>
                Sign In
              </button>
            )}

            <button
              className={`md:hidden p-2.5 rounded-xl ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-300`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="bg-white border-t shadow-xl">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={currentView === item.id ? item.color : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
                
                {/* User Section in Mobile Menu */}
                <div className="pt-4 mt-4 border-t">
                  {user ? (
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow duration-300">
                      Sign In
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}