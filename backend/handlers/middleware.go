package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

type contextKey string

const UserID = contextKey("userID")

func AuthMiddleware(adminOnly bool) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := r.Header.Get("Authorization")
			if tokenString == "" {
				http.Error(w, "Authorization header required", http.StatusUnauthorized)
				return
			}

			claims, err := ValidateAccessToken(tokenString, adminOnly)
			if err != nil {
				switch(err) {
				case jwt.ErrSignatureInvalid:
					http.Error(w, "Invalid token signature", http.StatusUnauthorized)
				case jwt.ErrTokenExpired:
					http.Error(w, "Token expired", http.StatusUnauthorized)
				case fmt.Errorf("invalid token format"):
					http.Error(w, "Invalid token format", http.StatusUnauthorized)
				case fmt.Errorf("user is not admin"):
					http.Error(w, "User is not admin", http.StatusForbidden)
				default:
					http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
				}
				return
			}

			userContext := context.WithValue(r.Context(), UserID, claims.UserID)

			next.ServeHTTP(w, r.WithContext(userContext))
		})
	}
}
