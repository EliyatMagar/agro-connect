package models

import (
	"gorm"
)

type Offer struct {
	gorm.Model
	BuyerID    uint    `json:"buyer_id"`
	ProductID  uint    `json:"product_id"`
	Quantity   float64 `json:"quantity"`
	Price      float64 `json:"price"`
	Status     string  `gorm:"default:'pending'"` // accepted, rejected
	PickupDate string  `json:"pickup_date"`
}
