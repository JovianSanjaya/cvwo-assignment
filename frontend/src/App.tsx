import './App.css'
import Home from "./pages/Home";
import TopicPosts from "./pages/TopicPosts";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostComments from "./pages/PostComments"
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/topics/:id/posts" element={<TopicPosts />} />
          <Route path="/topics/:topicId/posts/:postId/comments" element={<PostComments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )

}

export default App








