package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterBuyerProfileRoutes(r *gin.Engine) {
	// Routes for authenticated buyers
	buyer := r.Group("/buyer-profile")
	buyer.Use(middleware.AuthMiddleware(), middleware.BuyerOnly())
	{
		buyer.POST("/", controllers.CreateBuyerProfile)     // Create profile
		buyer.GET("/me", controllers.GetBuyerProfileByID)   // Get own profile
		buyer.PUT("/me", controllers.UpdateBuyerProfile)    // Update own profile
		buyer.DELETE("/me", controllers.DeleteBuyerProfile) // Delete own profile
	}

	// Routes for admin users
	admin := r.Group("/admin/buyer-profiles") // Fixed: Plural for consistency
	admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly())
	{
		admin.GET("/", controllers.GetAllBuyerProfiles)                // View all profiles
		admin.GET("/:user_id", controllers.GetBuyerProfileByID)        // View any profile
		admin.PUT("/:user_id", controllers.UpdateBuyerProfile)         // Update any profile
		admin.DELETE("/:user_id", controllers.DeleteBuyerProfile)      // Delete any profile
		admin.POST("/:user_id/verify", controllers.VerifyBuyerProfile) // Verify a profile
	}
}
