package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"crud-example/config"
	"crud-example/models"
	"crud-example/utils"
)

// GetUsers handles getting all users with pagination
func GetUsers(c *gin.Context) {
	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Get total count
	var total int64
	if err := config.DB.Model(&models.User{}).Where("is_active = ?", true).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users count"})
		return
	}

	// Get users
	var users []models.User
	if err := config.DB.Where("is_active = ?", true).Offset(offset).Limit(limit).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}

	// Convert to response format
	var userResponses []models.UserResponse
	for _, user := range users {
		userResponses = append(userResponses, user.ToResponse())
	}

	// Calculate pages
	pages := int((total + int64(limit) - 1) / int64(limit))

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Data: userResponses,
		Pagination: models.Pagination{
			Page:  page,
			Limit: limit,
			Total: total,
			Pages: pages,
		},
	})
}

// GetUser handles getting a user by ID
func GetUser(c *gin.Context) {
	// Get user ID from URL parameter
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get user from database
	var user models.User
	if err := config.DB.Where("id = ? AND is_active = ?", id, true).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

// CreateUser handles creating a new user
func CreateUser(c *gin.Context) {
	var userCreate models.UserCreate

	// Bind JSON to struct
	if err := c.ShouldBindJSON(&userCreate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := config.DB.Where("email = ?", userCreate.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(userCreate.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	user := models.User{
		Name:     userCreate.Name,
		Email:    userCreate.Email,
		Password: hashedPassword,
		Age:      userCreate.Age,
		IsActive: true,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    user.ToResponse(),
	})
}

// UpdateUser handles updating a user
func UpdateUser(c *gin.Context) {
	// Get user ID from URL parameter
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var userUpdate models.UserUpdate

	// Bind JSON to struct
	if err := c.ShouldBindJSON(&userUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Get user from database
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check if email already exists (if updating email)
	if userUpdate.Email != nil && *userUpdate.Email != user.Email {
		var existingUser models.User
		if err := config.DB.Where("email = ? AND id != ?", *userUpdate.Email, id).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
			return
		}
	}

	// Update user fields
	if userUpdate.Name != nil {
		user.Name = *userUpdate.Name
	}
	if userUpdate.Email != nil {
		user.Email = *userUpdate.Email
	}
	if userUpdate.Age != nil {
		user.Age = userUpdate.Age
	}
	if userUpdate.IsActive != nil {
		user.IsActive = *userUpdate.IsActive
	}

	// Save changes
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"user":    user.ToResponse(),
	})
}

// DeleteUser handles soft deleting a user
func DeleteUser(c *gin.Context) {
	// Get user ID from URL parameter
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get user from database
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Soft delete (set is_active to false)
	user.IsActive = false
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
		"user":    user.ToResponse(),
	})
} 