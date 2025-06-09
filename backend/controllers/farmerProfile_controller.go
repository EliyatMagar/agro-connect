package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateFarmerProfile(c *gin.Context) {
	var profile models.FarmerProfile

	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&profile).Error; err != nil {
		fmt.Println("DB Error:", err) // print actual DB error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create profile", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Profile created successfully", "profile": profile})
}

func GetFarmerProfile(c *gin.Context) {
	var profile []models.FarmerProfile

	if err := database.DB.Find(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profiles"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"profiles": profile})
}

func GetFarmerProfileByID(c *gin.Context) {
	id := c.Param("id")
	var profile models.FarmerProfile

	if err := database.DB.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": profile})
}

func UpdateFarmerProfile(c *gin.Context) {
	id := c.Param("id")
	var profile models.FarmerProfile

	if err := database.DB.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
		return
	}

	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "profile": profile})
}

func DeleteFarmerProfile(c *gin.Context) {
	id := c.Param("id")
	var profile models.FarmerProfile

	if err := database.DB.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
		return
	}

	if err := database.DB.Delete(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile deleted successfully"})
}
