package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Sk4ine/Uni-Website/models"
	"github.com/gorilla/mux"
)

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

func CheckUserAuth(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginForm LoginFormData

		if err := json.NewDecoder(r.Body).Decode(&loginForm); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}

		user, err := models.CheckUserAuth(db, loginForm.Email, loginForm.Password)
		if err == sql.ErrNoRows {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(user)
	}
}

func GetUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var id int

		if err := json.NewDecoder(r.Body).Decode(&id); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
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
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		var formData UpdateFormData

		if err := json.NewDecoder(r.Body).Decode(&formData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		changedUser, err := models.UpdateUser(db, id, models.User{
			ID:          id,
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

func AddUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registrationData RegistrationData

		if err := json.NewDecoder(r.Body).Decode(&registrationData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		user, err := models.GetUserByEmail(db, registrationData.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if user.ID != 0 {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		}

		_, err = models.AddUser(db, registrationData.Email, registrationData.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
