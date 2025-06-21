package controllers

import (
	"agro-connect/database"
	"agro-connect/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllOrders returns all orders with optional filtering
func GetAllOrders(c *gin.Context) {
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var orders []models.Order
	query := database.DB.Model(&models.Order{})

	// Non-admins only see their own orders
	if role != "admin" {
		query = query.Where("buyer_id = ? OR farmer_id = ?", userID, userID)
	}

	// Apply filters
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	if productID := c.Query("product_id"); productID != "" {
		query = query.Where("product_id = ?", productID)
	}

	if err := query.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve orders",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"total": len(orders),
		},
	})
}

// CreateOrder handles order creation
func CreateOrder(c *gin.Context) {
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	// Validate based on role
	if role == "buyer" {
		order.BuyerID = userID.(uint)
	} else if role == "farmer" {
		order.FarmerID = userID.(uint)
	} else {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Only buyers or farmers can create orders",
		})
		return
	}

	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetOrder retrieves a single order
func GetOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Order not found",
		})
		return
	}

	// Authorization check
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role != "admin" && order.BuyerID != userID.(uint) && order.FarmerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to view this order",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    order,
	})
}

// UpdateOrder handles order updates
func UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Order not found",
		})
		return
	}

	// Authorization check
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role != "admin" && order.BuyerID != userID.(uint) && order.FarmerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to update this order",
		})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	if err := database.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Order updated successfully",
		"data":    order,
	})
}

// UpdateOrderStatus updates only the order status
func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	var order models.Order
	var statusUpdate struct {
		Status string `json:"status" binding:"required,oneof=processing completed canceled"`
	}

	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Order not found",
		})
		return
	}

	// Authorization check
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role != "admin" && order.BuyerID != userID.(uint) && order.FarmerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to update this order's status",
		})
		return
	}

	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid status update",
			"details": err.Error(),
		})
		return
	}

	order.Status = statusUpdate.Status
	if err := database.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update order status",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Order status updated successfully",
		"data":    order,
	})
}

// DeleteOrder handles order deletion
func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Order not found",
		})
		return
	}

	// Authorization check
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	if role != "admin" && order.BuyerID != userID.(uint) && order.FarmerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to delete this order",
		})
		return
	}

	if err := database.DB.Delete(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Order deleted successfully",
	})
}

// GetOrdersByBuyer returns orders for a specific buyer
func GetOrdersByBuyer(c *gin.Context) {
	buyerID := c.Param("buyer_id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	// Authorization check
	if role != "admin" && buyerID != strconv.Itoa(int(userID.(uint))) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to view these orders",
		})
		return
	}

	var orders []models.Order
	query := database.DB.Where("buyer_id = ?", buyerID)

	// Apply filters
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to retrieve orders",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"total": len(orders),
		},
	})
}

// GetOrdersByFarmer returns orders for a specific farmer
func GetOrdersByFarmer(c *gin.Context) {
	farmerID := c.Param("farmer_id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	// Authorization check
	if role != "admin" && farmerID != strconv.Itoa(int(userID.(uint))) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"error":   "Not authorized to view these orders",
		})
		return
	}

	var orders []models.Order
	query := database.DB.Where("farmer_id = ?", farmerID)

	// Apply filters
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to retrieve orders",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"total": len(orders),
		},
	})
}
