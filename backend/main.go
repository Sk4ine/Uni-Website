package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/Sk4ine/Uni-Website/handlers"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/gorilla/mux"
)

func main() {
	db, err := sql.Open("mysql", "root:sql-password@tcp(localhost:3306)/unidb?multiStatements=true")
	if err != nil {
		log.Fatal("Failed to connect to MySQL:", err)
	}

	defer db.Close()

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		log.Fatalf("failed to create migrate driver: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://./migrations",
		"mysql",
		driver,
	)
	if err != nil {
		log.Fatalf("failed to create migrate instance: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migration failed: %v", err)
	}

	log.Println("Migrations applied successfully!")

	r := mux.NewRouter()

	r.HandleFunc("/api/users/{id}", handlers.GetUser(db)).Methods("GET")
	r.HandleFunc("/api/users", handlers.AddUser(db)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/users/{id}", handlers.UpdateUser(db)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/users/{id}/orders", handlers.GetUserOrderList(db)).Methods("GET")
	r.HandleFunc("/api/users/{id}/orders", handlers.HandleCheckout(db)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/users/{id}/is-admin", handlers.CheckUserIsAdmin(db)).Methods("GET")

	r.HandleFunc("/api/auth/login", handlers.CheckUserAuth(db)).Methods("POST", "OPTIONS")

	r.HandleFunc("/api/products", handlers.GetProductList(db)).Methods("GET")
	r.HandleFunc("/api/products/{id}", handlers.GetProductByID(db)).Methods("GET")

	r.HandleFunc("/api/categories", handlers.GetCategoryList(db)).Methods("GET")

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
