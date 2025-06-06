package models

import (
	"gorm"
)

type FarmerProfile struct {
	gorm.Model

	UserID         uint    `json:"user_id"`
	FarmName       string  `json:"farm_name"`
	FarmSize       float64 `json:"farm_size"` // IN ROPANI OR BIGHA
	FarmLocation   string  `json:"farm_location"`
	Certifications string  `json:"certifications"` // organic, GAP
}
