import './App.css'
import Home from "./pages/Home";
import TopicPosts from "./pages/TopicPosts";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostComments from "./pages/PostComments"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topics/:id/posts" element={<TopicPosts />} />
        <Route path="/topics/:topicId/posts/:postId/comments" element={<PostComments />} />


      </Routes>
    </BrowserRouter>
  )
 
}

export default App








