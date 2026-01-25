package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/handlers"
	"github.com/JovianSanjaya/cvwo-assignment/middleware"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	db.InitConnDB()
	db.CreateTables()

	r := chi.NewRouter()
	r.Use(chimiddleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Square Forum API"))
	})

	//Public routes
	r.Post("/auth/register", handlers.Register)
	r.Post("/auth/login", handlers.Login)
	r.Post("/auth/google", handlers.GoogleAuth)
	r.Get("/topics", handlers.GetTopics)
	r.Get("/topics/{topicID}/posts", handlers.GetPostsByTopic)
	r.Get("/topics/{topicID}/posts/{postID}/comments", handlers.GetCommentsByPost)
	r.Get("/posts/{postID}", handlers.GetPost)

	//Protected routes
	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth)
		r.Get("/auth/me", handlers.GetMe)

		r.Post("/topics", handlers.CreateTopics)
		r.Put("/topics/{topicID}", handlers.UpdateTopic)
		r.Delete("/topics/{topicID}", handlers.DeleteTopic)

		r.Post("/topics/{topicID}/posts", handlers.CreatePosts)
		r.Put("/posts/{postID}", handlers.UpdatePosts)
		r.Delete("/posts/{postID}", handlers.DeletePosts)

		r.Post("/topics/{topicID}/posts/{postID}/comments", handlers.CreateComments)
		r.Put("/comments/{commentID}", handlers.UpdateComments)
		r.Delete("/comments/{commentID}", handlers.DeleteComments)

		r.Post("/posts/{postID}/vote", handlers.VotePosts)
		r.Post("/comments/{commentID}/vote", handlers.VoteComments)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), r); err != nil {
		log.Fatal(err)
	}
}
