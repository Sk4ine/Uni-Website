package models

import (
	"database/sql"
	"strings"
)

func GetProductImagePaths(db *sql.DB, id int) ([]string, error) {
	rows, err := db.Query("SELECT image_paths FROM products WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	var paths string

	for rows.Next() {
		if err := rows.Scan(&paths); err != nil {
			return nil, err
		}
	}

	return strings.Split(paths, ","), nil
}
