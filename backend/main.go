package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/Sk4ine/Uni-Website/handlers"
	"github.com/Sk4ine/Uni-Website/models"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	db, err := sql.Open("mysql", "root:sql-password@tcp(localhost:3306)/unidb")
	if err != nil {
		log.Fatal("Failed to connect to MySQL:", err)
	}

	defer db.Close()

	fmt.Println(models.GetProductImagePaths(db, 1))

	r := mux.NewRouter()

	r.HandleFunc("/api/users/{id}", handlers.GetUser(db)).Methods("GET")
	r.HandleFunc("/api/users", handlers.AddUser(db)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/users/{id}", handlers.UpdateUser(db)).Methods("PUT", "OPTIONS")

	r.HandleFunc("/api/auth/login", handlers.CheckUserAuth(db)).Methods("POST", "OPTIONS")

	r.HandleFunc("/api/products", handlers.GetProductList(db)).Methods("GET")
	r.HandleFunc("/api/products/{id}", handlers.GetProductByID(db)).Methods("GET")

	r.HandleFunc("/static/productImages/{product-id}", handlers.ServeProductImages(db)).Methods("GET")

	fs := http.FileServer(http.Dir("static/"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
