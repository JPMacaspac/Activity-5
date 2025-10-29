import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-green-600">
            BSIT-4B
          </h1>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center ml-auto">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.username || user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-green-600 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          {user ? (
            <>
              <p className="text-gray-700 py-2">Welcome, {user.username || user.email}</p>
              <button
                onClick={() => { navigate('/posts'); setMenuOpen(false); }}
                className="block w-full text-left text-gray-600 hover:text-green-600 py-2"
              >
                Posts
              </button>
              <button
                onClick={() => { navigate('/posts/new'); setMenuOpen(false); }}
                className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded"
              >
                New Post
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="block w-full text-left text-gray-600 py-2"
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false); }}
                className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}