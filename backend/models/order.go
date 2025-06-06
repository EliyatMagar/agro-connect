package models

import (
	"gorm"
)

type Order struct {
	gorm.Model
	OfferID   uint   `json:"offer_id"`
	FarmerID  uint   `json:"farmer_id"`
	BuyerID   uint   `json:"buyer_id"`
	ProductID uint   `json:"product_id"`
	OrderDate string `json:"order_date"`
	Status    string `gorm:"default:'processing'"` // completed, canceled
}
