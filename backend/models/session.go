package models

import (
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	UserID    uint   `json:"user_id"`
	Token     string `json:"token"`
	ExpiresAt string `json:"expires_at"`
}
