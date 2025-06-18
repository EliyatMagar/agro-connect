package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateProduct handles the creation of a new product with image upload
func CreateProduct(c *gin.Context) {
	// Get JSON data from "data" form field
	jsonData := c.PostForm("data")
	if jsonData == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing product data"})
		return
	}

	var product models.Product
	if err := json.Unmarshal([]byte(jsonData), &product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product data JSON"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	product.UserID = userID.(uint)

	// Upload image
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", os.ModePerm)
	}

	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	savePath := filepath.Join("uploads", filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	product.ImageURL = "/" + filepath.ToSlash(savePath)

	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

// GetProductByID retrieves a product by its ID
func GetProductByID(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// GetAllProducts retrieves all products
func GetAllProducts(c *gin.Context) {
	var products []models.Product

	if err := database.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

// UpdateProduct updates an existing product (optional: image support)
func UpdateProduct(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// DeleteProduct deletes a product by its ID
func DeleteProduct(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// GetProductsByUserID retrieves all products created by a specific user
func GetProductsByUserID(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Handle type assertion
	var userID uint
	switch v := userIDVal.(type) {
	case uint:
		userID = v
	case float64:
		userID = uint(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	var products []models.Product
	if err := database.DB.Where("user_id = ?", userID).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user's products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
