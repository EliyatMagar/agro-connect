package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterTransporterRoutes(r *gin.Engine) {
	// Group routes for authenticated transporters
	transporter := r.Group("/transporter")
	transporter.Use(middleware.AuthMiddleware(), middleware.TransporterOnly()) // Custom middleware for transporter role
	{
		transporter.POST("/profile", controllers.CreateTransporterProfile)
		transporter.GET("/profile/:user_id", controllers.GetTransporterProfileID)
		transporter.PUT("/profile/:user_id", controllers.UpdateTransporterProfile)
		transporter.DELETE("/profile/:user_id", controllers.DeleteTransporterProfile)
	}

	// Admin routes to manage all transporter profiles
	admin := r.Group("/admin/transporters")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly()) // Custom middleware for admin role
	{
		admin.GET("/", controllers.GetAllTransporterProfiles)
		admin.GET("/:user_id", controllers.GetTransporterProfileID)
		admin.PUT("/:user_id", controllers.UpdateTransporterProfile)
		admin.DELETE("/:user_id", controllers.DeleteTransporterProfile)
	}
}
