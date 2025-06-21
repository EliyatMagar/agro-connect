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

	// ✅ Create ENUM types before AutoMigrate
	createEnums(DB)

	// ✅ AutoMigrate after enum creation
	if err := DB.AutoMigrate(
		&models.User{},
		&models.FarmerProfile{},
		&models.BuyerProfile{},
		&models.TransporterProfile{},
		&models.Product{},
		&models.Offer{},
		&models.Order{},
	); err != nil {
		log.Fatal("Migration failed:", err)
	}
}

func createEnums(db *gorm.DB) {
	// Create business_type enum
	db.Exec(`
		DO $$ BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type') THEN
				CREATE TYPE business_type AS ENUM ('WHOLESALER', 'RESTAURANT', 'RETAILER', 'HOTEL', 'PROCESSOR', 'OTHER');
			END IF;
		END $$;
	`)

	// Create buyer_category enum
	db.Exec(`
		DO $$ BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buyer_category') THEN
				CREATE TYPE buyer_category AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'INSTITUTIONAL');
			END IF;
		END $$;
	`)

	db.Exec(`
	DO $$ BEGIN
		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
			CREATE TYPE order_status AS ENUM ('processing', 'completed', 'canceled');
		END IF;
	END $$;
`)

}
