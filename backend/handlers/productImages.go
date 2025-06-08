package handlers

import (
	"database/sql"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/Sk4ine/Uni-Website/models"
	"github.com/gorilla/mux"
)

func ServeProductImages(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["product-id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "ID must be a number", http.StatusBadRequest)
			return
		}

		paths, err := models.GetProductImagePaths(db, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		http.ServeFile(w, r, filepath.Join("static", "productImages", paths[0]))
	}
}
