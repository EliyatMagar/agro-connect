package middleware

import (
	"agro-connect/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware verifies JWT and sets claims in context
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ValidateJWT(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set claims in context for downstream access
		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)

		c.Next()
	}
}

// AdminOnly middleware
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied. Admins only."})
			c.Abort()
			return
		}
		c.Next()
	}
}

// FarmerOnly middleware
func FarmerOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "farmer" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied. Farmers only."})
			c.Abort()
			return
		}
		c.Next()
	}
}

// BuyerOnly middleware
func BuyerOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "buyer" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied. Buyers only."})
			c.Abort()
			return
		}
		c.Next()
	}
}

// TransporterOnly middleware
func TransporterOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "transporter" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied. Transporter only."})
			c.Abort()
			return
		}
		c.Next()
	}
}
