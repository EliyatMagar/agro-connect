package models

import (
	"gorm.io/gorm"
)

type BuyerProfile struct {
	gorm.Model

	UserID          uint   `json:"user_id" gorm:"uniqueIndex;not null"`
	BusinessName    string `json:"business_name" gorm:"not null"`
	BusinessType    string `json:"business_type" gorm:"type:enum('WHOLESALER','RESTAURANT','RETAILER','HOTEL','PROCESSOR','OTHER');default:'RETAILER'"`
	PANNumber       string `json:"pan_number" gorm:"size:15;uniqueIndex"`
	VATNumber       string `json:"vat_number" gorm:"size:20"`
	BusinessRegNo   string `json:"business_reg_no" gorm:"size:30"`
	ContactPerson   string `json:"contact_person"`
	ContactPhone    string `json:"contact_phone" gorm:"not null"`
	BusinessAddress string `json:"business_address"`
	District        string `json:"district" gorm:"not null"`
	Municipality    string `json:"municipality"`
	WardNumber      int    `json:"ward_number"`
	Verified        bool   `json:"verified" gorm:"default:false"`
	BuyerCategory   string `json:"buyer_category" gorm:"type:enum('SMALL','MEDIUM','LARGE','INSTITUTIONAL');default:'SMALL'"`
	ProfilePhoto    string `json:"profile_photo" gorm:"default:''"`
}
