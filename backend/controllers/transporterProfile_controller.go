package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateTransporterProfile creates a new transporter profile

func CreateTransporterProfile(c *gin.Context) {
	var input models.TransporterProfile

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the input
	if input.UserID == 0 || input.VehicleType == "" || input.LicenseNo == "" || input.Capacity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	var existingProfile models.TransporterProfile
	if err := database.DB.Where("user_id = ?", input.UserID).First(&existingProfile).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Transporter profile already exists for this user"})
		return
	}

	// Create the transporter profile

	if err := database.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transporter profile"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Transporter profile created successfully", "profile": input})
}

//GetTransporterProfile retrieves a transporter profile by user ID

func GetTransporterProfileID(c *gin.Context) {
	userID := c.Param("user_id")

	var profile models.TransporterProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transporter profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": profile})
}

// UpdateTransporterProfile updates an existing transporter profile

func UpdateTransporterProfile(c *gin.Context) {
	var input models.TransporterProfile
	userID := c.Param("user_id")

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the input
	if input.VehicleType == "" || input.LicenseNo == "" || input.Capacity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	var profile models.TransporterProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transporter profile not found"})
		return
	}

	profile.VehicleType = input.VehicleType
	profile.LicenseNo = input.LicenseNo
	profile.Capacity = input.Capacity

	if err := database.DB.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update transporter profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transporter profile updated successfully", "profile": profile})
}

// DeleteTransporterProfile deletes a transporter profile by user ID

func DeleteTransporterProfile(c *gin.Context) {
	userID := c.Param("user_id")

	var profile models.TransporterProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transporter profile not found"})
		return
	}

	if err := database.DB.Delete(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete transporter profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transporter profile deleted successfully"})
}

// GetAllTransporterProfiles retrieves all transporter profiles

func GetAllTransporterProfiles(c *gin.Context) {
	var profiles []models.TransporterProfile
	if err := database.DB.Find(&profiles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transporter profiles"})
		return
	}

	if len(profiles) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No transporter profiles found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profiles": profiles})
}
