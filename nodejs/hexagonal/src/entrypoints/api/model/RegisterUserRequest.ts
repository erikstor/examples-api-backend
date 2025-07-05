export interface RegisterUserRequest {
  name: string;
  email: string;
}

export interface RegisterUserResponse {
  message: string;
  data: {
    userId: string;
    name: string;
    email: string;
    timestamp: string;
  };
} 
