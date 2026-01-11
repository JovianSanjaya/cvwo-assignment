package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetPostsByTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")

	rows, err := db.DB.Query("SELECT id, title, content, topic_id, time_created FROM posts WHERE topic_id = $1", topicID)

	if err != nil {
		http.Error(w, "Error in getting posts from database", 500)
		return
	}

	defer rows.Close()

	var posts []models.Post

	for rows.Next() {
		var p models.Post

		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.Topic, &p.TimeCreated); err != nil {
			http.Error(w, "Error scanning topic", 500)
			return
		}

		posts = append(posts, p)

	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Error in writing response when getting new posts", 500)
	}

}

func CreatePosts(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")
	var req models.CreatePostRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading user posts input", 500)
		return
	}

	var newID int

	err := db.DB.QueryRow("INSERT INTO posts (title, content, topic_id) VALUES ($1, $2, $3) RETURNING id", req.Title, req.Content, topicID).Scan(&newID)

	if err != nil {
		http.Error(w, "Error in inserting new posts to database", 500)
		return
	}

	resp := models.CreatePostResponse{
		ID: newID,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error in writing response when creating new topics", 500)
	}

}
