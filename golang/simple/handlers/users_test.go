package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"crud-example/config"
	"crud-example/models"
	"crud-example/utils"
)

func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}
	
	// Auto migrate
	db.AutoMigrate(&models.User{})
	
	return db
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	
	// Set test database
	testDB := setupTestDB()
	config.SetDB(testDB)
	
	// Setup routes
	api := r.Group("/api")
	users := api.Group("/users")
	users.Use(middleware.AuthMiddleware())
	{
		users.GET("/", GetUsers)
		users.GET("/:id", GetUser)
		users.POST("/", CreateUser)
		users.PUT("/:id", UpdateUser)
		users.DELETE("/:id", DeleteUser)
	}
	
	return r
}

func createTestUser() (models.User, string) {
	db := config.GetDB()
	
	// Create a test user
	hashedPassword, _ := utils.HashPassword("password123")
	user := models.User{
		Username: "testuser",
		Email:    "test@example.com",
		Password: hashedPassword,
	}
	
	db.Create(&user)
	
	// Generate JWT token
	token, _ := utils.GenerateJWT(user.ID)
	
	return user, token
}

func TestGetUsers(t *testing.T) {
	r := setupTestRouter()
	
	// Create test users
	_, token := createTestUser()
	
	req, _ := http.NewRequest("GET", "/api/users/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "users")
	assert.Contains(t, response, "total")
}

func TestGetUser(t *testing.T) {
	r := setupTestRouter()
	
	user, token := createTestUser()
	
	req, _ := http.NewRequest("GET", "/api/users/"+strconv.FormatUint(uint64(user.ID), 10), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "user")
}

func TestCreateUser(t *testing.T) {
	r := setupTestRouter()
	
	_, token := createTestUser()
	
	tests := []struct {
		name       string
		payload    map[string]interface{}
		wantStatus int
		wantError  bool
	}{
		{
			name: "Valid user creation",
			payload: map[string]interface{}{
				"username": "newuser",
				"email":    "newuser@example.com",
				"password": "password123",
			},
			wantStatus: http.StatusCreated,
			wantError:  false,
		},
		{
			name: "Invalid email",
			payload: map[string]interface{}{
				"username": "newuser",
				"email":    "invalid-email",
				"password": "password123",
			},
			wantStatus: http.StatusBadRequest,
			wantError:  true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("POST", "/api/users/", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)
			
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			
			assert.Equal(t, tt.wantStatus, w.Code)
			
			if !tt.wantError {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "user")
			}
		})
	}
}

func TestUpdateUser(t *testing.T) {
	r := setupTestRouter()
	
	user, token := createTestUser()
	
	tests := []struct {
		name       string
		payload    map[string]interface{}
		wantStatus int
		wantError  bool
	}{
		{
			name: "Valid user update",
			payload: map[string]interface{}{
				"username": "updateduser",
				"email":    "updated@example.com",
			},
			wantStatus: http.StatusOK,
			wantError:  false,
		},
		{
			name: "Invalid email",
			payload: map[string]interface{}{
				"email": "invalid-email",
			},
			wantStatus: http.StatusBadRequest,
			wantError:  true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("PUT", "/api/users/"+strconv.FormatUint(uint64(user.ID), 10), bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)
			
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			
			assert.Equal(t, tt.wantStatus, w.Code)
			
			if !tt.wantError {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "user")
			}
		})
	}
}

func TestDeleteUser(t *testing.T) {
	r := setupTestRouter()
	
	user, token := createTestUser()
	
	req, _ := http.NewRequest("DELETE", "/api/users/"+strconv.FormatUint(uint64(user.ID), 10), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	
	assert.Equal(t, http.StatusOK, w.Code)
	
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "message")
} 