package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

//CreateBuyerProfile creates a new buyer profile

func CreateBuyerProfile(c *gin.Context) {
	var input models.BuyerProfile

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the user already has a buyer profile
	var existingProfile models.BuyerProfile
	if err := database.DB.Where("user_id = ?", input.UserID).First(&existingProfile).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Buyer profile already exists for this user"})
		return
	}
	// Create the new buyer profile
	if err := database.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create buyer profile"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Buyer profile created successfully", "profile": input})
}

//get all buyer profiles

func GetAllBuyerProfiles(c *gin.Context) {
	var profiles []models.BuyerProfile

	if err := database.DB.Find(&profiles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve buyer profiles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profiles": profiles})
}

//GetBuyerProfile retrieves a buyer profile by user ID

func GetBuyerProfileByID(c *gin.Context) {
	userID := c.Param("user_id")
	var profile models.BuyerProfile

	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Buyer profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": profile})
}

// UPDATE BUYER PROFILE
func UpdateBuyerProfile(c *gin.Context) {
	userID := c.Param("user_id")
	var input models.BuyerProfile

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var profile models.BuyerProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Buyer profile not found"})
		return
	}

	// Update the profile with the new data
	profile.BusinessName = input.BusinessName
	profile.PANNumber = input.PANNumber

	if err := database.DB.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update buyer profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Buyer profile updated successfully", "profile": profile})
}
