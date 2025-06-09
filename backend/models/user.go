package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FullName       string `json:"full_name"`
	Email          string `gorm:"unique" json:"email"`
	PasswordHash   string `json:"-"`
	Role           string `gorm:"type:text;check:role IN ('farmer', 'buyer', 'transporter', 'admin')" json:"role"`
	Language       string `json:"language"`
	Phone          string `gorm:"unique" json:"phone"`
	Address        string `json:"address"`
	District       string `json:"district"`
	Province       string `json:"province"`
	ProfilePicture string `json:"profile_picture"`
	Verified       bool   `json:"verified"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
