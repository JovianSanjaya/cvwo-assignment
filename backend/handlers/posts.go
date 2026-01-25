package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/middleware"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetPostsByTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")
	currentUserID := middleware.GetOptionalUserID(r)

	search := r.URL.Query().Get("search")
	sort := r.URL.Query().Get("sort")

	orderBy := "posts.time_created DESC"
	switch sort {
	case "top":
		orderBy = "vote_count DESC, posts.time_created DESC"
	case "comments":
		orderBy = "comment_count DESC, posts.time_created DESC"
	}

	query := `
		SELECT 
			posts.id, posts.title, posts.content, posts.topic_id, posts.user_id, posts.time_created, users.username,
			COALESCE((SELECT SUM(vote_type) FROM votes WHERE post_id = posts.id), 0) as vote_count,
			COALESCE((SELECT vote_type FROM votes WHERE post_id = posts.id AND user_id = $1), 0) as user_vote,
			(SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count
		FROM posts
		JOIN users ON posts.user_id = users.id
		WHERE posts.topic_id = $2 
		AND (posts.title ILIKE $3 OR posts.content ILIKE $3 OR $3 = '%%')
		ORDER BY ` + orderBy

	rows, err := db.DB.Query(query,
		currentUserID, topicID, "%"+search+"%",
	)

	if err != nil {
		http.Error(w, "Error getting posts from database", 500)
		return
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var commentCount int64
		var userVote sql.NullInt64
		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.TopicID, &p.UserID, &p.TimeCreated, &p.Username, &p.VoteCount, &userVote, &commentCount); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		if userVote.Valid {
			p.UserVote = int(userVote.Int64)
		} else {
			p.UserVote = 0
		}
		p.CommentCount = int(commentCount)
		posts = append(posts, p)
	}

	if posts == nil {
		posts = []models.Post{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "postID")
	currentUserID := middleware.GetOptionalUserID(r)

	var p models.Post
	err := db.DB.QueryRow(`
		SELECT 
			p.id, p.title, p.content, p.topic_id, p.user_id, u.username,
			COALESCE((SELECT SUM(vote_type) FROM votes WHERE post_id = p.id), 0) as vote_count,
			COALESCE((SELECT vote_type FROM votes WHERE post_id = p.id AND user_id = $1), 0) as user_vote,
			(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
			p.time_created
		FROM posts p 
		JOIN users u ON p.user_id = u.id 
		WHERE p.id = $2`, currentUserID, postID).Scan(&p.ID, &p.Title, &p.Content, &p.TopicID, &p.UserID, &p.Username, &p.VoteCount, &p.UserVote, &p.CommentCount, &p.TimeCreated)

	if err != nil {
		log.Printf("Error fetching post %s: %v", postID, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(404)
		json.NewEncoder(w).Encode(map[string]string{"error": "Post not found"})
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func CreatePosts(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")
	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading user posts input", 500)
		return
	}

	userID := r.Context().Value("user_id").(int)
	var newID int
	err := db.DB.QueryRow("INSERT INTO posts (title, content, topic_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id", req.Title, req.Content, topicID, userID).Scan(&newID)

	if err != nil {
		http.Error(w, "Error in inserting new posts to database", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.CreatePostResponse{ID: newID})
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
	w.WriteHeader(http.StatusOK)
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
	w.WriteHeader(http.StatusOK)
}
