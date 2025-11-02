import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '../components/navbar';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null); // Single image instead of array
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/posts/${id}`)
        .then(res => res.json())
        .then(post => {
          setForm({ title: post.title, content: post.content });
          setImage(post.image || null); // Single image
        })
        .catch(err => setError('Failed to load post'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Compress image to reduce file size
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Reduce dimensions if too large
        if (width > 800) {
          height = (height * 800) / width;
          width = 800;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.7
        canvas.toBlob(
          (blob) => {
            const reader2 = new FileReader();
            reader2.readAsDataURL(blob);
            reader2.onloadend = () => {
              callback(reader2.result);
            };
          },
          'image/jpeg',
          0.7
        );
      };
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Only take first file
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError(`File is too large. Max 5MB.`);
      return;
    }
    
    compressImage(file, (compressedImage) => {
      setImage(compressedImage); // Set single image
    });
  };

  const removeImage = () => {
    setImage(null); // Clear single image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setError('');
    setLoading(true);

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit 
      ? `http://localhost:3000/posts/${id}` 
      : 'http://localhost:3000/posts';
    
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          image: image, // Send single image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }

      const data = await response.json();
      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-green-600">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h2>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-green-600 text-black"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="8"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-green-600 text-black"
                placeholder="Write your post content here..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-green-600 text-black"
              />
              <p className="text-sm text-gray-500 mt-2">Upload one image (max 5MB, will be compressed)</p>
            </div>

            {image && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Uploaded Image</label>
                <div className="relative inline-block">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Publish Post')}
              </button>
              <button
                onClick={() => navigate('/posts')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}