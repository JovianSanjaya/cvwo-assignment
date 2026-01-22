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

	rows, err := db.DB.Query(`
		SELECT comments.id, comments.content, comments.post_id, comments.user_id, comments.time_created, users.username 
		FROM comments 
		JOIN users ON comments.user_id = users.id 
		WHERE comments.post_id = $1`, postID)

	if err != nil {
		http.Error(w, "Error in getting comments from database", 500)
		return
	}

	defer rows.Close()

	var comments []models.Comments

	for rows.Next() {
		var c models.Comments

		if err := rows.Scan(&c.ID, &c.Content, &c.PostID, &c.UserID, &c.TimeCreated, &c.Username); err != nil {
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

	userID := r.Context().Value("user_id").(int)
	var newID int

	err := db.DB.QueryRow("INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING id", req.Content, postID, userID).Scan(&newID)

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

func UpdateComments(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "commentID")
	userID := r.Context().Value("user_id").(int)

	var req models.CreateCommentRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading comment input", 500)
		return
	}

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM comments WHERE id = $1", commentID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Comment not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to edit this comment", 403)
		return
	}

	_, err = db.DB.Exec("UPDATE comments SET content = $1 WHERE id = $2", req.Content, commentID)
	if err != nil {
		http.Error(w, "Error updating comment", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

func DeleteComments(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "commentID")
	userID := r.Context().Value("user_id").(int)

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM comments WHERE id = $1", commentID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Comment not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to delete this comment", 403)
		return
	}

	_, err = db.DB.Exec("DELETE FROM comments WHERE id = $1", commentID)
	if err != nil {
		http.Error(w, "Error deleting comment", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
}
