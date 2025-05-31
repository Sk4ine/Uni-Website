package models

import (
	"database/sql"
	"time"
)

type Order struct {
	ID              int    `json:"id"`
	ClientID        int    `json:"clientID"`
	ProductID       int    `json:"productID"`
	ProductQuantity int    `json:"productQuantity"`
	DateMade        string `json:"dateMade"`
	ShippingAddress string `json:"shippingAddress"`
	Cost            int    `json:"cost"`
}

func GetUserOrderList(db *sql.DB, userID int) ([]Order, error) {
	rows, err := db.Query("SELECT * FROM orders WHERE client_id = ?", userID)
	if err != nil {
		return nil, err
	}

	var orders []Order

	for rows.Next() {
		var order Order

		if err := rows.Scan(&order.ID, &order.ClientID, &order.ProductID, &order.ProductQuantity, &order.DateMade, &order.ShippingAddress, &order.Cost); err != nil {
			return nil, err
		}

		orders = append(orders, order)
	}

	return orders, nil
}

func addOrder(db *sql.DB, clientID int, productID int, productQuantity int, dateMade time.Time, shippingAddress string, cost int) (int64, error) {
	result, err := db.Exec("INSERT INTO orders (client_id, product_id, product_quantity, date_made, shipping_address, cost) VALUES (?, ?, ?, ?, ?, ?)", clientID, productID, productQuantity, dateMade, shippingAddress, cost)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func HandleCheckout(db *sql.DB, clientID int, dateMade time.Time, shippingAddress string, productID int, productQuantity int) (int64, error) {
	transaction, err := db.Begin()
	if err != nil {
		return 0, err
	}

	defer transaction.Rollback()

	product, err := GetProductByID(db, productID)
	if err != nil {
		return 0, err
	}

	orderID, err := addOrder(db, clientID, productID, productQuantity, dateMade, shippingAddress, product.Price*productQuantity)
	if err != nil {
		return 0, err
	}

	if err := transaction.Commit(); err != nil {
		return 0, err
	}

	return orderID, nil
}
