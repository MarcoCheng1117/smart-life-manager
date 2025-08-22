# Authentication API Documentation 🔐

This document describes the authentication endpoints and how to use them in the Smart Life Manager application.

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user sessions. All protected routes require a valid JWT token in the Authorization header.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication Flow

1. **Register** - Create a new user account
2. **Login** - Authenticate and receive JWT token
3. **Use Token** - Include token in subsequent requests
4. **Refresh** - Optionally refresh expired tokens

## Endpoints

### 1. User Registration

**POST** `/api/auth/register`

Creates a new user account.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "preferences": {
    "language": "en",
    "theme": "light",
    "currency": "USD",
    "timezone": "America/New_York"
  }
}
```

#### Required Fields
- `email` - Valid email address (unique)
- `password` - Minimum 8 characters
- `firstName` - User's first name
- `lastName` - User's last name

#### Optional Fields
- `preferences` - User preferences object
- `phone` - Phone number
- `dateOfBirth` - Date of birth (ISO format)
- `location` - Location information

#### Response (Success - 201)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "preferences": {
        "language": "en",
        "theme": "light",
        "currency": "USD",
        "timezone": "America/New_York"
      },
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email is already registered"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

#### Common Error Codes
- `400` - Validation error or email already exists
- `500` - Server error

---

### 2. User Login

**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Required Fields
- `email` - User's email address
- `password` - User's password

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "preferences": {
        "language": "en",
        "theme": "light",
        "currency": "USD",
        "timezone": "America/New_York"
      },
      "lastLogin": "2023-09-06T10:30:00.000Z",
      "loginCount": 15
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### Common Error Codes
- `400` - Missing email or password
- `401` - Invalid credentials
- `404` - User not found
- `500` - Server error

---

### 3. Get Current User

**GET** `/api/auth/me`

Retrieves the current authenticated user's profile.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "displayName": "John D.",
      "preferences": {
        "language": "en",
        "theme": "light",
        "currency": "USD",
        "timezone": "America/New_York",
        "notifications": {
          "email": true,
          "push": false,
          "sms": false
        },
        "privacy": {
          "profileVisibility": "public",
          "dataSharing": false
        }
      },
      "profile": {
        "avatar": "https://example.com/avatars/john.jpg",
        "bio": "Passionate about productivity and personal development",
        "location": {
          "city": "New York",
          "country": "USA",
          "timezone": "America/New_York"
        }
      },
      "statistics": {
        "loginCount": 15,
        "lastLogin": "2023-09-06T10:30:00.000Z",
        "accountAge": 45,
        "tasksCompleted": 127,
        "goalsAchieved": 8
      },
      "createdAt": "2023-07-25T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "error": "Not authorized, token failed"
}
```

#### Common Error Codes
- `401` - Invalid or expired token
- `500` - Server error

---

### 4. Update User Profile

**PUT** `/api/auth/profile`

Updates the current user's profile information.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Request Body
```json
{
  "firstName": "Johnny",
  "lastName": "Smith",
  "preferences": {
    "theme": "dark",
    "language": "zh-Hant"
  },
  "profile": {
    "bio": "Updated bio information",
    "location": {
      "city": "San Francisco",
      "country": "USA"
    }
  }
}
```

#### Updateable Fields
- `firstName`, `lastName` - Basic information
- `preferences` - User preferences (partial updates supported)
- `profile` - Profile details (partial updates supported)
- `phone` - Phone number
- `dateOfBirth` - Date of birth

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "Johnny",
      "lastName": "Smith",
      "fullName": "Johnny Smith",
      "preferences": {
        "language": "zh-Hant",
        "theme": "dark",
        "currency": "USD",
        "timezone": "America/New_York"
      },
      "profile": {
        "bio": "Updated bio information",
        "location": {
          "city": "San Francisco",
          "country": "USA"
        }
      },
      "updatedAt": "2023-09-06T11:00:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "firstName",
      "message": "First name must be at least 2 characters long"
    }
  ]
}
```

#### Common Error Codes
- `400` - Validation error
- `401` - Invalid or expired token
- `500` - Server error

---

### 5. Change Password

**PUT** `/api/auth/password`

Changes the user's password.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Request Body
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

#### Required Fields
- `currentPassword` - Current password for verification
- `newPassword` - New password (minimum 8 characters)

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```

#### Common Error Codes
- `400` - Current password incorrect or validation error
- `401` - Invalid or expired token
- `500` - Server error

---

### 6. User Logout

**POST** `/api/auth/logout`

Logs out the current user (client-side token removal).

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note**: This endpoint is primarily for logging purposes. The actual logout happens on the client side by removing the JWT token from storage.

---

### 7. Refresh Token (Optional)

**POST** `/api/auth/refresh`

Refreshes an expired JWT token.

#### Headers
```
Authorization: Bearer <EXPIRED_JWT_TOKEN>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Token refreshed successfully"
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "error": "Token cannot be refreshed"
}
```

---

### 8. Forgot Password

**POST** `/api/auth/forgot-password`

Sends a password reset email to the user.

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Required Fields
- `email` - User's email address

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Note**: For security reasons, this endpoint always returns success even if the email doesn't exist.

---

### 9. Reset Password

**POST** `/api/auth/reset-password`

Resets the user's password using a reset token.

#### Request Body
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword789"
}
```

#### Required Fields
- `token` - Reset token from email
- `newPassword` - New password (minimum 8 characters)

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

---

## Authentication Headers

### Protected Routes
All protected routes require the JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Example Usage
```javascript
// Frontend API call example
const response = await fetch('/api/tasks', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Error Handling

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ],
  "timestamp": "2023-09-06T10:30:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Features

### JWT Token Security
- **Expiration**: Tokens expire after 24 hours
- **Refresh**: Optional token refresh mechanism
- **Secure**: Uses strong encryption algorithms
- **Stateless**: No server-side session storage

### Password Security
- **Hashing**: Passwords are hashed using bcrypt
- **Salt**: Unique salt for each password
- **Strength**: Minimum 8 characters required
- **Validation**: Password strength validation

### Rate Limiting
- **Login attempts**: Limited to prevent brute force
- **API calls**: Rate limiting on all endpoints
- **IP blocking**: Temporary blocking for suspicious activity

---

## Testing

### Test Credentials
```json
{
  "email": "test@example.com",
  "password": "testPassword123"
}
```

### Postman Collection
Import the provided Postman collection for testing all endpoints.

### cURL Examples
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Best Practices

### Frontend Implementation
1. **Token Storage**: Store JWT in localStorage or httpOnly cookies
2. **Auto-refresh**: Implement automatic token refresh
3. **Error Handling**: Handle 401 errors gracefully
4. **Logout**: Clear token on logout and redirect

### Backend Implementation
1. **Validation**: Validate all input data
2. **Error Messages**: Provide clear, helpful error messages
3. **Logging**: Log authentication events for security
4. **Rate Limiting**: Implement rate limiting on auth endpoints

### Security Considerations
1. **HTTPS**: Always use HTTPS in production
2. **Token Expiry**: Set reasonable token expiration times
3. **Password Policy**: Enforce strong password requirements
4. **Audit Logs**: Log all authentication attempts

---

## Troubleshooting

### Common Issues

#### 1. "Not authorized, token failed"
- Check if token is expired
- Verify token format in Authorization header
- Ensure token is being sent correctly

#### 2. "Email already exists"
- Use a different email address
- Check if user needs to verify email
- Consider password reset if account exists

#### 3. "Invalid credentials"
- Verify email and password
- Check for typos
- Ensure account is not locked

#### 4. CORS Issues
- Verify backend CORS configuration
- Check if frontend URL is allowed
- Ensure proper headers are sent

### Debug Steps
1. **Check Network Tab**: Verify request/response in browser
2. **Console Logs**: Look for error messages
3. **Token Validation**: Verify JWT token format
4. **Backend Logs**: Check server console for errors

---

## Support

If you encounter issues with authentication:

1. **Check Documentation**: Review this guide thoroughly
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Create Issue**: Provide detailed error information
4. **Community Help**: Ask in GitHub discussions

---

**Next**: [Tasks API Documentation](./tasks.md) | [Back to API Overview](../README.md) 