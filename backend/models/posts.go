package models

import "time"

type Post struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	TopicID     int       `json:"topic_id"`
	UserID      int       `json:"user_id"`
	TimeCreated time.Time `json:"time_created"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type CreatePostResponse struct {
	ID int `json:"id"`
}
