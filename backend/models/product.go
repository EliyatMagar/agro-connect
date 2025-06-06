package models

import (
	"gorm"
)

type Product struct {
	gorm.Model

	UserID        uint    `json:"user_id"`
	NameEn        string  `json:"name_en"`
	NameNp        string  `json:"name_np"`
	DescriptionEn string  `json:"description_en"`
	DescriptionNp string  `json:"description_np"`
	Category      string  `json:"category"` //Vegetables, fruits, Dairy, etc.
	Quantity      float64 `json:"quantity"`
	Uint          string  `json:"uint"` //Kg, litre, etc.
	PricePerUnit  float64 `json:"price_per_unit"`
	AvailableFrom string  `json:"available_from"`
	AvailableTo   string  `json:"available_to"`
	Status        string  `gorm:"default:'available'"` // or "sold"
	ImageURL      string  `json:"image_url"`
}
