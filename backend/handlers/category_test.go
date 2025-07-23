package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Sk4ine/Uni-Website/models"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func TestGetCategoryList(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - category list is returned", func(t *testing.T) {
		expectedCategories := []models.ProductCategory{
			{ID: 1, Name: "Серьги"},
			{ID: 2, Name: "Ожерелья"},
		}

		rows := sqlmock.NewRows([]string{"id", "name"}).
			AddRow(1, "Серьги").
			AddRow(2, "Ожерелья")

		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM categories")).WillReturnRows(rows)

		req := httptest.NewRequest(http.MethodGet, "/api/categories", nil)

		rr := httptest.NewRecorder()

		handler := GetCategoryList(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var actualCategories []models.ProductCategory
		err = json.Unmarshal(rr.Body.Bytes(), &actualCategories)
		assert.NoError(t, err)
		assert.Equal(t, expectedCategories, actualCategories)

		err = mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - GetCategoryList model failed", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT * FROM categories")).WillReturnError(errors.New("db error"))

		req := httptest.NewRequest(http.MethodGet, "/api/categories", nil)

		rr := httptest.NewRecorder()

		handler := GetCategoryList(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "db error")

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
	
	t.Run("Success - category updated", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("UPDATE categories SET category_name = ? WHERE id = ?")).WithArgs("Ожерелья", 1).WillReturnResult(sqlmock.NewResult(1, 1))

		req := httptest.NewRequest(http.MethodPut, "/api/admin/categories/1", strings.NewReader("Ожерелья"))

		req = mux.SetURLVars(req, map[string]string{"id": strconv.Itoa(1)})

		rr := httptest.NewRecorder()

		handler := UpdateCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - invalid ID in URL", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPut, "/api/admin/categories/test", nil)

		req = mux.SetURLVars(req, map[string]string{"id": "test"})

		rr := httptest.NewRecorder()

		handler := UpdateCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "ID must be a number")

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - UpdateCategory model failed", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("UPDATE categories SET category_name = ? WHERE id = ?")).WithArgs("Ожерелья", 1).WillReturnError(errors.New("db error"))

		req := httptest.NewRequest(http.MethodPut, "/api/admin/categories/1", strings.NewReader("Ожерелья"))

		req = mux.SetURLVars(req, map[string]string{"id": strconv.Itoa(1)})

		rr := httptest.NewRecorder()

		handler := UpdateCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "db error")

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestAddCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()
	
	t.Run("Success - category added", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO categories () VALUES ()")).WillReturnResult(sqlmock.NewResult(1, 1))

		req := httptest.NewRequest(http.MethodPost, "/api/admin/categories", nil)

		rr := httptest.NewRecorder()

		handler := AddCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - AddCategory model failed", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("INSERT INTO categories () VALUES ()")).WillReturnError(errors.New("db error"))

		req := httptest.NewRequest(http.MethodPost, "/api/admin/categories", nil)

		rr := httptest.NewRecorder()

		handler := AddCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}

func TestDeleteCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	t.Run("Success - category deleted", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("DELETE FROM categories WHERE id=?")).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))

		req := httptest.NewRequest(http.MethodDelete, "/api/admin/categories/1", nil)

		req = mux.SetURLVars(req, map[string]string{"id": strconv.Itoa(1)})

		rr := httptest.NewRecorder()

		handler := DeleteCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - invalid ID in URL", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/api/admin/categories/test", nil)

		req = mux.SetURLVars(req, map[string]string{"id": "test"})

		rr := httptest.NewRecorder()

		handler := DeleteCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		
		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})

	t.Run("Error - DeleteCategory model failed", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta("DELETE FROM categories WHERE id=?")).WithArgs(1).WillReturnError(errors.New("db error"))

		req := httptest.NewRequest(http.MethodDelete, "/api/admin/categories/1", nil)

		req = mux.SetURLVars(req, map[string]string{"id": strconv.Itoa(1)})

		rr := httptest.NewRecorder()

		handler := DeleteCategory(db)
		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusInternalServerError, rr.Code)
		assert.Contains(t, rr.Body.String(), "db error")

		err := mock.ExpectationsWereMet()
		assert.NoError(t, err)
	})
}