package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterFarmerProfileRoutes(r *gin.Engine) {

	// Farmer or Buyer: Authenticated Routes
	farmer := r.Group("/farmer-profile")
	farmer.Use(middleware.AuthMiddleware(), middleware.FarmerOnly())
	{
		farmer.POST("/", controllers.CreateFarmerProfile)    // POST /farmer-profile
		farmer.GET("/", controllers.GetFarmerProfile)        // GET  /farmer-profile
		farmer.GET("/:id", controllers.GetFarmerProfileByID) // GET  /farmer-profile/:id
		farmer.PUT("/:id", controllers.UpdateFarmerProfile)  // PUT  /farmer-profile/:id
	}

	// Admin-only Routes
	admin := r.Group("/admin/farmer-profile")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly())
	{
		admin.GET("/", controllers.GetFarmerProfile)        // GET  /admin/farmer-profile
		admin.GET("/:id", controllers.GetFarmerProfileByID) // GET  /admin/farmer-profile/:id
		admin.PUT("/:id", controllers.UpdateFarmerProfile)  // PUT  /admin/farmer-profile/:id
	}
}
