import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('http://localhost:3000/posts')
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">All Posts</h2>
          {user && (
            <button
              onClick={() => navigate('/posts/new')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
            >
              + New Post
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Show only first 30 words, end with ...
            const preview = post.content
              ? post.content.split(' ').slice(0, 30).join(' ') + (post.content.split(' ').length > 30 ? '...' : '')
              : '';
            return (
              <div
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 p-6 flex flex-col justify-between min-h-[220px]"
                style={{ minHeight: '220px', maxWidth: '400px' }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{post.title}</h3>
                <p className="text-gray-600 mb-4">{preview}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <span>By {post.user?.username || post.author || 'Anonymous'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="bg-gray-100 p-8 rounded text-center text-gray-600">
            <p>No posts yet.</p>
            {user && (
              <button
                onClick={() => navigate('/posts/new')}
                className="mt-4 text-green-600 font-semibold hover:underline"
              >
                Be the first to create one!
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}