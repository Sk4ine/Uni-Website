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

	apiRouter := r.PathPrefix("/api").Subrouter()

	userRouter := apiRouter.PathPrefix("/users").Subrouter()
	userRouter.Use(handlers.AuthMiddleware(false))

	userRouter.HandleFunc("/me", handlers.GetUser(db)).Methods("GET")
	userRouter.HandleFunc("/me", handlers.UpdateUser(db)).Methods("PUT", "OPTIONS")
	userRouter.HandleFunc("/me/is-admin", handlers.CheckIfUserIsAdmin(db)).Methods("GET", "OPTIONS")
	userRouter.HandleFunc("/me/orders", handlers.GetUserOrderList(db)).Methods("GET")
	userRouter.HandleFunc("/me/orders", handlers.HandleCheckout(db)).Methods("POST", "OPTIONS")

	authRouter := apiRouter.PathPrefix("/auth").Subrouter()

	authRouter.HandleFunc("/login", handlers.HandleLogin(db)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/register", handlers.HandleRegistraion(db)).Methods("POST", "OPTIONS")
	authRouter.HandleFunc("/logout", handlers.HandleLogout(db)).Methods("DELETE", "OPTIONS")
	authRouter.HandleFunc("/refresh-token", handlers.RefreshAccessToken(db)).Methods("GET")

	productsRouter := apiRouter.PathPrefix("/products").Subrouter()

	productsRouter.HandleFunc("", handlers.GetProductList(db)).Methods("GET")
	productsRouter.HandleFunc("/{id}", handlers.GetProductByID(db)).Methods("GET")

	apiRouter.HandleFunc("/categories", handlers.GetCategoryList(db)).Methods("GET")

	staticRouter := r.PathPrefix("/static").Subrouter()

	productImagesRouter := staticRouter.PathPrefix("/productImages").Subrouter()

	productImagesRouter.HandleFunc("/{product-id}", handlers.ServeProductImage()).Methods("GET")

	staticAdminRouter := staticRouter.PathPrefix("/admin").Subrouter()
	staticAdminRouter.Use(handlers.AuthMiddleware(true))

	staticAdminRouter.HandleFunc("/productImages/{product-id}", handlers.UploadProductImage()).Methods("POST", "OPTIONS")
	staticAdminRouter.HandleFunc("/productImages/{product-id}", handlers.DeleteProductImage()).Methods("DELETE", "OPTIONS")

	adminRouter := apiRouter.PathPrefix("/admin").Subrouter()
	adminRouter.Use(handlers.AuthMiddleware(true))

	adminCategoriesRouter := adminRouter.PathPrefix("/categories").Subrouter()

	adminCategoriesRouter.HandleFunc("/{id}", handlers.UpdateCategory(db)).Methods("PUT", "OPTIONS")
	adminCategoriesRouter.HandleFunc("", handlers.AddCategory(db)).Methods("POST", "OPTIONS")
	adminCategoriesRouter.HandleFunc("/{id}", handlers.DeleteCategory(db)).Methods("DELETE", "OPTIONS")

	adminProductsRouter := adminRouter.PathPrefix("/products").Subrouter()

	adminProductsRouter.HandleFunc("/{id}", handlers.UpdateProduct(db)).Methods("PUT", "OPTIONS")
	adminProductsRouter.HandleFunc("", handlers.AddProduct(db)).Methods("POST", "OPTIONS")
	adminProductsRouter.HandleFunc("/{id}", handlers.DeleteProduct(db)).Methods("DELETE", "OPTIONS")

	fs := http.FileServer(http.Dir("static/"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

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
