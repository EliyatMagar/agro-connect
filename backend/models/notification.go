package models

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	gorm.Model
	UserID    uint   `json:"user_id"`
	Message   string `json:"message"`
	Type      string `json:"type"` // offer, order, transport, system
	IsRead    bool   `json:"is_read"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
