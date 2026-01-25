package models

import "time"

type Post struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	TopicID      int       `json:"topic_id"`
	UserID       int       `json:"user_id"`
	Username     string    `json:"username"`
	VoteCount    int       `json:"vote_count"`
	UserVote     int       `json:"user_vote"`
	CommentCount int       `json:"comment_count"`
	TimeCreated  time.Time `json:"time_created"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type CreatePostResponse struct {
	ID int `json:"id"`
}
