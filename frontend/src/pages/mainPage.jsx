import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function MainPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <>
      <Navbar />
      <div className="space-y-12">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to BSIT-4B</h2>
          <p className="text-lg mb-8">Share your ideas, connect with others, and build a community</p>
          {!user ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-green-600 px-8 py-3 rounded font-semibold hover:bg-gray-100"
              >
                Get Started
              </button>

            </div>
          ) : (
            <button
              onClick={() => navigate('/posts')}
              className="bg-white text-green-600 px-8 py-3 rounded font-semibold hover:bg-gray-100"
            >
              View All Posts
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-green-600 mb-3">Create Posts</h3>
              <p className="text-gray-600">Share your thoughts and ideas with the community in beautifully formatted posts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-green-600 mb-3">Comment & Engage</h3>
              <p className="text-gray-600">Discuss with other users, share feedback, and build meaningful conversations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-green-600 mb-3">Grow Together</h3>
              <p className="text-gray-600">Connect with like-minded people and expand your network in a supportive environment.</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg text-center mt-12">
            <h3 className="text-2xl font-bold mb-1 text-gray-800">Ready to start blogging?</h3>

          </div>
        </div>
      </div>
    </>
  );
}