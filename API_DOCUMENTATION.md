# Quick Touch Academy - API Documentation

## 🔐 Authentication

All API endpoints (except registration and login) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### 1. User Management

#### POST `/api/users`
Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "player",
  "phone": "+1234567890",
  "academyId": "academy-uuid"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "player",
    "phone": "+1234567890",
    "academyId": "academy-uuid",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/users`
Fetch all users (Admin/Coach only).

**Query Parameters:**
- `academyId` (optional): Filter by academy
- `role` (optional): Filter by role

### 2. Authentication

#### POST `/api/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "player"
  },
  "expiresIn": 3600
}
```

### 3. Player Management

#### POST `/api/players_management`
Create a new player (Coach/Admin only).

**Request Body:**
```json
{
  "fullName": "Player Name",
  "age": 18,
  "height": 1.75,
  "position": "Forward",
  "academyId": "academy-uuid",
  "highlightReels": ["url1", "url2"]
}
```

#### GET `/api/players_management`
Fetch all players.

**Query Parameters:**
- `academyId` (optional): Filter by academy
- `position` (optional): Filter by position
- `ageMin` (optional): Minimum age
- `ageMax` (optional): Maximum age

### 4. Messaging System

#### GET `/api/messaging/conversations`
Get all conversations for the authenticated user.

**Response:**
```json
{
  "conversations": [
    {
      "id": "conversation-uuid",
      "participant1": {
        "id": "user-uuid",
        "fullName": "John Doe",
        "role": "player",
        "profilePhoto": "photo-url"
      },
      "participant2": {
        "id": "user-uuid",
        "fullName": "Coach Smith",
        "role": "coach",
        "profilePhoto": "photo-url"
      },
      "messages": [
        {
          "id": "message-uuid",
          "content": "Hello!",
          "sender": {
            "id": "user-uuid",
            "fullName": "John Doe",
            "profilePhoto": "photo-url"
          },
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "lastMessageAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/messaging/conversations`
Create a new conversation.

**Request Body:**
```json
{
  "participantId": "user-uuid"
}
```

#### GET `/api/messaging/conversations/[id]/messages`
Get messages for a specific conversation.

#### POST `/api/messaging/conversations/[id]/messages`
Send a message in a conversation.

**Request Body:**
```json
{
  "content": "Hello!",
  "messageType": "text",
  "mediaUrl": "optional-media-url"
}
```

#### GET `/api/messaging/users`
Get users that can be messaged based on role permissions.

**Query Parameters:**
- `role` (optional): Filter by role
- `search` (optional): Search by name

### 5. Player Comparison

#### GET `/api/player-comparison`
Get all comparisons made by the authenticated scout (Scouts only).

#### POST `/api/player-comparison`
Create a new player comparison (Scouts only).

**Request Body:**
```json
{
  "player1Id": "player-uuid",
  "player2Id": "player-uuid",
  "notes": "Optional comparison notes"
}
```

#### GET `/api/player-comparison/[id]`
Get specific comparison details.

#### PUT `/api/player-comparison/[id]`
Update comparison notes.

#### DELETE `/api/player-comparison/[id]`
Delete a comparison.

### 6. AI Insights

#### GET `/api/ai-insights`
Get AI insights for a player.

**Query Parameters:**
- `playerId` (required): Player ID
- `type` (optional): Insight type filter

#### POST `/api/ai-insights`
Create new AI insight (Coach/Admin only).

**Request Body:**
```json
{
  "playerId": "player-uuid",
  "type": "performance_prediction",
  "data": {
    "description": "AI-generated insight",
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "confidence": 0.85
}
```

#### GET `/api/ai-insights/video-analysis`
Get video analyses for a player.

**Query Parameters:**
- `playerId` (required): Player ID

#### POST `/api/ai-insights/video-analysis`
Upload video for AI analysis (Coach/Admin only).

**Request Body:**
```json
{
  "playerId": "player-uuid",
  "videoUrl": "video-url"
}
```

### 7. Advanced Statistics

#### GET `/api/advanced-stats`
Get advanced stats for a player.

**Query Parameters:**
- `playerId` (required): Player ID
- `matchId` (optional): Filter by match

#### POST `/api/advanced-stats`
Create new advanced stats entry (Coach/Admin only).

**Request Body:**
```json
{
  "playerId": "player-uuid",
  "matchId": "match-uuid",
  "passAccuracy": 85.5,
  "distanceCovered": 8500,
  "sprintCount": 12,
  "heatmapData": {}
}
```

## 🔒 Role-Based Access Control

### Messaging Permissions
- **Players** can message: Coaches, Parents, Admins
- **Parents** can message: Coaches, Admins, Players
- **Coaches** can message: Players, Parents, Admins, Scouts
- **Scouts** can message: Admins, Coaches
- **Admins** can message: All roles

### Feature Access
- **Player Comparison**: Scouts only
- **AI Insights**: All roles (with appropriate data filtering)
- **Advanced Stats**: All roles (with appropriate data filtering)
- **Video Analysis Upload**: Coaches and Admins only
- **User Management**: Admins and Coaches only
- **Player Management**: Coaches and Admins only

## 📊 Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

Use the provided `test-apis.js` script to test all endpoints:

```bash
node test-apis.js
```

Or test individual endpoints using tools like Postman, curl, or your frontend application.

## 📝 Notes

- All timestamps are in ISO 8601 format
- All UUIDs are generated automatically
- Passwords are hashed using bcrypt
- JWT tokens expire after 1 hour
- Email verification is required for login
- All API responses include proper error handling




