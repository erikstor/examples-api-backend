package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"size:50;not null" validate:"required,min=2,max=50"`
	Email     string         `json:"email" gorm:"size:255;uniqueIndex;not null" validate:"required,email"`
	Password  string         `json:"-" gorm:"size:255;not null" validate:"required,min=6"`
	Age       *int           `json:"age" validate:"omitempty,min=18,max=120"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// UserCreate represents the data needed to create a user
type UserCreate struct {
	Name     string `json:"name" binding:"required,min=2,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Age      *int   `json:"age" binding:"omitempty,min=18,max=120"`
}

// UserUpdate represents the data needed to update a user
type UserUpdate struct {
	Name     *string `json:"name" binding:"omitempty,min=2,max=50"`
	Email    *string `json:"email" binding:"omitempty,email"`
	Age      *int    `json:"age" binding:"omitempty,min=18,max=120"`
	IsActive *bool   `json:"is_active"`
}

// UserLogin represents login credentials
type UserLogin struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UserResponse represents the user data returned in responses
type UserResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Age       *int      `json:"age"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Age:       u.Age,
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

// PaginatedResponse represents a paginated response
type PaginatedResponse struct {
	Data       []UserResponse `json:"data"`
	Pagination Pagination     `json:"pagination"`
}

// Pagination represents pagination metadata
type Pagination struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Total int64 `json:"total"`
	Pages int   `json:"pages"`
} 