package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitConnDB() {
	var err error

	conn := os.Getenv("DATABASE_URL")
	DB, err = sql.Open("postgres", conn)

	if err != nil {
		log.Fatal(err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to postgre db")

}

func CreateTables() {
	userQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		role VARCHAR(50) DEFAULT 'user',
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
	);`
	_, errUser := DB.Exec(userQuery)
	if errUser != nil {
		log.Fatal(errUser)
	}
	log.Println("Users table created")

	topicsQuery := `
	CREATE TABLE IF NOT EXISTS topics (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
	);`

	_, errTopics := DB.Exec(topicsQuery)
	if errTopics != nil {
		log.Fatal(errTopics)
	}
	log.Println("Table topics created")

	postsQuery := `
	CREATE TABLE IF NOT EXISTS posts (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,	
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
	);`

	_, errPosts := DB.Exec(postsQuery)
	if errPosts != nil {
		log.Fatal(errPosts)
	}
	log.Println(" Posts table created")

	commentsQuery := `
	CREATE TABLE IF NOT EXISTS comments (
		id SERIAL PRIMARY KEY,
		content TEXT NOT NULL,
		post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,	
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
	);`

	_, errComments := DB.Exec(commentsQuery)
	if errComments != nil {
		log.Fatal(errComments)
	}
	log.Println("Comments table created")

	votesQuery := `
	CREATE TABLE IF NOT EXISTS votes (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
		comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,	
		vote_type INTEGER NOT NULL,
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(user_id, post_id),
		UNIQUE(user_id, comment_id)
	);`

	_, errVotes := DB.Exec(votesQuery)
	if errVotes != nil {
		log.Fatal(errVotes)
	}
	log.Println("Table votes created")

}
