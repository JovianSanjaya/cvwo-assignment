package models

import "time"

type Comments struct {
	ID          int       `json:"id"`
	Content     string    `json:"content"`
	PostID      int       `json:"post_id"`
	UserID      int       `json:"user_id"`
	Username    string    `json:"username"`
	TimeCreated time.Time `json:"time_created"`
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type CreateCommentResponse struct {
	ID int `json:"id"`
}
