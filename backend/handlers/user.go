package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Sk4ine/Uni-Website/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey []byte

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found, using system env variables")
	}

	jwtSecret := os.Getenv("JWT_SECRET")

	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable not set")
	}

	jwtKey = []byte(jwtSecret)
}

type RegistrationData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateFormData struct {
	FirstName   string `json:"firstName"`
	SecondName  string `json:"secondName"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
}

type LoginFormData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	UserID  int  `json:"id"`
	IsAdmin bool `json:"isAdmin"`
	jwt.RegisteredClaims
}

/*
func CheckUserIsAdmin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		user, err := models.GetUserAuth(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(user.IsAdmin)
	}
}*/

func HandleLogin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginForm LoginFormData

		if err := json.NewDecoder(r.Body).Decode(&loginForm); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}

		userAuth, err := models.CheckUserAuth(db, loginForm.Email, loginForm.Password)
		if err == sql.ErrNoRows {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		expirationTime := time.Now().Add(48 * time.Hour)
		claims := &Claims{
			UserID:  userAuth.ID,
			IsAdmin: userAuth.IsAdmin,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
				NotBefore: jwt.NewNumericDate(time.Now()),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			http.Error(w, "Could not generate token", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
	}
}

func CheckIfUserIsAdmin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userContext = r.Context()

		id, ok := userContext.Value(UserID).(int)
		if !ok {
			log.Printf("Error: UserID not found in context for protected route")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		isAdmin, err := models.CheckIfUserIsAdmin(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(isAdmin)
	}
}

func GetUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userContext = r.Context()

		id, ok := userContext.Value(UserID).(int)
		if !ok {
			log.Printf("Error: UserID not found in context for protected route")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		user, err := models.GetUserByID(db, id)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(user)
	}
}

func UpdateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userContext = r.Context()

		id, ok := userContext.Value(UserID).(int)
		if !ok {
			log.Printf("Error: UserID not found in context for protected route")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		var formData UpdateFormData

		if err := json.NewDecoder(r.Body).Decode(&formData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		changedUser, err := models.UpdateUser(db, id, models.User{
			Name:        formData.FirstName + " " + formData.SecondName,
			Email:       formData.Email,
			PhoneNumber: formData.PhoneNumber,
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(changedUser)
	}
}

func HandleRegistraion(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registrationData RegistrationData

		if err := json.NewDecoder(r.Body).Decode(&registrationData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		exists, err := models.CheckUserExistance(db, registrationData.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if exists {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registrationData.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Error hashing password:", err)
		}

		_, err = models.AddUser(db, registrationData.Email, hashedPassword)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
