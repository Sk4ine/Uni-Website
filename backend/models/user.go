package models

import (
	"database/sql"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
}

type UserAuth struct {
	ID      int  `json:"id"`
	IsAdmin bool `json:"isAdmin"`
}

func GetUserByID(db *sql.DB, id int) (User, error) {
	rows, err := db.Query("SELECT client_name, email, phone_number FROM clients_general WHERE id = ?", id)
	if err != nil {
		return User{}, err
	}

	var user User

	for rows.Next() {
		if err := rows.Scan(&user.Name, &user.Email, &user.PhoneNumber); err != nil {
			return User{}, err
		}
	}

	return user, nil
}

func GetUserByEmail(db *sql.DB, email string) (User, error) {
	rows, err := db.Query("SELECT client_name, email, phone_number FROM clients_general WHERE email = ?", email)
	if err != nil {
		return User{}, err
	}

	var user User

	for rows.Next() {
		if err := rows.Scan(&user.Name, &user.Email, &user.PhoneNumber); err != nil {
			return User{}, err
		}
	}

	return user, nil
}

func CheckIfUserIsAdmin(db *sql.DB, id int) (bool, error) {
	rows, err := db.Query("SELECT is_admin FROM clients_auth WHERE id=?", id)
	if err != nil {
		return false, err
	}

	var isAdmin bool

	for rows.Next() {
		if err := rows.Scan(&isAdmin); err != nil {
			return false, err
		}
	}

	return isAdmin, nil
}

func CheckUserAuth(db *sql.DB, email, password string) (UserAuth, error) {
	rows, err := db.Query(`
	SELECT clients_general.id, client_hashed_password, is_admin FROM clients_general
	INNER JOIN clients_auth ON clients_general.id = clients_auth.id
	WHERE email = ?`, email)
	if err != nil {
		return UserAuth{}, err
	}

	var userAuth UserAuth
	var hashedPassword []byte

	for rows.Next() {
		if err := rows.Scan(&userAuth.ID, &hashedPassword, &userAuth.IsAdmin); err != nil {
			return UserAuth{}, err
		}
	}

	if userAuth.ID == 0 {
		return UserAuth{}, sql.ErrNoRows
	}

	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
	if err != nil {
		return UserAuth{}, sql.ErrNoRows
	}

	return userAuth, nil
}

func UpdateUser(db *sql.DB, id int, changedUser User) (User, error) {
	transaction, err := db.Begin()
	if err != nil {
		return User{}, err
	}

	defer transaction.Rollback()

	previousUser, err := GetUserByID(db, id)
	if err != nil {
		return User{}, err
	}

	if changedUser.Name == previousUser.Name && changedUser.Email == previousUser.Email && changedUser.PhoneNumber == previousUser.PhoneNumber {
		return previousUser, nil
	}

	var name string = changedUser.Name

	if strings.ReplaceAll(name, " ", "") == "" {
		name = previousUser.Name
	}

	var email string = changedUser.Email

	if email == "" {
		email = previousUser.Email
	}

	var phoneNumber string = changedUser.PhoneNumber

	if phoneNumber == "" {
		phoneNumber = previousUser.PhoneNumber
	}

	_, err = db.Exec("UPDATE clients_general SET client_name = ?, email = ?, phone_number = ? WHERE id = ?", name, email, phoneNumber, id)
	if err != nil {
		return User{}, err
	}

	user, err := GetUserByID(db, id)
	if err != nil {
		return User{}, err
	}

	if err := transaction.Commit(); err != nil {
		return User{}, err
	}

	return user, nil
}

func AddUser(db *sql.DB, email string, password []byte) (int64, error) {
	transaction, err := db.Begin()
	if err != nil {
		return 0, err
	}

	defer transaction.Rollback()

	result, err := db.Exec("INSERT INTO clients_general (email) VALUES (?)", email)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	_, err = db.Exec("INSERT INTO clients_auth (id, client_password) VALUES (?, ?)", id, password)
	if err != nil {
		return 0, err
	}

	if err := transaction.Commit(); err != nil {
		return 0, err
	}

	return id, nil
}

func CheckUserExistance(db *sql.DB, email string) (bool, error) {
	rows, err := db.Query("SELECT EXISTS(SELECT * FROM clients_general WHERE email=?)", email)
	if err != nil {
		return false, err
	}

	var exists bool

	for rows.Next() {
		if err := rows.Scan(&exists); err != nil {
			return false, err
		}
	}

	return exists, nil
}
