package main

import (
	"log"
	"net/http"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	db.InitConnDB()
	db.CreateTables()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	r.Get("/topics", handlers.GetTopics)

	r.Get("/topics/{topicID}/posts", handlers.GetPostsByTopic)

	r.Get("/topics/{topicID}/posts/{postID}/comments", handlers.GetCommentsByPost)

	r.Post("/topics", handlers.CreateTopics)

	r.Post("/topics/{topicID}/posts", handlers.CreatePosts)

	r.Post("/topics/{topicID}/posts/{postID}/comments", handlers.CreateComments)

	log.Println("Server starting on port 8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
