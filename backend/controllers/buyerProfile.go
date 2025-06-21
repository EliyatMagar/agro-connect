package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateBuyerProfile creates a new buyer profile
func CreateBuyerProfile(c *gin.Context) {
	var input models.BuyerProfile

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if input.UserID == 0 || input.BusinessName == "" || input.ContactPhone == "" || input.District == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Check if PAN number is unique if provided
	if input.PANNumber != "" {
		var panCheck models.BuyerProfile
		if err := database.DB.Where("pan_number = ?", input.PANNumber).First(&panCheck).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "PAN number already in use"})
			return
		}
	}

	// Check if user already has a profile
	var existingProfile models.BuyerProfile
	if err := database.DB.Where("user_id = ?", input.UserID).First(&existingProfile).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Buyer profile already exists for this user"})
		return
	}

	// Create the new buyer profile
	if err := database.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create buyer profile", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Buyer profile created successfully",
		"profile": input,
	})
}

// GetAllBuyerProfiles retrieves all buyer profiles with pagination
func GetAllBuyerProfiles(c *gin.Context) {
	var profiles []models.BuyerProfile

	// Add pagination
	page, pageSize := getPaginationParams(c)

	query := database.DB.Model(&models.BuyerProfile{})

	// Add filtering if needed
	if businessType := c.Query("business_type"); businessType != "" {
		query = query.Where("business_type = ?", businessType)
	}
	if verified := c.Query("verified"); verified != "" {
		query = query.Where("verified = ?", verified == "true")
	}

	// Execute query with pagination
	if err := query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&profiles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve buyer profiles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"profiles": profiles,
		"page":     page,
		"pageSize": pageSize,
	})
}

// GetBuyerProfileByID retrieves a buyer profile by user ID
func GetBuyerProfileByID(c *gin.Context) {
	userID := c.Param("user_id")

	// For "/me" route, use authenticated user's ID
	if c.FullPath() == "/buyer-profile/me" {
		authUserID, exists := c.Get("userID") // Changed to match middleware
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			return
		}

		// Proper type assertion
		userIDUint, ok := authUserID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
			return
		}
		userID = strconv.FormatUint(uint64(userIDUint), 10)
	}

	var profile models.BuyerProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Buyer profile not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve buyer profile"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": profile})
}

// UpdateBuyerProfile updates a buyer profile
func UpdateBuyerProfile(c *gin.Context) {
	userID := c.Param("user_id")

	// For "/me" route, use authenticated user's ID
	if c.FullPath() == "/buyer-profile/me" {
		authUserID, exists := c.Get("userID") // Changed to match middleware
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			return
		}

		// Proper type assertion
		userIDUint, ok := authUserID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
			return
		}
		userID = strconv.FormatUint(uint64(userIDUint), 10)
	}

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

	// Check if PAN number is being updated to an existing one
	if input.PANNumber != "" && input.PANNumber != profile.PANNumber {
		var panCheck models.BuyerProfile
		if err := database.DB.Where("pan_number = ?", input.PANNumber).Not("id = ?", profile.ID).First(&panCheck).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "PAN number already in use"})
			return
		}
	}

	// Update fields
	if input.BusinessName != "" {
		profile.BusinessName = input.BusinessName
	}
	if input.BusinessType != "" {
		profile.BusinessType = input.BusinessType
	}
	if input.PANNumber != "" {
		profile.PANNumber = input.PANNumber
	}
	if input.VATNumber != "" {
		profile.VATNumber = input.VATNumber
	}
	if input.BusinessRegNo != "" {
		profile.BusinessRegNo = input.BusinessRegNo
	}
	if input.ContactPerson != "" {
		profile.ContactPerson = input.ContactPerson
	}
	if input.ContactPhone != "" {
		profile.ContactPhone = input.ContactPhone
	}
	if input.BusinessAddress != "" {
		profile.BusinessAddress = input.BusinessAddress
	}
	if input.District != "" {
		profile.District = input.District
	}
	if input.Municipality != "" {
		profile.Municipality = input.Municipality
	}
	if input.WardNumber != 0 {
		profile.WardNumber = input.WardNumber
	}
	if input.BuyerCategory != "" {
		profile.BuyerCategory = input.BuyerCategory
	}
	if input.ProfilePhoto != "" {
		profile.ProfilePhoto = input.ProfilePhoto
	}

	if err := database.DB.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update buyer profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Buyer profile updated successfully",
		"profile": profile,
	})
}

// DeleteBuyerProfile deletes a buyer profile
func DeleteBuyerProfile(c *gin.Context) {
	userID := c.Param("user_id")

	if err := database.DB.Where("user_id = ?", userID).Delete(&models.BuyerProfile{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete buyer profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Buyer profile deleted successfully"})
}

// VerifyBuyerProfile marks a buyer profile as verified
func VerifyBuyerProfile(c *gin.Context) {
	userID := c.Param("user_id")

	var profile models.BuyerProfile
	if err := database.DB.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Buyer profile not found"})
		return
	}

	profile.Verified = true
	if err := database.DB.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify buyer profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Buyer profile verified successfully",
		"profile": profile,
	})
}

// Helper function for pagination
func getPaginationParams(c *gin.Context) (page, pageSize int) {
	page = 1
	if p := c.Query("page"); p != "" {
		if pInt, err := strconv.Atoi(p); err == nil && pInt > 0 {
			page = pInt
		}
	}

	pageSize = 10
	if ps := c.Query("pageSize"); ps != "" {
		if psInt, err := strconv.Atoi(ps); err == nil && psInt > 0 {
			if psInt > 100 {
				psInt = 100
			}
			pageSize = psInt
		}
	}

	return page, pageSize
}
