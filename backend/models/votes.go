package models

// vote type: 1 for upvote, -1 for downvote, 0 remove vote
type VoteRequest struct {
	VoteType int `json:"vote_type"`
}

type VoteResponse struct {
	VoteCount int `json:"vote_count"`
}
