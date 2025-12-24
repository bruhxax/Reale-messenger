# Reale Messenger Architecture

This document describes the high-level architecture of the Reale Messenger application.

## 🏗️ System Overview

Reale Messenger is a modern, real-time messaging platform that combines features from Discord and Telegram. The system is designed with a microservices-like architecture, though currently implemented as a monolithic application for simplicity.

## 🧩 Architecture Components

### 1. Client Applications

#### Web Client
- **Framework**: Next.js (React)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO client
- **PWA**: Service Worker, Web App Manifest

#### Mobile Client (Future)
- **Framework**: React Native or Capacitor wrapper
- **Platforms**: iOS, Android
- **Distribution**: App Store, Google Play

### 2. API Gateway

- **Technology**: Express.js
- **Protocol**: HTTP/HTTPS
- **Authentication**: JWT-based
- **Rate Limiting**: Express rate limiter
- **CORS**: Cross-origin resource sharing

### 3. Application Services

#### Authentication Service
- **Registration**: User signup with email/password
- **Login**: JWT token generation
- **Token Refresh**: Refresh token mechanism
- **Session Management**: User sessions

#### Chat Service
- **Chat Management**: Create, read, update chats
- **Message Management**: Send, receive, edit, delete messages
- **Reactions**: Add/remove reactions to messages
- **Pinned Messages**: Pin/unpin messages

#### Server Service
- **Server Management**: Create, manage servers
- **Channel Management**: Text/voice channels
- **Role Management**: Custom roles and permissions
- **Member Management**: Add/remove members

#### User Service
- **Profile Management**: User profiles, avatars
- **Status Management**: Online/offline status
- **Presence**: User presence indicators

### 4. Real-time Service

- **Technology**: Socket.IO
- **Protocol**: WebSocket
- **Features**:
  - Instant message delivery
  - Typing indicators
  - Read receipts
  - Online status updates
  - Real-time notifications

### 5. Data Storage

#### Primary Database
- **Technology**: PostgreSQL
- **ORM**: Prisma
- **Schema**: Relational database schema
- **Tables**:
  - Users
  - Chats
  - Messages
  - Reactions
  - Servers
  - Channels
  - Roles
  - ServerMembers

#### Cache
- **Technology**: Redis
- **Use Cases**:
  - Online user status
  - Rate limiting
  - Session storage
  - Temporary data caching

### 6. File Storage (Future)

- **Options**:
  - AWS S3
  - Google Cloud Storage
  - Local file system (for development)
- **Use Cases**:
  - User avatars
  - Message attachments
  - Server icons

## 🔄 Data Flow

### Authentication Flow

```
Client → API Gateway → Authentication Service → Database
         ↓
   JWT Token ←
         ↓
   Client stores token
```

### Message Flow

```
Client → API Gateway → Chat Service → Database
         ↓
   Response ←
         ↓
   Client displays message
         ↓
   Real-time Service → Other Clients (via WebSocket)
```

### Real-time Flow

```
Client A → WebSocket → Real-time Service → Database
         ↓
   Message stored
         ↓
   Real-time Service → Client B (via WebSocket)
         ↓
   Client B displays message
```

## 📦 Module Structure

### Backend Modules

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Database configuration
│   └── redis.js      # Redis configuration
├── controllers/      # Business logic
│   ├── auth.js       # Authentication controller
│   ├── chat.js       # Chat controller
│   └── server.js     # Server controller
├── middleware/       # Middleware functions
│   └── auth.js       # Authentication middleware
├── models/           # Database models (Prisma)
├── routes/           # API routes
│   ├── auth.js       # Authentication routes
│   ├── chat.js       # Chat routes
│   └── server.js     # Server routes
└── index.js          # Main server file
```

### Frontend Modules

```
frontend/
├── public/           # Static assets
│   ├── icons/        # PWA icons
│   ├── manifest.json # Web App Manifest
│   └── sw.js         # Service Worker
├── src/
│   ├── components/   # React components
│   │   ├── AuthProvider.js  # Authentication context
│   │   ├── SocketProvider.js # WebSocket context
│   │   ├── ServerSidebar.js  # Server sidebar
│   │   ├── ChatList.js       # Chat list
│   │   └── ChatWindow.js    # Chat window
│   ├── pages/        # Next.js pages
│   │   ├── _app.js   # Main app component
│   │   ├── index.js  # Home page
│   │   ├── login.js  # Login page
│   │   └── register.js # Register page
│   ├── store/        # Zustand store
│   │   └── index.js  # Global state
│   └── styles/       # CSS styles
│       └── globals.css # Global styles
├── next.config.js    # Next.js configuration
└── tailwind.config.js # Tailwind configuration
```

## 🔒 Security Architecture

### Authentication

- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Long-lived tokens for session persistence
- **Token Storage**: HTTP-only cookies (future), localStorage (current)
- **Token Expiration**: Short-lived access tokens (1 day)

### Authorization

- **Role-Based Access Control**: Different permission levels
- **Resource Ownership**: Users can only modify their own resources
- **Server Roles**: Custom roles with granular permissions

### Data Protection

- **Password Hashing**: bcrypt with salt
- **HTTPS**: Encrypted communication
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent brute force attacks

## 🚀 Performance Architecture

### Caching Strategy

- **Redis Cache**: For frequently accessed data
- **Browser Cache**: For static assets
- **Service Worker Cache**: For PWA offline support

### Optimization Techniques

- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Load components on demand
- **Database Indexing**: Optimize query performance
- **WebSocket Compression**: Reduce bandwidth usage
- **Image Optimization**: Next.js Image component

### Scaling Strategy

- **Horizontal Scaling**: Multiple server instances
- **Load Balancing**: Distribute traffic
- **Database Replication**: Read replicas
- **Microservices**: Future decomposition

## 📡 Real-time Architecture

### WebSocket Implementation

- **Socket.IO**: Real-time communication library
- **Rooms**: Organize connections by chat/server
- **Namespaces**: Separate different types of connections
- **Fallback**: Long-polling for unsupported browsers

### Event Types

- **Connection Events**: `connect`, `disconnect`
- **Chat Events**: `join_chat`, `leave_chat`, `new_message`
- **Typing Events**: `typing`, `user_typing`
- **Reaction Events**: `add_reaction`, `remove_reaction`
- **Server Events**: `join_server`, `leave_server`, `new_channel`

### Presence System

- **Online Status**: Track user online/offline
- **Typing Indicators**: Show when users are typing
- **Read Receipts**: Track message read status

## 📱 Mobile Architecture

### PWA Implementation

- **Service Worker**: Offline support, caching
- **Web App Manifest**: Installable app
- **Responsive Design**: Works on all screen sizes
- **Push Notifications**: Web Push API

### Native Wrapper (Future)

- **Capacitor**: Cross-platform native wrapper
- **Platform APIs**: Access native device features
- **App Store Distribution**: Publish to app stores

## 🔧 Deployment Architecture

### Development Environment

- **Local Development**: `npm run dev`
- **Hot Reloading**: Automatic refresh
- **Environment Variables**: `.env` file

### Production Environment

- **Build Process**: `npm run build`
- **Server**: `npm start`
- **Containerization**: Docker (future)
- **Orchestration**: Kubernetes (future)

### CI/CD Pipeline (Future)

- **Testing**: Automated tests
- **Building**: Build artifacts
- **Deployment**: Deploy to servers
- **Monitoring**: Health checks, logging

## 📈 Monitoring Architecture (Future)

### Logging

- **Request Logging**: Track API requests
- **Error Logging**: Capture and store errors
- **Performance Logging**: Monitor response times

### Analytics

- **Usage Statistics**: Track feature usage
- **User Metrics**: Active users, retention
- **Performance Metrics**: Response times, uptime

### Alerting

- **Error Alerts**: Notify on critical errors
- **Performance Alerts**: Slow response times
- **Availability Alerts**: Server downtime

## 🎯 Future Architecture Evolution

### Microservices

- **Auth Service**: Separate authentication service
- **Chat Service**: Dedicated chat service
- **Media Service**: File upload/download service
- **Notification Service**: Push notification service

### Scaling

- **Database Sharding**: Distribute database load
- **Message Queue**: Async processing with RabbitMQ/Kafka
- **CDN**: Content delivery network for static assets

### Advanced Features

- **End-to-End Encryption**: Secure messaging
- **Video Calls**: WebRTC implementation
- **Bots**: Bot API and framework
- **Plugins**: Extensible plugin system

## 📊 Architecture Decisions

### Why Next.js?

- **Full-stack Capability**: API routes + frontend
- **SSG/SSR**: Static site generation and server rendering
- **Optimized**: Built-in performance optimizations
- **Ecosystem**: Large community and plugins

### Why Express?

- **Simple**: Easy to understand and maintain
- **Flexible**: Can be extended as needed
- **Performance**: Good enough for most use cases
- **Ecosystem**: Large middleware ecosystem

### Why Socket.IO?

- **Reliable**: Automatic reconnection
- **Fallback**: Works in all browsers
- **Scalable**: Can be scaled with Redis adapter
- **Ecosystem**: Large community and plugins

### Why PostgreSQL?

- **Relational**: Structured data model
- **ACID**: Transaction support
- **Performance**: Good read/write performance
- **Ecosystem**: Many tools and integrations

### Why Redis?

- **Fast**: In-memory data store
- **Simple**: Easy to use
- **Versatile**: Can be used for caching, sessions, pub/sub
- **Scalable**: Can be clustered

## 📝 Conclusion

The Reale Messenger architecture is designed to be:

1. **Modular**: Easy to understand and maintain
2. **Scalable**: Can grow with user base
3. **Performant**: Optimized for speed
4. **Secure**: Protected against common threats
5. **Extensible**: Easy to add new features

The current monolithic architecture provides simplicity for development and deployment, while being designed with future microservices decomposition in mind.
