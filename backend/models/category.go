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

func UpdateCategory(db *sql.DB, id int, name string) error {
	_, err := db.Exec("UPDATE categories SET category_name = ? WHERE id = ?", name, id)
	if err != nil {
		return err
	}

	return nil
}

func AddCategory(db *sql.DB) error {
	_, err := db.Exec("INSERT INTO categories () VALUES ()")
	if err != nil {
		return err
	}

	return nil
}

func DeleteCategory(db *sql.DB, id int) error {
	_, err := db.Exec("DELETE FROM categories WHERE id=?", id)
	if err != nil {
		return err
	}

	return nil
}
