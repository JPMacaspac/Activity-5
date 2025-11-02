import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/navbar';

// Single image display component - no gallery needed
function ImageDisplay({ image }) {
  if (!image) return null;

  return (
    <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
      <img
        src={image}
        alt="Post image"
        className="w-full h-96 object-cover"
      />
    </div>
  );
}

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '', image: null });
  const [editLoading, setEditLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = () => {
    fetch('http://localhost:3000/posts/' + id)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setEditForm({
          title: data.title || '',
          content: data.content || '',
          image: data.image || null, // Single image
        });
      })
      .catch(err => {
        setError('Failed to load post');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0]; // Only take first file
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, image: reader.result })); // Set single image
    };
    reader.readAsDataURL(file);
  };

  const removeEditImage = () => {
    setEditForm(prev => ({ ...prev, image: null })); // Clear single image
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          title: editForm.title,
          content: editForm.content,
          image: editForm.image, // Send single image
        }),
      });
      if (!response.ok) throw new Error('Failed to update post');
      setEditing(false);
      fetchPost();
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/posts/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
      });
      navigate('/posts');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const fetchComments = () => {
    fetch('http://localhost:3000/posts/' + id + '/comments')
      .then(res => res.json())
      .then(setComments)
      .catch(console.error);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/posts/' + id + '/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then(res => res.json())
      .then(comment => {
        setComments(prev => [...prev, comment]);
        setNewComment('');
        setError('');
      })
      .catch(err => setError('Failed to add comment'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <button onClick={() => navigate('/posts')} className="text-green-600 font-semibold hover:underline">
            Back to posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/posts')} className="text-green-600 font-semibold hover:underline mb-6">
          ← Back to posts
        </button>
        <article className="bg-white p-8 rounded-lg shadow-lg mb-8">
          {editing && user && ((post.user && user.id === post.user.id) || (post.author && user.id === post.author.id)) ? (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Edit Post</h2>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input type="text" name="title" value={editForm.title} onChange={handleEditChange} className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-600 text-black" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Content</label>
                <textarea name="content" value={editForm.content} onChange={handleEditChange} rows="6" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-600 text-black" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Image</label>
                <input type="file" accept="image/*" onChange={handleEditImageUpload} className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-600 text-black" />
                {editForm.image && (
                  <div className="relative inline-block mt-2">
                    <img src={editForm.image} alt="Edit Preview" className="w-full max-w-md h-48 object-cover rounded" />
                    <button type="button" onClick={removeEditImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700">
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
              <div className="flex justify-between items-center text-gray-500 mb-6 pb-6 border-b">
                <span>By {post.user?.username || post.author || 'Anonymous'}</span>
                <span>{new Date(post.updatedAt || post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap mb-8">
                {post.content}
              </div>
              {post.image && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Post Image</h3>
                  <ImageDisplay image={post.image} />
                </div>
              )}
              <div className="flex gap-4 mt-4">
                {user && ((post.user && user.id === post.user.id) || (post.author && user.id === post.author.id)) && (
                  <>
                    <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
                      Edit Post
                    </button>
                    <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold">
                      Delete Post
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </article>
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-black">Comments ({comments.length})</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {user && (
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-lg font-semibold mb-4 text-black">Add a comment</h3>
              <div className="space-y-4">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows="4" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-green-600 text-black" placeholder="Write your comment here..." />
                <button onClick={handleAddComment} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold">
                  Post Comment
                </button>
              </div>
            </div>
          )}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">
                      {comment.user?.username || comment.author?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </section>
      </div>
    </div>
  );
}
