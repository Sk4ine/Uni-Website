package models

import (
	"database/sql"
	"strings"
)

type ColumnsData struct {
	ColumnName string `json:"columnName"`
}

func GetTableColumnNames(db *sql.DB, tableName string) ([]string, error) {
	rows, err := db.Query(
		`SELECT COLUMN_NAME
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
		ORDER BY ORDINAL_POSITION;`, tableName)
	if err != nil {
		return nil, err
	}

	var columnsData []string

	for rows.Next() {
		var data string

		if err := rows.Scan(&data); err != nil {
			return nil, err
		}

		columnsData = append(columnsData, data)
	}

	return columnsData, nil
}

func GetTableColumnNamesExclude(db *sql.DB, tableName string, excludeTables []string) ([]string, error) {
	rows, err := db.Query(
		`SELECT COLUMN_NAME
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE() AND 
		TABLE_NAME = ? AND COLUMN_NAME NOT IN (?)
		ORDER BY ORDINAL_POSITION;`, tableName, strings.Join(excludeTables, ","))
	if err != nil {
		return nil, err
	}

	var columnsData []string

	for rows.Next() {
		var data string

		if err := rows.Scan(&data); err != nil {
			return nil, err
		}

		columnsData = append(columnsData, data)
	}

	return columnsData, nil
}
