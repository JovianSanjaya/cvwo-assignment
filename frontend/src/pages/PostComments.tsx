import React, { useEffect, useState } from "react";  
import { useParams, Link } from "react-router-dom";

interface Comment{
    id: number;
    content: string;
    time_created: string;
}


function PostComments(){
    const params = useParams();
    const topicId = params.topicId;
    const postId = params.postId;

    const [comments, SetComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");


    useEffect(() => {
        fetch(`http://localhost:8080/topics/${topicId}/posts/${postId}/comments`)
            .then((response) => response.json())
            .then((data) => SetComments(data || []))
            .catch((error) => console.error("error fetching comments", error));
    }, []);

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        const response = await  fetch(`http://localhost:8080/topics/${topicId}/posts/${postId}/comments`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({content}),
        });

        if(response.ok){
            const newCommID = await response.json();

            const newComment: Comment = {
                id: newCommID.id,
                content: content,
                time_created: "Just Now",
            }

            SetComments([...comments, newComment]);
            setContent("");

        }
        else{
            console.error("failed to post comments");
        }

    }

    return (
        <div>
            <ul>
                {comments.map((comment) => (
                     <li key={comment.id}>
                        <strong>{comment.content}</strong>
                        <br/>
                        <small>Created: {comment.time_created}</small>
                     </li>
                ))}
            </ul>

        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Reply</button>
         </form>
        </div>
    )




}

export default PostComments;