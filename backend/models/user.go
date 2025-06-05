package models

import (
	"database/sql"
	"strings"
)

type User struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
}

type UserAuth struct {
	ID       int    `json:"id"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
}

func GetUserByID(db *sql.DB, id int) (User, error) {
	rows, err := db.Query("SELECT id, client_name, email, phone_number FROM clients_general WHERE id = ?", id)
	if err != nil {
		return User{}, err
	}

	var user User

	for rows.Next() {
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.PhoneNumber); err != nil {
			return User{}, err
		}
	}

	return user, nil
}

func GetUserByEmail(db *sql.DB, email string) (User, error) {
	rows, err := db.Query("SELECT id, client_name, email, phone_number FROM clients_general WHERE email = ?", email)
	if err != nil {
		return User{}, err
	}

	var user User

	for rows.Next() {
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.PhoneNumber); err != nil {
			return User{}, err
		}
	}

	return user, nil
}

func CheckUserAuth(db *sql.DB, email, password string) (User, error) {
	rows, err := db.Query(`
	SELECT clients_general.id, client_name, email, phone_number FROM clients_general
	INNER JOIN clients_auth ON clients_general.id = clients_auth.id
	WHERE email = ? AND client_password = ?`, email, password)
	if err != nil {
		return User{}, err
	}

	var users []User

	for rows.Next() {
		var u User

		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.PhoneNumber); err != nil {
			return User{}, err
		}

		users = append(users, u)
	}

	if len(users) == 0 {
		return User{}, sql.ErrNoRows
	}

	return users[0], nil
}

func GetUserAuth(db *sql.DB, id int) (UserAuth, error) {
	rows, err := db.Query("SELECT id, client_password, is_admin FROM clients_auth WHERE id = ?", id)
	if err != nil {
		return UserAuth{}, err
	}

	var userAuth UserAuth

	for rows.Next() {
		if err := rows.Scan(&userAuth.ID, &userAuth.Password, &userAuth.IsAdmin); err != nil {
			return UserAuth{}, err
		}
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
