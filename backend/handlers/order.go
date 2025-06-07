package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Sk4ine/Uni-Website/models"
)

type CheckoutData struct {
	ShippingAddress string `json:"shippingAddress"`
	ProductID       int    `json:"productID"`
	ProductQuantity int    `json:"productQuantity"`
}

func GetUserOrderList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userContext = r.Context()

		id, ok := userContext.Value(UserID).(int)
		if !ok {
			log.Printf("Error: UserID not found in context for protected route")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
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
		var userContext = r.Context()

		clientID, ok := userContext.Value(UserID).(int)
		if !ok {
			log.Printf("Error: UserID not found in context for protected route")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		var checkoutData CheckoutData

		if err := json.NewDecoder(r.Body).Decode(&checkoutData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, err := models.HandleCheckout(db, clientID, time.Now(), checkoutData.ShippingAddress, checkoutData.ProductID, checkoutData.ProductQuantity)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
