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
		buyer.POST("/", controllers.CreateBuyerProfile)         // Create profile
		buyer.GET("/:user_id", controllers.GetBuyerProfileByID) // Get own profile
		buyer.PUT("/:user_id", controllers.UpdateBuyerProfile)  // Update own profile
	}

	// Routes for admin users
	admin := r.Group("/admin/buyer-profile")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly())
	{
		admin.GET("/", controllers.GetAllBuyerProfiles)         // View all profiles
		admin.GET("/:user_id", controllers.GetBuyerProfileByID) // View one profile
		admin.PUT("/:user_id", controllers.UpdateBuyerProfile)  // Update any profile
	}
}
