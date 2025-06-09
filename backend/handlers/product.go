package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Sk4ine/Uni-Website/models"
	"github.com/gorilla/mux"
)

func GetProductList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		productList, err := models.GetProductList(db)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(productList)
	}
}

func GetProductByID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		product, err := models.GetProductByID(db, id)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(product)
	}
}

func GetProducts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var ids []int

		if err := json.NewDecoder(r.Body).Decode(&ids); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
	}
}

func UpdateProduct(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		var productData models.Product

		if err := json.NewDecoder(r.Body).Decode(&productData); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		err = models.UpdateProduct(
			db,
			id,
			productData.CategoryID,
			productData.Name,
			productData.Price,
			productData.Materials,
			productData.WeightInGrams,
			productData.QuantityInStock,
			productData.CountryOfOrigin,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func AddProduct(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := models.AddProduct(db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func DeleteProduct(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		err = models.DeleteProduct(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
