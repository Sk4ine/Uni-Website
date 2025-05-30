package models

import (
	"database/sql"
	"time"
)

type Order struct {
	ID              int    `json:"id"`
	ClientID        int    `json:"clientID"`
	DateMade        string `json:"dateMade"`
	ShippingAddress string `json:"shippingAddress"`
	Cost            int    `json:"cost"`
}

type OrderProduct struct {
	ID        int `json:"id"`
	ProductID int `json:"clientID"`
	OrderID   int `json:"orderID"`
	Price     int `json:"price"`
	Quantity  int `json:"quantity"`
}

func GetUserOrderList(db *sql.DB, userID int) ([]Order, error) {
	rows, err := db.Query("SELECT * FROM orders WHERE client_id = ?", userID)
	if err != nil {
		return nil, err
	}

	var orders []Order

	for rows.Next() {
		var order Order

		if err := rows.Scan(&order.ID, &order.ClientID, &order.DateMade, &order.ShippingAddress, &order.Cost); err != nil {
			return nil, err
		}

		orders = append(orders, order)
	}

	return orders, nil
}

func addOrder(db *sql.DB, clientID int, dateMade time.Time, shippingAddress string) (int64, error) {
	result, err := db.Exec("INSERT INTO orders (client_id, date_made, shipping_address) VALUES (?, ?, ?)", clientID, dateMade, shippingAddress)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func

func addOrderProduct(db *sql.DB, productID, orderID, price, quantity int) (int64, error) {
	result, err := db.Exec("INSERT INTO order_products (product_id, order_id, price, quantity) VALUES (?, ?, ?, ?)", productID, orderID, price, quantity)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func HandleCheckout(db *sql.DB, clientID int, dateMade time.Time, shippingAddress string, orderProducts []OrderProduct) (int64, error) {
	transaction, err := db.Begin()
	if err != nil {
		return 0, err
	}

	defer transaction.Rollback()

	orderID, err := addOrder(db, clientID, dateMade, shippingAddress)
	if err != nil {
		return 0, err
	}

	for i := 0; i < len(orderProducts); i++ {
		var currentOrderProduct OrderProduct = orderProducts[i]

		_, err := addOrderProduct(db, currentOrderProduct.ProductID, int(orderID), currentOrderProduct.Price, currentOrderProduct.Quantity)
		if err != nil {
			return 0, err
		}
	}

	if err := transaction.Commit(); err != nil {
		return 0, err
	}

	return orderID, nil
}
