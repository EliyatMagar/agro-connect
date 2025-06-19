package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	ginLimiter "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

func RegisterProductRoutes(router *gin.Engine) {
	// Configure rate limiting (100 requests per minute)
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  100,
	}
	store := memory.NewStore()
	rateLimiter := ginLimiter.NewMiddleware(limiter.New(store, rate))

	// Product routes group
	productGroup := router.Group("/products")
	productGroup.Use(rateLimiter)

	// Public routes (no authentication required)
	productGroup.GET("/", controllers.GetAllProducts)
	productGroup.GET("/:id", controllers.GetProductByID)
	productGroup.GET("/search", controllers.SearchProducts) // New search endpoint

	// Health check endpoint
	productGroup.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "products service is live",
			"status":  "healthy",
			"time":    time.Now().UTC(),
		})
	})

	// Protected routes (require authentication)
	productGroup.Use(middleware.AuthMiddleware())
	{
		// User-specific product routes
		productGroup.GET("/me", controllers.GetProductsByUserID)    // Changed from /user to /me
		productGroup.GET("/me/:id", controllers.GetUserProductByID) // New endpoint

		// Farmer-only routes
		productGroup.Use(middleware.FarmerOnly())
		{
			productGroup.POST("/", controllers.CreateProduct)
			productGroup.PUT("/:id", controllers.UpdateProduct)
			productGroup.PATCH("/:id", controllers.PartialUpdateProduct) // New endpoint
			productGroup.DELETE("/:id", controllers.DeleteProduct)

			// Product status management
			productGroup.PUT("/:id/status", controllers.UpdateProductStatus)
		}

		// Admin-only routes
		productGroup.Use(middleware.AdminOnly())
		{
			productGroup.GET("/admin/all", controllers.AdminGetAllProducts)
			productGroup.DELETE("/admin/:id", controllers.AdminDeleteProduct)
		}
	}
}
