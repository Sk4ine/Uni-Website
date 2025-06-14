package models

import (
	"database/sql"

	"golang.org/x/crypto/bcrypt"
)

type TokenCheck struct {
	ID int
	HashedJTI []byte
}

func AddRefreshToken(db *sql.DB, hashed_jti []byte, clientID int) error {
	_, err := db.Exec("INSERT INTO refresh_tokens (hashed_jti, client_id) VALUES (?, ?)", hashed_jti, clientID)
	if err != nil {
		return err
	}

	return nil
}

func CheckRefreshToken(db *sql.DB, jti string, clientID int) (error) {
	_, err := getTokenIDByJTI(db, jti, clientID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteRefreshToken(db *sql.DB, jti string, clientID int) (error) {
	tokenID, err := getTokenIDByJTI(db, jti, clientID)
	if err != nil {
		return err
	}

	_, err = db.Exec("DELETE FROM refresh_tokens WHERE id = ?", tokenID)
	if err != nil {
		return err
	}

	return nil
}

func getTokenIDByJTI(db *sql.DB, jti string, clientID int) (int, error) {
	rows, err := db.Query("SELECT id, hashed_jti FROM refresh_tokens WHERE client_id = ?", clientID)
	if err != nil {
		return 0, err
	}

	var tokenID int

	for rows.Next() {
		var token TokenCheck
		if err := rows.Scan(&token.ID, &token.HashedJTI); err != nil {
			return 0, err
		}

		if err := bcrypt.CompareHashAndPassword(token.HashedJTI, []byte(jti)); err == nil {
			tokenID = token.ID
		}
	}

	if tokenID == 0 {
		return 0, sql.ErrNoRows
	}

	return tokenID, nil
}