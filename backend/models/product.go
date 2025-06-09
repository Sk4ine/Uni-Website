package models

import (
	"database/sql"
)

type Product struct {
	ID              int    `json:"id"`
	CategoryID      int    `json:"categoryID"`
	Name            string `json:"name"`
	Price           int    `json:"price"`
	Materials       string `json:"materials"`
	WeightInGrams   int    `json:"weightInGrams"`
	QuantityInStock int    `json:"quantityInStock"`
	CountryOfOrigin string `json:"countryOfOrigin"`
}

func GetProductList(db *sql.DB) ([]Product, error) {
	rows, err := db.Query("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products")
	if err != nil {
		return nil, err
	}

	var productList []Product

	for rows.Next() {
		var product Product

		if err := rows.Scan(
			&product.ID,
			&product.CategoryID,
			&product.Name,
			&product.Price,
			&product.Materials,
			&product.WeightInGrams,
			&product.QuantityInStock,
			&product.CountryOfOrigin,
		); err != nil {
			return nil, err
		}

		productList = append(productList, product)
	}

	return productList, nil
}

func GetProductByID(db *sql.DB, id int) (Product, error) {
	rows, err := db.Query("SELECT id, category_id, product_name, price, materials, weight_in_grams, quantity_in_stock, country_of_origin FROM products WHERE id = ?", id)
	if err != nil {
		return Product{}, err
	}

	var product Product

	for rows.Next() {
		if err := rows.Scan(
			&product.ID,
			&product.CategoryID,
			&product.Name,
			&product.Price,
			&product.Materials,
			&product.WeightInGrams,
			&product.QuantityInStock,
			&product.CountryOfOrigin,
		); err != nil {
			return Product{}, err
		}
	}

	return product, nil
}

func UpdateProduct(db *sql.DB, id, category_id int, name string, price int, materials string, weightInGrams, quantityInStock int, countryOfOrigin string) error {
	_, err := db.Exec("UPDATE products SET category_id = ?, product_name = ?, price = ?, materials = ?, weight_in_grams = ?, quantity_in_stock = ?, country_of_origin = ? WHERE id = ?",
		category_id,
		name,
		price,
		materials,
		weightInGrams,
		quantityInStock,
		countryOfOrigin,
		id,
	)
	if err != nil {
		return err
	}

	return nil
}

func AddProduct(db *sql.DB) error {
	_, err := db.Exec("INSERT INTO products () VALUES ()")
	if err != nil {
		return err
	}

	return nil
}

func DeleteProduct(db *sql.DB, id int) error {
	_, err := db.Exec("DELETE FROM products WHERE id=?", id)
	if err != nil {
		return err
	}

	return nil
}
