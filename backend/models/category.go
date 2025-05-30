package models

import "database/sql"

type ProductCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetCategoryList(db *sql.DB) ([]ProductCategory, error) {
	rows, err := db.Query("SELECT * FROM categories")
	if err != nil {
		return nil, err
	}

	var categoryList []ProductCategory

	for rows.Next() {
		var category ProductCategory

		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}

		categoryList = append(categoryList, category)
	}

	return categoryList, nil
}
