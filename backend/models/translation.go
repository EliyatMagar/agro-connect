package models

import (
	"gorm"
)

type Translation struct {
	gorm.Model
	ProductID uint   `json:"product_id"`
	Language  string `json:"language"` // en, ne
	Field     string `json:"field"`    // title, description, etc.
	Value     string `json:"value"`
}
