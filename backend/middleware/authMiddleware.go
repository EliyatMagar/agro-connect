package middleware

import (
	"agro-connect/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header must start with 'Bearer '"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ValidateJWT(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token", "details": err.Error()})
			c.Abort()
			return
		}

		// Set claims in context using consistent naming
		c.Set("userID", claims.UserID) // Changed to userID (camelCase)
		c.Set("role", claims.Role)
		c.Set("claims", claims)

		c.Next()
	}
}

// Role-checking middlewares
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

func TransporterOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "transporter" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied. Transporters only."})
			c.Abort()
			return
		}
		c.Next()
	}
}

// In middleware package
func RolesAllowed(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Role information missing"})
			c.Abort()
			return
		}

		for _, allowedRole := range roles {
			if userRole == allowedRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		c.Abort()
	}
}
