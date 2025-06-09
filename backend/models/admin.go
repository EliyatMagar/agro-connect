package models

import (
	"gorm.io/gorm"
)

type AdminLog struct {
	gorm.Model

	AdminID   uint   `json:"admin_id"`
	Action    string `json:"action"`
	Timestamp string `json:"timestamp"`
}
