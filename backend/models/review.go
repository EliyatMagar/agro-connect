package models

import (
	"gorm"
)

type Review struct {
	gorm.Model
	ReviewerID uint   `json:"reviewer_id"`
	RevieweeID uint   `json:"reviewee_id"`
	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
	OrderID    uint   `json:"order_id"`
}
