# Reale Messenger API Examples

This document provides examples of API requests and responses for the Reale Messenger application.

## 🔐 Authentication API

### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Successful Response:**
```json
{
  "user": {
    "id": "user123",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**
```json
{
  "error": "Username or email already exists"
}
```

### Login User

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Successful Response:**
```json
{
  "user": {
    "id": "user123",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### Get Current User

**Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response:**
```json
{
  "id": "user123",
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe",
  "bio": "Software Developer",
  "createdAt": "2023-05-15T10:00:00.000Z"
}
```

### Refresh Token

**Request:**
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Successful Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 💬 Chat API

### Create Private Chat

**Request:**
```http
POST /api/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "user456",
  "isGroup": false
}
```

**Successful Response:**
```json
{
  "id": "chat123",
  "isGroup": false,
  "members": [
    {
      "userId": "user123",
      "role": "MEMBER"
    },
    {
      "userId": "user456",
      "role": "MEMBER"
    }
  ]
}
```

### Create Group Chat

**Request:**
```http
POST /api/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Project Team",
  "isGroup": true,
  "memberIds": ["user456", "user789"]
}
```

**Successful Response:**
```json
{
  "id": "chat456",
  "name": "Project Team",
  "isGroup": true,
  "creatorId": "user123",
  "members": [
    {
      "userId": "user123",
      "role": "ADMIN"
    },
    {
      "userId": "user456",
      "role": "MEMBER"
    },
    {
      "userId": "user789",
      "role": "MEMBER"
    }
  ]
}
```

### Get User Chats

**Request:**
```http
GET /api/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response:**
```json
[
  {
    "id": "chat123",
    "name": "John Doe",
    "isGroup": false,
    "members": [
      {
        "user": {
          "id": "user123",
          "username": "john_doe",
          "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
        },
        "role": "MEMBER"
      }
    ],
    "messages": [
      {
        "id": "msg123",
        "content": "Hey there!",
        "senderId": "user456",
        "createdAt": "2023-05-15T10:30:00.000Z"
      }
    ]
  },
  {
    "id": "chat456",
    "name": "Project Team",
    "isGroup": true,
    "members": [
      {
        "user": {
          "id": "user456",
          "username": "jane_smith",
          "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=jane_smith"
        },
        "role": "MEMBER"
      }
    ],
    "messages": [
      {
        "id": "msg456",
        "content": "Meeting at 3 PM",
        "senderId": "user456",
        "createdAt": "2023-05-14T15:00:00.000Z"
      }
    ]
  }
]
```

### Send Message

**Request:**
```http
POST /api/chat/chat123/messages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "Hello there!",
  "replyToId": null,
  "fileUrl": null
}
```

**Successful Response:**
```json
{
  "id": "msg789",
  "content": "Hello there!",
  "senderId": "user123",
  "chatId": "chat123",
  "createdAt": "2023-05-15T10:45:00.000Z",
  "edited": false,
  "deleted": false,
  "replyTo": null,
  "reactions": [],
  "fileUrl": null,
  "sender": {
    "id": "user123",
    "username": "john_doe",
    "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
  }
}
```

### Get Messages

**Request:**
```http
GET /api/chat/chat123/messages?limit=50
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response:**
```json
[
  {
    "id": "msg123",
    "content": "Hey there!",
    "senderId": "user456",
    "chatId": "chat123",
    "createdAt": "2023-05-15T10:30:00.000Z",
    "edited": false,
    "deleted": false,
    "replyTo": null,
    "reactions": [],
    "fileUrl": null,
    "sender": {
      "id": "user456",
      "username": "jane_smith",
      "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=jane_smith"
    }
  },
  {
    "id": "msg789",
    "content": "Hello there!",
    "senderId": "user123",
    "chatId": "chat123",
    "createdAt": "2023-05-15T10:45:00.000Z",
    "edited": false,
    "deleted": false,
    "replyTo": null,
    "reactions": [],
    "fileUrl": null,
    "sender": {
      "id": "user123",
      "username": "john_doe",
      "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
    }
  }
]
```

### Edit Message

**Request:**
```http
PUT /api/chat/chat123/messages/msg789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "Hello there! How are you?"
}
```

**Successful Response:**
```json
{
  "id": "msg789",
  "content": "Hello there! How are you?",
  "senderId": "user123",
  "chatId": "chat123",
  "createdAt": "2023-05-15T10:45:00.000Z",
  "edited": true,
  "deleted": false,
  "replyTo": null,
  "reactions": [],
  "fileUrl": null,
  "sender": {
    "id": "user123",
    "username": "john_doe",
    "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
  }
}
```

### Add Reaction

**Request:**
```http
POST /api/chat/chat123/messages/msg789/reactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "emoji": "👍"
}
```

**Successful Response:**
```json
{
  "id": "reaction123",
  "emoji": "👍",
  "userId": "user123",
  "messageId": "msg789",
  "user": {
    "id": "user123",
    "username": "john_doe"
  }
}
```

## 🖥️ Server API

### Create Server

**Request:**
```http
POST /api/server
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "My Server",
  "description": "A cool server for friends",
  "icon": "https://example.com/server-icon.png"
}
```

**Successful Response:**
```json
{
  "id": "server123",
  "name": "My Server",
  "description": "A cool server for friends",
  "icon": "https://example.com/server-icon.png",
  "creatorId": "user123",
  "members": [
    {
      "userId": "user123",
      "role": "OWNER",
      "user": {
        "id": "user123",
        "username": "john_doe",
        "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
      }
    }
  ],
  "channels": [
    {
      "id": "channel123",
      "name": "general",
      "type": "TEXT",
      "position": 0
    },
    {
      "id": "channel456",
      "name": "voice-chat",
      "type": "VOICE",
      "position": 1
    }
  ],
  "roles": [
    {
      "id": "role123",
      "name": "Admin",
      "color": "#FFD700",
      "permissions": ["MANAGE_SERVER", "MANAGE_CHANNELS", "MANAGE_ROLES", "KICK_MEMBERS", "BAN_MEMBERS"],
      "position": 1
    },
    {
      "id": "role456",
      "name": "Moderator",
      "color": "#00FF00",
      "permissions": ["MANAGE_CHANNELS", "KICK_MEMBERS", "BAN_MEMBERS"],
      "position": 2
    },
    {
      "id": "role789",
      "name": "Member",
      "color": "#808080",
      "permissions": [],
      "position": 3
    }
  ]
}
```

### Get User Servers

**Request:**
```http
GET /api/server
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Successful Response:**
```json
[
  {
    "id": "server123",
    "name": "My Server",
    "description": "A cool server for friends",
    "icon": "https://example.com/server-icon.png",
    "members": [
      {
        "userId": "user123",
        "role": "OWNER",
        "user": {
          "id": "user123",
          "username": "john_doe",
          "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=john_doe"
        }
      }
    ],
    "channels": [
      {
        "id": "channel123",
        "name": "general",
        "type": "TEXT",
        "position": 0
      }
    ]
  }
]
```

### Create Channel

**Request:**
```http
POST /api/server/server123/channels
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "announcements",
  "type": "TEXT",
  "position": 2
}
```

**Successful Response:**
```json
{
  "id": "channel789",
  "name": "announcements",
  "type": "TEXT",
  "position": 2,
  "serverId": "server123"
}
```

### Add Server Member

**Request:**
```http
POST /api/server/server123/members
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "user456",
  "roleId": "role456"
}
```

**Successful Response:**
```json
{
  "id": "member123",
  "userId": "user456",
  "serverId": "server123",
  "roleId": "role456",
  "user": {
    "id": "user456",
    "username": "jane_smith",
    "avatar": "https://api.dicebear.com/6.x/initials/svg?seed=jane_smith"
  },
  "role": {
    "id": "role456",
    "name": "Moderator",
    "color": "#00FF00"
  }
}
```

## 🔄 WebSocket Events

### Connection

**Client:**
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### Join Chat

**Client:**
```javascript
socket.emit('join_chat', 'chat123');
```

### Leave Chat

**Client:**
```javascript
socket.emit('leave_chat', 'chat123');
```

### Typing Indicator

**Client:**
```javascript
socket.emit('typing', {
  chatId: 'chat123',
  isTyping: true
});
```

### Receive New Message

**Server → Client:**
```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

### Receive Typing Indicator

**Server → Client:**
```javascript
socket.on('user_typing', ({ userId, isTyping }) => {
  console.log(`User ${userId} is ${isTyping ? 'typing' : 'not typing'}`);
});
```

### Receive Reaction

**Server → Client:**
```javascript
socket.on('reaction_added', (reaction) => {
  console.log('New reaction:', reaction);
});
```

## 📊 Error Responses

### Common Error Formats

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Not authorized to perform this action"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests, please try again later"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## 🧪 Testing API

You can test the API using tools like:

- **Postman**: Import the collection from `postman_collection.json`
- **cURL**: Use the examples above with cURL
- **Swagger**: Access `/api-docs` for interactive documentation (if Swagger is set up)
- **Insomnia**: Import the API specification

## 📝 Notes

- All API endpoints require authentication unless specified otherwise
- Use HTTPS in production environment
- Rate limiting is applied to all endpoints
- WebSocket connection requires valid JWT token
- File uploads have size limits (configurable in server)
