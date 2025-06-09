package database

import (
	"agro-connect/config"
	"agro-connect/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable Timezone=Asia/Kathmandu",
		config.DB.Host,
		config.DB.User,
		config.DB.Password,
		config.DB.DBName,
		config.DB.Port,
	)

	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect PostgreSQL:", err)
	}
	log.Println("Connected to PostgreSQL database")

	//Auto migrate models

	if err := DB.AutoMigrate(
		&models.User{},
		&models.FarmerProfile{},
		&models.BuyerProfile{},
		&models.TransporterProfile{},
	); err != nil {
		log.Fatal("Migration failed:", err)
	}
}
