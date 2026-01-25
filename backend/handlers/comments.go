package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/middleware"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetCommentsByPost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "postID")
	currentUserID := middleware.GetOptionalUserID(r)
	sort := r.URL.Query().Get("sort")

	orderBy := "comments.time_created DESC"
	switch sort {
	case "oldest":
		orderBy = "comments.time_created ASC"
	case "top":
		orderBy = "vote_count DESC, comments.time_created DESC"
	}

	query := `
		SELECT 
			comments.id, comments.content, comments.post_id, comments.user_id, comments.time_created, users.username,
			(SELECT COALESCE(SUM(vote_type), 0) FROM votes WHERE comment_id = comments.id) as vote_count,
			(SELECT COALESCE(vote_type, 0) FROM votes WHERE comment_id = comments.id AND user_id = $1) as user_vote
		FROM comments
		JOIN users ON comments.user_id = users.id 
		WHERE comments.post_id = $2
		ORDER BY ` + orderBy

	rows, err := db.DB.Query(query, currentUserID, postID)

	if err != nil {
		http.Error(w, "Error in getting comments from database", 500)
		return
	}
	defer rows.Close()

	var comments []models.Comments
	for rows.Next() {
		var c models.Comments
		var userVote sql.NullInt64
		if err := rows.Scan(&c.ID, &c.Content, &c.PostID, &c.UserID, &c.TimeCreated, &c.Username, &c.VoteCount, &userVote); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		if userVote.Valid {
			c.UserVote = int(userVote.Int64)
		} else {
			c.UserVote = 0
		}
		comments = append(comments, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.CreateCommentResponse{ID: newID})
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
	w.WriteHeader(http.StatusOK)
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
	w.WriteHeader(http.StatusOK)
}
