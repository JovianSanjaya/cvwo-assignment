package models

import "time"

type Comments struct {
	ID          int       `json:"id"`
	Content     string    `json:"content"`
	Post        int       `json:"post_id"`
	TimeCreated time.Time `json:"time_created"`
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type CreateCommentResponse struct {
	ID int `json:"id"`
}
