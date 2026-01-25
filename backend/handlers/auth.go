package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		fmt.Println("JWT Secret not set")
	}
	return []byte(secret)
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid req body", 500)
		return
	}

	if req.Username == "" || req.Password == "" {
		http.Error(w, "Username and pass are required ", 500)
		return
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	if err != nil {
		http.Error(w, "Error in creating hashed password", 500)
		return
	}
	var user models.User
	err = db.DB.QueryRow("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role, time_created",
		req.Username, string(hashPassword)).Scan(&user.ID, &user.Username, &user.Role, &user.TimeCreated)

	if err != nil {
		http.Error(w, "Username already exists", 500)
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		http.Error(w, "Error in creating token", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  user,
	})
}

func generateToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid req body", 500)
		return
	}

	var user models.User
	var passwordHash string

	err := db.DB.QueryRow(
		"SELECT id, username, password_hash, role, time_created FROM users WHERE username = $1",
		req.Username,
	).Scan(&user.ID, &user.Username, &passwordHash, &user.Role, &user.TimeCreated)

	if err != nil {
		http.Error(w, "Invalid username or password", 500)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Hash Password and password entered do not match", http.StatusUnauthorized)
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		http.Error(w, "Error in creating token", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  user,
	})

}

func GetMe(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(int)

	var user models.User
	err := db.DB.QueryRow(
		"SELECT id, username, role, time_created FROM users WHERE id = $1",
		userID,
	).Scan(&user.ID, &user.Username, &user.Role, &user.TimeCreated)

	if err != nil {
		http.Error(w, "User not found", 404)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
