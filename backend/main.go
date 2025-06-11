package main

import (
	"agro-connect/config"
	"agro-connect/database"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"agro-connect/routes"
)

func main() {
	config.LoadEnv()
	database.Connect()

	router := gin.Default()

	//Load cors origins form .env
	allowedOrigins := strings.Split(os.Getenv("CORS_ORIGIN"), ",")

	// Apply CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	//Register routes
	routes.RegisterUserRoutes(router)
	routes.RegisterFarmerProfileRoutes(router)
	routes.RegisterBuyerProfileRoutes(router)
	routes.RegisterTransporterRoutes(router)
	routes.RegisterProductRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(router.Run(":" + port))
}
