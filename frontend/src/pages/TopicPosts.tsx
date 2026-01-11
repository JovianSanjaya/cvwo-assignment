
import { useEffect, useState } from "react";  
import { useParams, Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  topic: number;
  time_created: string;
}

function TopicPosts(){
  const params = useParams();
  const id = params.id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/topics/${id}/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data || []))
      .catch((error) => console.error("error fetching posts", error));
  },[id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(`http://localhost:8080/topics/${id}/posts`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title, content}),
    });
  
    if(response.ok){
      const newPostID = await response.json();

      const newPost: Post = {
          id: newPostID.id,
          title: title,
          content: content,
          topic: Number(id),
          time_created: "Just Now",
      };

      setPosts([...posts, newPost]);
      setTitle("");
      setContent("");

    }else{
      console.error("failed to create post");
    }
}

return(
  <div>
    <h1>Posts for Topic {id} </h1>
    <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/topics/${id}/posts/${post.id}/comments`}>
              <strong>{post.title}</strong>
            </Link>
            : {post.content}
            <br />
            <small>Created: {post.time_created}</small>
          </li>
        ))}
    </ul>

     <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
         <h3>Add a New Post</h3>
         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
           <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            style={{ padding: "8px" }}
          />
          <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
            Submit Post
          </button>
        </form>
      </div>
  </div>
)
}


export default TopicPosts;


