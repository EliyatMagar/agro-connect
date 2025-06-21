package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(router *gin.Engine) {
	orderGroup := router.Group("/orders")
	orderGroup.Use(middleware.AuthMiddleware()) // All order routes require authentication

	{
		// Get all orders (with optional filtering)
		// GET /orders
		// GET /orders?status=processing
		// GET /orders?product_id=123
		orderGroup.GET("/", controllers.GetAllOrders)

		// Create new order
		// POST /orders
		orderGroup.POST("/", middleware.RolesAllowed("buyer"), controllers.CreateOrder)

		// Get specific order
		// GET /orders/:id
		orderGroup.GET("/:id", controllers.GetOrder)

		// Update order
		// PUT /orders/:id
		orderGroup.PUT("/:id", middleware.RolesAllowed("buyer", "admin"), controllers.UpdateOrder)

		// Delete order
		// DELETE /orders/:id
		orderGroup.DELETE("/:id", controllers.DeleteOrder)

		// Update order status
		// PATCH /orders/:id/status
		orderGroup.PATCH("/:id/status", middleware.RolesAllowed("farmer", "admin"), controllers.UpdateOrderStatus)

		// Get orders by buyer
		// GET /orders/buyer/:buyer_id
		orderGroup.GET("/buyer/:buyer_id", middleware.RolesAllowed("buyer", "admin"), controllers.GetOrdersByBuyer)

		// Get orders by farmer
		// GET /orders/farmer/:farmer_id
		orderGroup.GET("/farmer/:farmer_id", middleware.RolesAllowed("farmer", "admin"), controllers.GetOrdersByFarmer)
	}
}
