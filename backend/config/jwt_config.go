package config

import (
	"errors"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type JWTConfig struct {
	Secret        []byte
	RefreshSecret []byte
}

func LoadJWTConfig() (JWTConfig, error) {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found, using system env variables")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return JWTConfig{}, errors.New("JWT_SECRET environment variable not set")
	}

	jwtRefreshSecret := os.Getenv("JWT_REFRESH_SECRET")
	if jwtRefreshSecret == "" {
		return JWTConfig{}, errors.New("JWT_REFRESH_SECRET environment variable not set")
	}

	return JWTConfig{
		Secret:        []byte(jwtSecret),
		RefreshSecret: []byte(jwtRefreshSecret),
	}, nil
}