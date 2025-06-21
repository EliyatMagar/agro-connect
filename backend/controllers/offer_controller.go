package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateOffer(c *gin.Context) {
	// Only buyers can create offers
	role, _ := c.Get("role")
	if role != "buyer" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only buyers can create offers"})
		return
	}

	userID, _ := c.Get("userID")
	var offer models.Offer

	if err := c.ShouldBindJSON(&offer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set buyer ID from JWT claims
	offer.BuyerID = userID.(uint)

	if err := database.DB.Create(&offer).Error; err != nil {
		fmt.Println("DB Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create offer",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Offer created successfully",
		"offer":   offer,
	})
}

func GetAllOffers(c *gin.Context) {
	var offers []models.Offer

	// Farmers can only see offers for their products
	if role, _ := c.Get("role"); role == "farmer" {
		userID, _ := c.Get("userID")
		if err := database.DB.Joins("JOIN products ON products.id = offers.product_id").
			Where("products.farmer_id = ?", userID).
			Find(&offers).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve offers"})
			return
		}
	} else {
		// Admins and buyers see all offers
		if err := database.DB.Find(&offers).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve offers"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"offers": offers})
}

func GetOfferByID(c *gin.Context) {
	id := c.Param("id")
	var offer models.Offer

	if err := database.DB.First(&offer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Offer not found"})
		return
	}

	// Authorization check
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	// Only allow access if:
	// - User is admin
	// - User is the buyer who created the offer
	// - User is the farmer who owns the product
	if role != "admin" && offer.BuyerID != userID.(uint) {
		// Check if user is the farmer who owns the product
		var product models.Product
		if err := database.DB.First(&product, offer.ProductID).Error; err == nil {
			if product.UserID != userID.(uint) {
				c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view this offer"})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"offer": offer})
}

func UpdateOffer(c *gin.Context) {
	id := c.Param("id")
	var offer models.Offer

	if err := database.DB.First(&offer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Offer not found"})
		return
	}

	// Only buyer who created the offer can update it
	userID, _ := c.Get("userID")
	if offer.BuyerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the buyer who created the offer can update it"})
		return
	}

	if err := c.ShouldBindJSON(&offer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&offer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update offer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Offer updated successfully",
		"offer":   offer,
	})
}

func DeleteOffer(c *gin.Context) {
	id := c.Param("id")
	var offer models.Offer

	if err := database.DB.First(&offer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Offer not found"})
		return
	}

	// Only buyer who created the offer or admin can delete it
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")
	if offer.BuyerID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this offer"})
		return
	}

	if err := database.DB.Delete(&offer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete offer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Offer deleted successfully"})
}

func GetOffersByBuyer(c *gin.Context) {
	buyerID := c.Param("buyer_id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	// Only allow if:
	// - User is admin
	// - User is requesting their own offers
	if role != "admin" && buyerID != fmt.Sprint(userID.(uint)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view these offers"})
		return
	}

	var offers []models.Offer
	if err := database.DB.Where("buyer_id = ?", buyerID).Find(&offers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve offers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offers": offers})
}

func GetOffersByProduct(c *gin.Context) {
	productID := c.Param("product_id")
	var offers []models.Offer

	// Check if the current user owns the product
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role == "farmer" {
		var product models.Product
		if err := database.DB.First(&product, productID).Error; err == nil {
			if product.UserID != userID.(uint) {
				c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view offers for this product"})
				return
			}
		}
	}

	if err := database.DB.Where("product_id = ?", productID).Find(&offers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve offers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offers": offers})
}

func UpdateOfferStatus(c *gin.Context) {
	id := c.Param("id")
	var offer models.Offer
	var statusUpdate struct {
		Status string `json:"status" binding:"required"`
	}

	if err := database.DB.First(&offer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Offer not found"})
		return
	}

	// Only farmer who owns the product or admin can update status
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role != "admin" {
		var product models.Product
		if err := database.DB.First(&product, offer.ProductID).Error; err == nil {
			if product.UserID != userID.(uint) {
				c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this offer's status"})
				return
			}
		}
	}

	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		"PENDING":  true,
		"ACCEPTED": true,
		"REJECTED": true,
	}

	if !validStatuses[statusUpdate.Status] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid status. Must be PENDING, ACCEPTED, or REJECTED",
		})
		return
	}

	offer.Status = statusUpdate.Status
	if err := database.DB.Save(&offer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update offer status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Offer status updated successfully",
		"offer":   offer,
	})
}
