from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None

class UserCreate(UserBase):
    password: str
    
    @validator('name')
    def name_must_be_valid(cls, v):
        if len(v) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        if len(v) > 50:
            raise ValueError('El nombre no puede exceder 50 caracteres')
        return v
    
    @validator('password')
    def password_must_be_valid(cls, v):
        if len(v) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return v
    
    @validator('age')
    def age_must_be_valid(cls, v):
        if v is not None and (v < 18 or v > 120):
            raise ValueError('La edad debe estar entre 18 y 120 años')
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    is_active: Optional[bool] = None
    
    @validator('name')
    def name_must_be_valid(cls, v):
        if v is not None:
            if len(v) < 2:
                raise ValueError('El nombre debe tener al menos 2 caracteres')
            if len(v) > 50:
                raise ValueError('El nombre no puede exceder 50 caracteres')
        return v
    
    @validator('age')
    def age_must_be_valid(cls, v):
        if v is not None and (v < 18 or v > 120):
            raise ValueError('La edad debe estar entre 18 y 120 años')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 10

class PaginatedResponse(BaseModel):
    data: list[UserResponse]
    pagination: dict 