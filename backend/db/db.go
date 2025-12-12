package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitConnDB() {
	var err error

	conn := "user=postgres password=jovian_s.p140204 dbname=cvwo sslmode=disable"
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
	topicsQuery := `
    CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
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
		time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`

	_, errPosts := DB.Exec(postsQuery)
	if errPosts != nil {
		log.Fatal(errPosts)
	}
	log.Println("Table posts created")
}
