package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/JovianSanjaya/cvwo-assignment/db"
	"github.com/JovianSanjaya/cvwo-assignment/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func generateRandomPassword() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func GoogleAuth(w http.ResponseWriter, r *http.Request) {
	if os.Getenv("GOOGLE_CLIENT_ID") == "" {
		http.Error(w, "Google OAuth not configured", http.StatusNotImplemented)
		return
	}

	var req struct {
		Token string `json:"token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	tokenInfoURL := "https://oauth2.googleapis.com/tokeninfo?access_token=" + req.Token
	resp, err := http.Get(tokenInfoURL)
	if err != nil {
		log.Printf("Error verifying token: %v", err)
		http.Error(w, "Authentication failed", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read token info", http.StatusInternalServerError)
		return
	}

	var tokenInfo struct {
		Email         string `json:"email"`
		EmailVerified string `json:"email_verified"`
	}

	if err := json.Unmarshal(body, &tokenInfo); err != nil {
		log.Printf("Error parsing token info: %v", err)
		http.Error(w, "Invalid token response", http.StatusInternalServerError)
		return
	}

	if tokenInfo.Email == "" {
		http.Error(w, "No email in token", http.StatusBadRequest)
		return
	}

	// Fetch user profile from Google to get the name
	profileURL := "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + req.Token
	profileResp, err := http.Get(profileURL)
	if err != nil {
		log.Printf("Error fetching profile: %v", err)
		http.Error(w, "Failed to fetch user profile", http.StatusInternalServerError)
		return
	}
	defer profileResp.Body.Close()

	profileBody, err := io.ReadAll(profileResp.Body)
	if err != nil {
		http.Error(w, "Failed to read profile", http.StatusInternalServerError)
		return
	}

	var profileData struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	if err := json.Unmarshal(profileBody, &profileData); err != nil {
		log.Printf("Error parsing profile: %v", err)
		http.Error(w, "Failed to parse profile", http.StatusInternalServerError)
		return
	}

	// Use Google name as username, fallback to email if name is empty
	username := profileData.Name
	if username == "" {
		username = tokenInfo.Email
	}

	// Check if user already exists by email (use email as unique identifier)
	var user models.User
	var passwordHash string
	err = db.DB.QueryRow(
		"SELECT id, username, password_hash, role, time_created FROM users WHERE username = $1",
		username,
	).Scan(&user.ID, &user.Username, &passwordHash, &user.Role, &user.TimeCreated)

	if err != nil {
		// User doesn't exist, create new user
		randomPassword, err := generateRandomPassword()
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		err = db.DB.QueryRow(
			"INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, time_created",
			username,
			string(hash),
			"user",
		).Scan(&user.ID, &user.TimeCreated)

		if err != nil {
			log.Printf("Error creating user: %v", err)
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		user.Username = username
		user.Role = "user"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "default-secret-key"
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := models.AuthResponse{
		Token: tokenString,
		User:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
