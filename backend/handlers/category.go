package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/Sk4ine/Uni-Website/models"
)

func GetCategoryList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		categoryList, err := models.GetCategoryList(db)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(categoryList)
	}
}

func GetCategoryColumnNames(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		columnData, err := models.GetTableColumnNames(db, "categories")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(columnData)
	}
}
