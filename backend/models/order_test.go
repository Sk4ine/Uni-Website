package models

import (
	"errors"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetUserOrderList(t *testing.T) {
	db, mock, err := sqlmock.New()
	if(err != nil) {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - user order list was returned", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{
			"id", "client_id", "product_id", "product_quantity",
			"date_made", "shipping_address", "cost",
		}).
		AddRow(1, 1, 1, 2, "2025-07-01", "Test Address", 2500).
		AddRow(2, 1, 3, 1, "2025-07-02", "Test Address", 3600)

		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM orders WHERE client_id = ?")).WithArgs(1).WillReturnRows(rows)

		orders, err := GetUserOrderList(db, 1)
		assert.NoError(t, err)
		assert.Len(t, orders, 2)
		assert.Equal(t, orders[0], Order{ID: 1, ClientID: 1, ProductID: 1, ProductQuantity: 2, DateMade: "2025-07-01", ShippingAddress: "Test Address", Cost: 2500})
		assert.Equal(t, orders[1], Order{ID: 2, ClientID: 1, ProductID: 3, ProductQuantity: 1, DateMade: "2025-07-02", ShippingAddress: "Test Address", Cost: 3600})

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database query error", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM orders WHERE client_id = ?")).WithArgs(1).WillReturnError(errors.New("db error"))

		_, err := GetUserOrderList(db, 1)
		assert.Error(t, err)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestAddOrder(t *testing.T) {
	db, mock, err := sqlmock.New()
	if(err != nil) {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - order added", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)")).
			WithArgs(1, 1, 2, expectedDate, "Test Address", 1250).
			WillReturnResult(sqlmock.NewResult(1, 1))

		id, err := addOrder(db, 1, 1, 2, expectedDate, "Test Address", 1250)
		assert.NoError(t, err)
		assert.Equal(t, id, int64(1))

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database exec error", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)")).
			WithArgs(1, 1, 2, expectedDate, "Test Address", 1250).
			WillReturnError(errors.New("db error"))

		_, err := addOrder(db, 1, 1, 2, expectedDate, "Test Address", 1250)
		assert.Error(t, err)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestHandleCheckout(t *testing.T) {
	db, mock, err := sqlmock.New()
	if(err != nil) {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()
	
	t.Run("Success - checkout transaction completed", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectBegin()

		rows := sqlmock.NewRows([]string{"id", "category_id", "product_name", "price", "materials", "weight_in_grams", "quantity_in_stock", "country_of_origin"}).
		AddRow(1, 1, "Test Product", 700, "Test Material", 10, 4, "Unknown")

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products WHERE id = ?")).
		WithArgs(1).
		WillReturnRows(rows)

		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)")).
		WithArgs(1, 1, 2, expectedDate, "Test Address", 1400).
		WillReturnResult(sqlmock.NewResult(1, 1))

		mock.ExpectCommit()

		id, err := HandleCheckout(db, 1, expectedDate, "Test Address", 1, 2)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), id)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - transaction begin failed", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectBegin().WillReturnError(errors.New("begin transaction error"))

		_, err := HandleCheckout(db, 1, expectedDate, "Test Address", 1, 2)
		assert.EqualError(t, err, "begin transaction error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - GetProductByID call failed", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectBegin()

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products WHERE id = ?")).
		WithArgs(1).
		WillReturnError(errors.New("getproductbyid error"))

		mock.ExpectRollback()

		_, err := HandleCheckout(db, 1, expectedDate, "Test Address", 1, 2)
		assert.EqualError(t, err, "getproductbyid error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - addOrder call failed", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectBegin()

		rows := sqlmock.NewRows([]string{"id", "category_id", "product_name", "price", "materials", "weight_in_grams", "quantity_in_stock", "country_of_origin"}).
		AddRow(1, 1, "Test Product", 700, "Test Material", 10, 4, "Unknown")

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products WHERE id = ?")).
		WithArgs(1).
		WillReturnRows(rows)

		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)")).
		WithArgs(1, 1, 2, expectedDate, "Test Address", 1400).
		WillReturnError(errors.New("addorder error"))

		mock.ExpectRollback()

		_, err := HandleCheckout(db, 1, expectedDate, "Test Address", 1, 2)
		assert.EqualError(t, err, "addorder error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - transaction commit failed", func(t *testing.T) {
		expectedDate := time.Now().Truncate(time.Second)

		mock.ExpectBegin()

		rows := sqlmock.NewRows([]string{"id", "category_id", "product_name", "price", "materials", "weight_in_grams", "quantity_in_stock", "country_of_origin"}).
		AddRow(1, 1, "Test Product", 700, "Test Material", 10, 4, "Unknown")

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products WHERE id = ?")).
		WithArgs(1).
		WillReturnRows(rows)

		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)")).
		WithArgs(1, 1, 2, expectedDate, "Test Address", 1400).
		WillReturnResult(sqlmock.NewResult(1, 1))

		mock.ExpectCommit().WillReturnError(errors.New("commit transaction error"))

		_, err := HandleCheckout(db, 1, expectedDate, "Test Address", 1, 2)
		assert.EqualError(t, err, "commit transaction error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}