package models

import (
	"gorm"
	"time"
)

type User struct {
	gorm.Model
	FullName       string `json:"full_name"`
	Email          string `gorm:"unique" json:"email"`
	PasswordHash   string `json:"-"`
	Role           string `gorm:"type:enum('farmer', 'buyer', 'transporter', 'admin')" json:"role"`
	Language       string `json:"language"` // e.g., "ne", "en"
	Phone          string `gorm:"unique" json:"phone"`
	Address        string `json:"address"`
	District       string `json:"district"`
	Province       string `json:"province"`
	ProfilePicture string `json:"profile_picture"`
	Verified       bool   `json:"verified"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
