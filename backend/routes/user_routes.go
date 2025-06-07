package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(r *gin.Engine) {
	// Public routes
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	auth := r.Group("/user")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/profile", controllers.GetUserProfile)
		auth.PUT("/profile", controllers.UpdateUserProfile)
		auth.DELETE("/profile", controllers.DeleteUserProfile)
	}

	// Admin-only routes
	admin := r.Group("/admin/users")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminOnly())

	admin.GET("/", controllers.GetAllUsers)
	admin.GET("/:id", controllers.GetUserByID)
	admin.PUT("/:id", controllers.UpdateUserByID)
	admin.DELETE("/:id", controllers.DeleteUserByID)
}
