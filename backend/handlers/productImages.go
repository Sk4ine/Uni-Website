package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
)

const (
	MAX_UPLOAD_SIZE = 10 << 20
	IMAGES_ROOT_DIR = "static/productImages"
)

func getImageFileName(name string) (string, error) {
	files, err := os.ReadDir(IMAGES_ROOT_DIR)
	if err != nil {
		return "", err
	}

	foundFileName := ""

	for _, file := range files {
		if !file.IsDir() && strings.HasPrefix(file.Name(), name) {
			foundFileName = file.Name()
			break
		}
	}

	if foundFileName == "" {
		return "", fmt.Errorf("404")
	}

	return foundFileName, nil
}

func ServeProductImage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["product-id"]

		fileName, err := getImageFileName(fmt.Sprintf("%s%s", "image", idStr))
		if err != nil {
			if err.Error() == "404" {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		http.ServeFile(w, r, filepath.Join(IMAGES_ROOT_DIR, fileName))
	}
}

func UploadProductImage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["product-id"]

		r.ParseMultipartForm(MAX_UPLOAD_SIZE)

		var targetDir string = filepath.Join(IMAGES_ROOT_DIR)

		if err := os.MkdirAll(targetDir, 0755); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		file, fileHeader, err := r.FormFile("imageFile")
		if err != nil {
			if err == http.ErrMissingFile {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		contentType := fileHeader.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			http.Error(w, "Only image files are allowed.", http.StatusBadRequest)
			return
		}

		fileExtension := filepath.Ext(fileHeader.Filename)

		newFileName := fmt.Sprintf("%s%s%s", "image", idStr, fileExtension)

		filePath := filepath.Join(targetDir, newFileName)

		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func DeleteProductImage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["product-id"]

		fileName, err := getImageFileName(fmt.Sprintf("%s%s", "image", idStr))
		if err != nil {
			if err.Error() == "404" {
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		productDirPath := filepath.Join(IMAGES_ROOT_DIR, fileName)

		if _, err := os.Stat(productDirPath); os.IsNotExist(err) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := os.RemoveAll(productDirPath); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
