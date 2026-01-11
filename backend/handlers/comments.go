package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetCommentsByPost(w http.ResponseWriter, r *http.Request) {

	postID := chi.URLParam(r, "postID")

	rows, err := db.DB.Query("SELECT id, content, post_id, time_created FROM comments WHERE post_id = $1", postID)

	if err != nil {
		http.Error(w, "Error in getting comments from database", 500)
		return
	}

	defer rows.Close()

	var comments []models.Comments

	for rows.Next() {
		var c models.Comments

		if err := rows.Scan(&c.ID, &c.Content, &c.Post, &c.TimeCreated); err != nil {
			http.Error(w, "Error scanning comment", 500)
			return
		}

		comments = append(comments, c)

	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(comments); err != nil {
		http.Error(w, "Error in writing response when getting new posts", 500)
	}
}

func CreateComments(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "postID")
	var req models.CreateCommentRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading user comments input", 500)
		return
	}

	var newID int

	err := db.DB.QueryRow("INSERT INTO comments (content, post_id) VALUES ($1, $2) RETURNING id", req.Content, postID).Scan(&newID)

	if err != nil {
		http.Error(w, "Error in inserting new comments to database", 500)
		return
	}

	resp := models.CreateCommentResponse{
		ID: newID,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error in writing response when creating new comments", 500)
	}
}
