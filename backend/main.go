package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Sk4ine/Uni-Website/handlers"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/gorilla/mux"
)

func main() {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbPort := os.Getenv("DB_PORT")
	dbName := "unidb"

	if dbUser == "" {
		dbUser = "root"
	}

	if dbPassword == "" {
		log.Fatal("DB_PASSWORD environment variable not set")
	}

	if dbPort == "" {
		dbPort = "3306"
	}

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(localhost:%s)/%s?multiStatements=true", dbUser, dbPassword, dbPort, dbName))
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

	r.HandleFunc("/api/users/me", handlers.AuthMiddleware(handlers.GetUser(db), false)).Methods("GET")
	r.HandleFunc("/api/users/me", handlers.AuthMiddleware(handlers.UpdateUser(db), false)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/users/me/is-admin", handlers.AuthMiddleware(handlers.CheckIfUserIsAdmin(db), false)).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/users/me/orders", handlers.AuthMiddleware(handlers.GetUserOrderList(db), false)).Methods("GET")
	r.HandleFunc("/api/users/me/orders", handlers.AuthMiddleware(handlers.HandleCheckout(db), false)).Methods("POST", "OPTIONS")

	r.HandleFunc("/api/auth/login", handlers.HandleLogin(db)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/auth/register", handlers.HandleRegistraion(db)).Methods("POST", "OPTIONS")

	r.HandleFunc("/api/products", handlers.GetProductList(db)).Methods("GET")
	r.HandleFunc("/api/products/{id}", handlers.GetProductByID(db)).Methods("GET")

	r.HandleFunc("/api/categories", handlers.GetCategoryList(db)).Methods("GET")

	r.HandleFunc("/static/productImages/{product-id}", handlers.ServeProductImages(db)).Methods("GET")

	r.HandleFunc("/api/admin/categories/{id}", handlers.AuthMiddleware(handlers.UpdateCategory(db), true)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/admin/categories", handlers.AuthMiddleware(handlers.AddCategory(db), true)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/admin/categories/{id}", handlers.AuthMiddleware(handlers.DeleteCategory(db), true)).Methods("DELETE", "OPTIONS")

	r.HandleFunc("/api/admin/products/{id}", handlers.AuthMiddleware(handlers.UpdateProduct(db), true)).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/admin/products", handlers.AuthMiddleware(handlers.AddProduct(db), true)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/admin/products/{id}", handlers.AuthMiddleware(handlers.DeleteProduct(db), true)).Methods("DELETE", "OPTIONS")

	fs := http.FileServer(http.Dir("static/"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

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
