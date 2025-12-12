import { use, useEffect, useState } from 'react'
import './App.css'

interface Topic {
  id: number;
  title: string;
  time_created: string;
}

function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetch('http://localhost:8080/topics')
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error("Error fetching topics", error));

  },[])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    const response = await fetch('http://localhost:8080/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title }),
    })

    const newTopic = await response.json(); 
    setTopics([...topics, { id: newTopic.id, title: title, time_created: "Just Now"}]);
    setTitle(""); 
  }

  return (
    <>
      <h1>Reddish</h1>
      <ul>
        {topics.map(topic => 
          <li key={topic.id}>
            {topic.title} Created: {topic.time_created}
          </li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Insert new topic title here ' />
          <button type='submit'>Add Topic</button>
      </form>


    </>
  )
}

export default App








