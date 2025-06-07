package models

import (
	"gorm.io/gorm"
)

type BuyerProfile struct {
	gorm.Model

	UserID       uint   `json:"user_id"`
	BusinessName string `json:"business_name"`
	PANNumber    string `json:"pan_number"`
}
