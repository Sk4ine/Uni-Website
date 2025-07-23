package models

import (
	"errors"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestGetCategoryList(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - returns categories", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id", "name"}).
			AddRow(1, "Серьги").
			AddRow(2, "Ожерелья")
		
		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM categories")).WillReturnRows(rows)

		categories, err := GetCategoryList(db)
		assert.NoError(t, err)
		assert.Len(t, categories, 2)
		assert.Equal(t, ProductCategory{ID: 1, Name: "Серьги"}, categories[0])
		assert.Equal(t, ProductCategory{ID: 2, Name: "Ожерелья"}, categories[1])

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database query fails", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM categories")).WillReturnError(errors.New("db error"))

		categories, err := GetCategoryList(db)
		assert.Error(t, err)
		assert.Nil(t, categories)
		assert.EqualError(t, err, "db error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestUpdateCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - updates category data", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("UPDATE categories SET category_name = ? WHERE id = ?")).WithArgs("Ожерелья", 1).WillReturnResult(sqlmock.NewResult(1, 1))

		err := UpdateCategory(db, 1, "Ожерелья")
		assert.NoError(t, err)
		
		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database exec fails", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("UPDATE categories SET category_name = ? WHERE id = ?")).WithArgs("Ожерелья", 1).WillReturnError(errors.New("db error"))

		err := UpdateCategory(db, 1, "Ожерелья")
		assert.EqualError(t, err, "db error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestAddCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - new category added", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO categories () VALUES ()")).WillReturnResult(sqlmock.NewResult(1, 1))

		err := AddCategory(db)
		assert.NoError(t, err)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database exec failed", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO categories () VALUES ()")).WillReturnError(errors.New("db error"))

		err := AddCategory(db)
		assert.EqualError(t, err, "db error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestDeleteCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - category entry deleted", func(t *testing.T) {
		sqlmock.NewRows([]string{"id", "name"}).AddRow(1, "Серьги")

		mock.ExpectExec(regexp.QuoteMeta("DELETE FROM categories WHERE id=?")).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))

		err := DeleteCategory(db, 1)
		assert.NoError(t, err)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - database exec failed", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("DELETE FROM categories WHERE id=?")).WithArgs(1).WillReturnError(errors.New("db error"))

		err := DeleteCategory(db, 1)
		assert.EqualError(t, err, "db error")

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	}) 
}