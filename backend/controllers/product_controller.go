package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"encoding/json"
	"fmt"
	"mime"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const (
	maxUploadSize = 2 * 1024 * 1024 // 2MB
	uploadsDir    = "uploads"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product data JSON: " + err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	product.UserID = userID.(uint)

	// Handle image upload
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	// Validate file type
	if err := validateImageFile(file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create uploads directory if not exists
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		if err := os.Mkdir(uploadsDir, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
			return
		}
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), strings.TrimSuffix(filepath.Base(file.Filename), ext), ext)
	savePath := filepath.Join(uploadsDir, filename)

	// Save file
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image: " + err.Error()})
		return
	}

	product.ImageURL = "/" + filepath.ToSlash(savePath)

	// Create product
	if err := database.DB.Create(&product).Error; err != nil {
		// Clean up uploaded file if database operation fails
		_ = os.Remove(savePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

// GetProductByID retrieves a product by its ID
func GetProductByID(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

// GetAllProducts retrieves all products
func GetAllProducts(c *gin.Context) {
	var products []models.Product

	if err := database.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// SearchProducts searches for products based on query parameters
func SearchProducts(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query parameter 'q' is required"})
		return
	}

	var products []models.Product
	searchQuery := "%" + strings.ToLower(query) + "%"

	if err := database.DB.Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", searchQuery, searchQuery).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search products: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// UpdateProduct updates an existing product with optional image update
func UpdateProduct(c *gin.Context) {
	productID := c.Param("id")
	var existingProduct models.Product

	// Find existing product
	if err := database.DB.First(&existingProduct, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	// Initialize product with existing values
	updatedProduct := existingProduct

	// Check if this is a multipart form (for image upload)
	if c.ContentType() == "multipart/form-data" {
		// Get JSON data from form field
		jsonData := c.PostForm("data")
		if jsonData == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing product data"})
			return
		}

		if err := json.Unmarshal([]byte(jsonData), &updatedProduct); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product data JSON: " + err.Error()})
			return
		}

		// Handle image upload if provided
		file, err := c.FormFile("image")
		if err == nil {
			// Validate new image
			if err := validateImageFile(file); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			// Save new image
			ext := filepath.Ext(file.Filename)
			filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), strings.TrimSuffix(filepath.Base(file.Filename), ext), ext)
			savePath := filepath.Join(uploadsDir, filename)

			if err := c.SaveUploadedFile(file, savePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image: " + err.Error()})
				return
			}

			// Delete old image if it exists
			if existingProduct.ImageURL != "" {
				oldPath := strings.TrimPrefix(existingProduct.ImageURL, "/")
				if err := os.Remove(oldPath); err != nil && !os.IsNotExist(err) {
					fmt.Printf("Failed to remove old image: %v\n", err)
				}
			}

			updatedProduct.ImageURL = "/" + filepath.ToSlash(savePath)
		}
	} else {
		// Regular JSON request
		if err := c.ShouldBindJSON(&updatedProduct); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
			return
		}
	}

	// Update product fields
	if err := database.DB.Model(&existingProduct).Updates(updatedProduct).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, existingProduct)
}

// PartialUpdateProduct handles partial updates to a product
func PartialUpdateProduct(c *gin.Context) {
	productID := c.Param("id")
	var existingProduct models.Product

	if err := database.DB.First(&existingProduct, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Handle image upload if provided
	file, err := c.FormFile("image")
	if err == nil {
		// Validate new image
		if err := validateImageFile(file); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save new image
		ext := filepath.Ext(file.Filename)
		filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), strings.TrimSuffix(filepath.Base(file.Filename), ext), ext)
		savePath := filepath.Join(uploadsDir, filename)

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image: " + err.Error()})
			return
		}

		// Delete old image if it exists
		if existingProduct.ImageURL != "" {
			oldPath := strings.TrimPrefix(existingProduct.ImageURL, "/")
			if err := os.Remove(oldPath); err != nil && !os.IsNotExist(err) {
				// Log but don't fail the operation
				fmt.Printf("Failed to remove old image: %v\n", err)
			}
		}

		updates["image_url"] = "/" + filepath.ToSlash(savePath)
	}

	if err := database.DB.Model(&existingProduct).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, existingProduct)
}

// DeleteProduct deletes a product by its ID
func DeleteProduct(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	// Delete associated image if it exists
	if product.ImageURL != "" {
		imagePath := strings.TrimPrefix(product.ImageURL, "/")
		if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
			// Log but don't fail the operation
			fmt.Printf("Failed to remove product image: %v\n", err)
		}
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product: " + err.Error()})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user's products: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GetUserProductByID retrieves a specific product for the authenticated user
func GetUserProductByID(c *gin.Context) {
	productID := c.Param("id")
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

	var product models.Product
	if err := database.DB.Where("id = ? AND user_id = ?", productID, userID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found or not owned by user"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// UpdateProductStatus updates the status of a product
func UpdateProductStatus(c *gin.Context) {
	productID := c.Param("id")
	var existingProduct models.Product

	if err := database.DB.First(&existingProduct, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	var statusUpdate struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status data: " + err.Error()})
		return
	}

	// Validate status value
	validStatuses := []string{"active", "inactive", "sold", "pending"}
	valid := false
	for _, s := range validStatuses {
		if statusUpdate.Status == s {
			valid = true
			break
		}
	}
	if !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	if err := database.DB.Model(&existingProduct).Update("status", statusUpdate.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product status: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, existingProduct)
}

// AdminGetAllProducts retrieves all products (admin only)
func AdminGetAllProducts(c *gin.Context) {
	var products []models.Product

	// Add pagination parameters
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "20")

	if err := database.DB.Scopes(Paginate(page, limit)).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// AdminDeleteProduct deletes a product (admin only)
func AdminDeleteProduct(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found: " + err.Error()})
		return
	}

	// Delete associated image if it exists
	if product.ImageURL != "" {
		imagePath := strings.TrimPrefix(product.ImageURL, "/")
		if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
			// Log but don't fail the operation
			fmt.Printf("Failed to remove product image: %v\n", err)
		}
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully by admin"})
}

// Paginate is a scope for pagination
func Paginate(page, limit string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		pageInt, _ := strconv.Atoi(page)
		if pageInt <= 0 {
			pageInt = 1
		}

		limitInt, _ := strconv.Atoi(limit)
		switch {
		case limitInt > 100:
			limitInt = 100
		case limitInt <= 0:
			limitInt = 20
		}

		offset := (pageInt - 1) * limitInt
		return db.Offset(offset).Limit(limitInt)
	}
}

// validateImageFile checks if the uploaded file is a valid image
func validateImageFile(file *multipart.FileHeader) error {
	// Check file size
	if file.Size > maxUploadSize {
		return fmt.Errorf("image too large. Maximum size is %dMB", maxUploadSize/(1024*1024))
	}

	// Check content type
	buffer := make([]byte, 512)
	f, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open image file")
	}
	defer f.Close()

	if _, err = f.Read(buffer); err != nil {
		return fmt.Errorf("failed to read image file")
	}

	contentType := http.DetectContentType(buffer)
	if _, err := mime.ExtensionsByType(contentType); err != nil {
		return fmt.Errorf("invalid image type")
	}

	// Check file extension
	ext := filepath.Ext(file.Filename)
	allowedExts := []string{".jpg", ".jpeg", ".png", ".gif"}
	valid := false
	for _, allowedExt := range allowedExts {
		if strings.EqualFold(ext, allowedExt) {
			valid = true
			break
		}
	}
	if !valid {
		return fmt.Errorf("invalid file extension. Allowed: %v", allowedExts)
	}

	return nil
}
