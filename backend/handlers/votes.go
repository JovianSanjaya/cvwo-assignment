package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func VotePosts(w http.ResponseWriter, r *http.Request) {

	postID := chi.URLParam(r, "postID")
	userID := r.Context().Value("user_id").(int)

	var req models.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading vote input", 500)
		return
	}

	if req.VoteType != 1 && req.VoteType != -1 && req.VoteType != 0 {
		http.Error(w, "Invalid vote type need to be 1, -1, or 0", 400)
		return
	}

	if req.VoteType == 0 {
		db.DB.Exec("DELETE FROM votes WHERE post_id = $1 AND user_id = $2", postID, userID)
	} else {
		db.DB.Exec("INSERT INTO votes (post_id, user_id, vote_type) VALUES ($1, $2, $3)",
			postID, userID, req.VoteType)
	}

	var VoteCount int
	db.DB.QueryRow("SELECT COALESCE(SUM(vote_type), 0) FROM votes WHERE post_id = $1",
		postID).Scan(&VoteCount)

	resp := models.VoteResponse{
		VoteCount: VoteCount,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error in writing response when voting", 500)
	}

}

func VoteComments(w http.ResponseWriter, r *http.Request) {

	commentID := chi.URLParam(r, "commentID")
	userID := r.Context().Value("user_id").(int)

	var req models.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading vote input", 500)
		return
	}

	if req.VoteType != 1 && req.VoteType != -1 && req.VoteType != 0 {
		http.Error(w, "Invalid vote type need to be 1, -1, or 0", 400)
		return
	}

	if req.VoteType == 0 {
		db.DB.Exec("DELETE FROM votes WHERE comment_id = $1 AND user_id = $2",
			commentID, userID)
	} else {
		db.DB.Exec("INSERT INTO votes (comment_id, user_id, vote_type) VALUES ($1, $2, $3)",
			commentID, userID, req.VoteType)
	}

	var VoteCount int
	db.DB.QueryRow("SELECT COALESCE(SUM(vote_type), 0) FROM votes WHERE comment_id = $1",
		commentID).Scan(&VoteCount)

	resp := models.VoteResponse{
		VoteCount: VoteCount,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error in writing response when voting", 500)
	}
}
