package models

import (
	"gorm"
)

type Transaction struct {
	gorm.Model
	OrderID  uint    `json:"order_id"`
	BuyerID  uint    `json:"buyer_id"`
	FarmerID uint    `json:"farmer_id"`
	Amount   float64 `json:"amount"`
	Method   string  `json:"method"` // cash, khalti, eSewa
	Status   string  `json:"status"` // success, failed
}
