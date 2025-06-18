package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	UserID        uint    `json:"user_id"`
	NameEn        string  `json:"name_en"`
	NameNp        string  `json:"name_np"`
	DescriptionEn string  `json:"description_en"`
	DescriptionNp string  `json:"description_np"`
	Category      string  `json:"category"`
	Quantity      float64 `json:"quantity"`
	Unit          string  `json:"unit"` // ✅ fixed typo here
	PricePerUnit  float64 `json:"price_per_unit"`
	AvailableFrom string  `json:"available_from"`
	AvailableTo   string  `json:"available_to"`
	Status        string  `gorm:"default:'available'"`
	ImageURL      string  `json:"image_url"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
