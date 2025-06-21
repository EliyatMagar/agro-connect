package routes

import (
	"agro-connect/controllers"
	"agro-connect/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterOfferRoutes(router *gin.Engine) {
	offerGroup := router.Group("/offers")
	offerGroup.Use(middleware.AuthMiddleware()) // All offer routes require authentication

	{
		offerGroup.POST("/", middleware.BuyerOnly(), controllers.CreateOffer)
		offerGroup.GET("/", controllers.GetAllOffers)
		offerGroup.GET("/:id", controllers.GetOfferByID)
		offerGroup.PUT("/:id", controllers.UpdateOffer)
		offerGroup.DELETE("/:id", controllers.DeleteOffer)
		offerGroup.GET("/buyer/:buyer_id", controllers.GetOffersByBuyer)
		offerGroup.GET("/product/:product_id", controllers.GetOffersByProduct)
		offerGroup.PATCH("/:id/status", middleware.FarmerOnly(), controllers.UpdateOfferStatus)
	}
}
