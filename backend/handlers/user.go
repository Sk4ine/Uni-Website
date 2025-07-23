package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Sk4ine/Uni-Website/config"
	"github.com/Sk4ine/Uni-Website/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtConfig config.JWTConfig

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

type AccessClaims struct {
	UserID  int  `json:"id"`
	IsAdmin bool `json:"isAdmin"`
	jwt.RegisteredClaims
}

type RefreshClaims struct {
	UserID int `json:"id"`
	JTI string `json:"jti"`
	jwt.RegisteredClaims
}


func GenerateAccessToken(userAuth models.UserAuth, accessSecret []byte) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &AccessClaims{
		UserID:  userAuth.ID,
		IsAdmin: userAuth.IsAdmin,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(accessSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func GenerateRefreshToken(db *sql.DB, userID int, refreshSecret []byte) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour)
	jti := fmt.Sprintf("%x", time.Now().UnixNano())  
	claims := &RefreshClaims{
		UserID:  userID,
		JTI: jti,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(refreshSecret)
	if err != nil {
		return "", err
	}

	hashedJTI, err := bcrypt.GenerateFromPassword([]byte(jti), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Error hashing password:", err)
	}

	err = models.AddRefreshToken(db, hashedJTI, userID)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func HandleLogin(db *sql.DB, cfg config.JWTConfig) http.HandlerFunc {
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

		tokenString, err := GenerateAccessToken(userAuth, cfg.Secret)
		if err != nil {
			http.Error(w, "Could not generate access token", http.StatusInternalServerError)
			return
		}

		refreshTokenString, err := GenerateRefreshToken(db, userAuth.ID, cfg.RefreshSecret)
		if err != nil {
			http.Error(w, "Could not generate refresh token", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "jwtRefresh",
			Value:    refreshTokenString,
			Path:     "/",
			Expires:  time.Now().Add(7 * 24 * time.Hour),
			HttpOnly: true,
			Secure:   os.Getenv("NODE_ENV") == "production",
			SameSite: http.SameSiteLaxMode,
		})

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
	}
}

func HandleLogout(db *sql.DB, cfg config.JWTConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:     "jwtRefresh",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   os.Getenv("NODE_ENV") == "production",
			SameSite: http.SameSiteLaxMode,
		})

		cookie, err := r.Cookie("jwtRefresh")
		if err != nil {
			return
		}

		claims, err := ValidateRefreshToken(cookie.Value, cfg.RefreshSecret)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = models.DeleteRefreshToken(db, claims.JTI, claims.UserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Println("Logged out")

		w.WriteHeader(http.StatusNoContent)
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

func RefreshAccessToken(db *sql.DB, cfg config.JWTConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwtRefresh")
		if err != nil {
			if err == http.ErrNoCookie {
				http.Error(w, "Refresh token cookie not found", http.StatusUnauthorized)
				return
			}
			
			http.Error(w, "Error reading cookie", http.StatusBadRequest)
			return
		}

		refreshTokenString := cookie.Value

		claims, err := ValidateRefreshToken(refreshTokenString, cfg.RefreshSecret)
		if err != nil {
			switch(err) {
			case jwt.ErrSignatureInvalid:
				http.Error(w, "Invalid token signature", http.StatusUnauthorized)
			case jwt.ErrTokenExpired:
				http.Error(w, "Token expired", http.StatusUnauthorized)
			case fmt.Errorf("invalid token format"):
				http.Error(w, "Invalid token format", http.StatusUnauthorized)
			default:
				http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			}
			return
		}

		err = models.CheckRefreshToken(db, claims.JTI, claims.UserID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		isAdmin, err := models.CheckIfUserIsAdmin(db, claims.UserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		var userAuth models.UserAuth = models.UserAuth{ID: claims.UserID, IsAdmin: isAdmin}

		newTokenString, err := GenerateAccessToken(userAuth, cfg.Secret)
		if err != nil {
			http.Error(w, "Could not generate refresh token", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]string{"token": newTokenString})
	}
}

func ValidateAccessToken(tokenString string, adminOnly bool, accessSecret []byte) (*AccessClaims, error) {
	if len(tokenString) < 7 || tokenString[:7] != "Bearer " {
		return nil, fmt.Errorf("invalid token format")
	}

	tokenString = tokenString[7:]

	claims := &AccessClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		
		return accessSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	if adminOnly && !claims.IsAdmin {
		return nil, fmt.Errorf("user is not admin")
	}

	return claims, nil
}

func ValidateRefreshToken(tokenString string, refreshSecret []byte) (*RefreshClaims, error) {
	claims := &RefreshClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		
		return refreshSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}