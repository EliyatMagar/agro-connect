package models

import (
	"gorm.io/gorm"
)

type TransporterProfile struct {
	gorm.Model

	UserID      uint    `json:"user_id"`
	VehicleType string  `json:"vehicle_type"`
	LicenseNo   string  `json:"license_no"`
	Capacity    float64 `json:"capacity"` // in kg
}
