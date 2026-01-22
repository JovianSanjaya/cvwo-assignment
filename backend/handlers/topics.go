package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/go-chi/chi/v5"
)

func GetTopics(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, title, user_id, time_created FROM topics")

	if err != nil {
		http.Error(w, "Error in getting topics from database", 500)
		return
	}

	defer rows.Close()

	var topics []models.Topic

	for rows.Next() {
		var t models.Topic

		if err := rows.Scan(&t.ID, &t.Title, &t.UserID, &t.TimeCreated); err != nil {
			http.Error(w, "Error scanning topic", 500)
			return
		}
		topics = append(topics, t)
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(topics); err != nil {
		http.Error(w, "Error in writing response when getting new topics", 500)
	}

}

func CreateTopics(w http.ResponseWriter, r *http.Request) {
	var req models.CreateTopicRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading user topics input", 500)
		return
	}

	userID := r.Context().Value("user_id").(int)
	var newID int

	err := db.DB.QueryRow("INSERT INTO topics (title, user_id) VALUES ($1, $2) RETURNING id", req.Title, userID).Scan(&newID)

	if err != nil {
		fmt.Printf("Database error in CreateTopics: %v\n", err)
		http.Error(w, fmt.Sprintf("Error in inserting new topics to database: %v", err), 500)
		return
	}

	resp := models.CreateTopicResponse{
		ID: newID,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Error in writing response when creating new topics", 500)
	}

}

func UpdateTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "topicID")
	userID := r.Context().Value("user_id").(int)

	var req models.CreateTopicRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error reading topic input", 500)
		return
	}

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM topics WHERE id = $1", topicID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Topic not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to edit this topic", 403)
		return
	}

	_, err = db.DB.Exec("UPDATE topics SET title = $1 WHERE id = $2", req.Title, topicID)
	if err != nil {
		http.Error(w, "Error updating topic", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")

}

func DeleteTopic(w http.ResponseWriter, r *http.Request) {

	topicID := chi.URLParam(r, "topicID")
	userID := r.Context().Value("user_id").(int)

	var ownerID int
	err := db.DB.QueryRow("SELECT user_id FROM topics WHERE id = $1", topicID).Scan(&ownerID)

	if err != nil {
		http.Error(w, "Topic not found", 404)
		return
	}

	if ownerID != userID {
		http.Error(w, "Unauthorized to delete this topic", 403)
		return

	}
	_, err = db.DB.Exec("DELETE FROM topics WHERE id = $1", topicID)
	if err != nil {
		http.Error(w, "Error deleting topic", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
}
