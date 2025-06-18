package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterProductRoutes(router *gin.Engine) {
	productGroup := router.Group("/products")

	// Public routes
	productGroup.GET("/", controllers.GetAllProducts)
	productGroup.GET("/:id", controllers.GetProductByID)

	// Temporary route for testing
	productGroup.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "products live"})
	})

	// Protected routes
	productGroup.Use(middleware.AuthMiddleware())
	{
		// Routes accessible by any authenticated user
		productGroup.GET("/user", controllers.GetProductsByUserID)

		// Routes accessible only by farmers
		productGroup.Use(middleware.FarmerOnly())
		{
			productGroup.POST("/", controllers.CreateProduct)
			productGroup.PUT("/:id", controllers.UpdateProduct)
			productGroup.DELETE("/:id", controllers.DeleteProduct)
		}
	}
}
