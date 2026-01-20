package models

import "time"

type Topic struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	UserID      int       `json:"user_id"`
	TimeCreated time.Time `json:"time_created"`
}

type CreateTopicRequest struct {
	Title string `json:"title"`
}

type CreateTopicResponse struct {
	ID int `json:"id"`
}
