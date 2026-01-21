package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetPostsByTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	search := r.URL.Query().Get("search")

	if page < 1 {
		page = 1
	}

	if limit < 1 || limit > 50 {
		limit = 10
	}

	offset := (page - 1) * limit

	rows, err := db.DB.Query(`
        SELECT id, title, content, topic_id, user_id, time_created 
        FROM posts 
        WHERE topic_id = $1 
        AND (title ILIKE $2 OR content ILIKE $2 OR $2 = '%%')
        ORDER BY time_created DESC 
        LIMIT $3 OFFSET $4`,
		topicID, "%"+search+"%", limit, offset,
	)

	if err != nil {
		http.Error(w, "Error getting posts from database", 500)
		return
	}

	defer rows.Close()

	var posts []models.Post

	for rows.Next() {
		var p models.Post

		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.TopicID, &p.UserID, &p.TimeCreated); err != nil {
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

func UpdatePosts(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "postID")
	userID := r.Context().Value("user_id").(int)

	var req models.CreatePostRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading post input", 500)
		return
	}

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM posts WHERE id = $1", postID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Post not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to edit this post", 403)
		return
	}

	_, err = db.DB.Exec("UPDATE posts SET title=$1, content=$2 WHERE id = $3", req.Title, req.Content, postID)
	if err != nil {
		http.Error(w, "Error updating post", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")

}

func DeletePosts(w http.ResponseWriter, r *http.Request) {

	postID := chi.URLParam(r, "postID")
	userID := r.Context().Value("user_id").(int)

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM posts WHERE id = $1", postID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Post not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to delete this post", 403)
		return

	}
	_, err = db.DB.Exec("DELETE FROM posts WHERE id = $1", postID)
	if err != nil {
		http.Error(w, "Error deleting post", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
}
