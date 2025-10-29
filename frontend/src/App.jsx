// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogList from './pages/BlogList';
import PostView from './pages/PostView';
import PostForm from './pages/PostForm';
import MainPage from './pages/mainPage';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/posts" element={<BlogList />} />
        <Route path="/posts/:id" element={<PostView />} />
        <Route path="/new" element={<PostForm />} />
        <Route path="/edit/:id" element={<PostForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
