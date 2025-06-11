package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterProductRoutes(router *gin.Engine) {
	productGroup := router.Group("/products")

	// Public Routes
	productGroup.GET("/", controllers.GetAllProducts)
	productGroup.GET("/:id", controllers.GetProductByID)

	// Protected Routes (Farmer only)
	productGroup.Use(middleware.AuthMiddleware(), middleware.FarmerOnly())
	{
		productGroup.POST("/", controllers.CreateProduct)
		productGroup.PUT("/:id", controllers.UpdateProduct)
		productGroup.DELETE("/:id", controllers.DeleteProduct)
	}
}
