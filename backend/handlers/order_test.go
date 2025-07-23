package handlers

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Sk4ine/Uni-Website/models"
	"github.com/stretchr/testify/assert"
)

func TestGetUserOrderList(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - user order list returned", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{
			"id", "client_id", "product_id", "product_quantity",
			"date_made", "shipping_address", "cost",
		}).
			AddRow(1, 1, 1, 2, "2025-07-01", "Test Address", 2500).
			AddRow(2, 1, 3, 1, "2025-07-02", "Test Address", 3600)

		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM orders WHERE client_id = ?")).WithArgs(1).WillReturnRows(rows)

		req := httptest.NewRequest(http.MethodGet, "/api/users/me/orders", nil)

		req = req.WithContext(context.WithValue(req.Context(), UserID, 1))

		rr := httptest.NewRecorder()

		handler := GetUserOrderList(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var orders []models.Order

		json.Unmarshal(rr.Body.Bytes(), &orders)

		assert.Len(t, orders, 2)
		assert.Equal(t, orders[0], models.Order{ID: 1, ClientID: 1, ProductID: 1, ProductQuantity: 2, DateMade: "2025-07-01", ShippingAddress: "Test Address", Cost: 2500})
		assert.Equal(t, orders[1], models.Order{ID: 2, ClientID: 1, ProductID: 3, ProductQuantity: 1, DateMade: "2025-07-02", ShippingAddress: "Test Address", Cost: 3600})
		
		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - request context is invalid", func(t * testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/users/me/orders", nil)

		rr := httptest.NewRecorder()

		handler := GetUserOrderList(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "Internal server error")

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestHandleCheckout(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	originalHandleCheckout := models.HandleCheckout

	defer func() {
		models.HandleCheckout = originalHandleCheckout
	}()

	t.Run("Success - checkout complete", func(t *testing.T) {
		models.HandleCheckout = func(db *sql.DB, clientID int, dateMade time.Time, shippingAddress string, productID int, productQuantity int) (int64, error) {
			assert.Equal(t, 1, clientID)
			assert.Equal(t, "Test Address", shippingAddress)
			assert.Equal(t, 1, productID)
			assert.Equal(t, 1, productQuantity)
			assert.WithinDuration(t, time.Now(), dateMade, time.Second)
			
			return 1, nil
		}

		checkoutData := CheckoutData{
			ShippingAddress: "Test Address",
			ProductID: 1,
			ProductQuantity: 1,
		}

		jsonBody, err := json.Marshal(checkoutData)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}

		requestBody := bytes.NewBuffer(jsonBody)

		req := httptest.NewRequest(http.MethodPost, "/api/users/me/orders", requestBody)

		req = req.WithContext(context.WithValue(req.Context(), UserID, 1))

		rr := httptest.NewRecorder()

		handler := HandleCheckout(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusCreated, rr.Code)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - request context is invalid", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/users/me/orders", nil)

		rr := httptest.NewRecorder()

		handler := HandleCheckout(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "Internal server error")

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - request body is invalid", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/users/me/orders", nil)

		req = req.WithContext(context.WithValue(req.Context(), UserID, 1))

		rr := httptest.NewRecorder()

		handler := HandleCheckout(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - HandleCheckout model failed", func(t *testing.T) {
		models.HandleCheckout = func(db *sql.DB, clientID int, dateMade time.Time, shippingAddress string, productID int, productQuantity int) (int64, error) {
			assert.Equal(t, clientID, 1)
			return 0, errors.New("db error")
		}

		checkoutData := CheckoutData{
			ShippingAddress: "Test Address",
			ProductID: 1,
			ProductQuantity: 1,
		}

		jsonBody, err := json.Marshal(checkoutData)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}

		requestBody := bytes.NewBuffer(jsonBody)

		req := httptest.NewRequest(http.MethodPost, "/api/users/me/orders", requestBody)

		req = req.WithContext(context.WithValue(req.Context(), UserID, 1))

		rr := httptest.NewRecorder()

		handler := HandleCheckout(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "db error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}