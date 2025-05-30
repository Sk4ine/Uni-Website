package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Sk4ine/Uni-Website/models"
	"github.com/gorilla/mux"
)

type CheckoutData struct {
	ShippingAddress string                `json:"shippingAddress"`
	OrderProducts   []models.OrderProduct `json:"orderProducts"`
}

func GetUserOrderList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		orderList, err := models.GetUserOrderList(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(orderList)
	}
}

func HandleCheckout(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		clientID, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		var checkoutData CheckoutData

		if err := json.NewDecoder(r.Body).Decode(&checkoutData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, err = models.HandleCheckout(db, clientID, time.Now(), checkoutData.ShippingAddress, checkoutData.OrderProducts)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
