package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
)

func GetTopics(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, title, time_created FROM topics")

	if err != nil {
		http.Error(w, "Error in getting topics from database", 500)
		return
	}

	defer rows.Close()

	var topics []models.Topic

	for rows.Next() {
		var t models.Topic

		if err := rows.Scan(&t.ID, &t.Title, &t.TimeCreated); err != nil {
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

	var newID int

	err := db.DB.QueryRow("INSERT INTO topics (title) VALUES ($1) RETURNING id", req.Title).Scan(&newID)

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
