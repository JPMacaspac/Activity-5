import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/mainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import BlogList from './pages/BlogList'
import PostForm from './pages/PostForm'
import PostView from './pages/PostView'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<BlogList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)