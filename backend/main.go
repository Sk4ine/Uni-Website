package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/Sk4ine/Uni-Website/models"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	db, err := sql.Open("mysql", "root:sql-password@tcp(localhost:3306)/unidb")
	if err != nil {
		log.Fatal("Failed to connect to MySQL:", err)
	}

	fmt.Println(models.GetUsers(db))

	defer db.Close()

	r := mux.NewRouter()

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
