package models

import (
	"gorm"
)

type TransportSchedule struct {
	gorm.Model
	TransporterID uint   `json:"transporter_id"`
	OrderID       uint   `json:"order_id"`
	VehicleNumber string `json:"vehicle_number"`
	FromLocation  string `json:"from_location"`
	ToLocation    string `json:"to_location"`
	ScheduledDate string `json:"scheduled_date"`
	Status        string `gorm:"default:'pending'"` // in_transit, delivered
}
