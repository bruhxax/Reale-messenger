# Reale Messenger

Modern messenger with Discord and Telegram features

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [API Documentation](#-api-documentation)
- [PWA Setup](#-pwa-setup)
- [Mobile Build](#-mobile-build)
- [Security](#-security)
- [Optimization](#-optimization)

## 🎨 Features

### Core Features
- **Authentication**: Email + password, JWT with refresh tokens
- **Real-time Messaging**: WebSocket-based instant messaging
- **Chat Types**: Private chats, group chats, channels, servers
- **Message Features**: Text, emoji, stickers, GIFs, files, voice messages
- **Message Actions**: Replies, reactions, editing, deleting, pinning
- **User Status**: Online/offline indicators, typing indicators, read receipts

### Server Features (Discord-like)
- **Servers**: Create and manage servers
- **Channels**: Text and voice channels
- **Roles & Permissions**: Custom roles with granular permissions
- **Member Management**: Add/remove members, assign roles

### UI/UX Features
- **Dark Theme**: Default dark theme with custom color scheme
- **Responsive Design**: Works on desktop and mobile
- **Animations**: Smooth transitions and animations
- **PWA Support**: Installable as progressive web app
- **Mobile Ready**: PWA + iOS/Android wrapper support

## 🧱 Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.IO
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis

### DevOps
- **Build**: Next.js build system
- **PWA**: Workbox, service worker
- **Mobile**: PWA + Capacitor/Cordova wrapper

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL (v14+)
- Redis (v6+)

### Setup

1. **Clone the repository**:
```bash
git clone https://github.com/your-repo/reale-messenger.git
cd reale-messenger
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=reale_db

# JWT configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# Server configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE reale_db;
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev
```

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`

### Production Mode

1. Build the app:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Chats

#### Create Chat
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user123",
  "isGroup": false
}
```

#### Get User Chats
```http
GET /api/chat
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/chat/:chatId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello there!",
  "replyToId": null,
  "fileUrl": null
}
```

### Servers

#### Create Server
```http
POST /api/server
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Server",
  "description": "A cool server",
  "icon": "https://example.com/icon.png"
}
```

#### Get User Servers
```http
GET /api/server
Authorization: Bearer <token>
```

## 📱 PWA Setup

The app is configured as a Progressive Web App:

1. **Service Worker**: Automatically registered in production
2. **Manifest**: `/public/manifest.json`
3. **Icons**: Place icons in `/public/icons/` directory

### Install PWA
- Chrome: Click the install button in the address bar
- Mobile: Add to home screen from browser menu

## 📱 Mobile Build

### Using Capacitor

1. Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. Add platforms:
```bash
npx cap add android
npx cap add ios
```

3. Build and sync:
```bash
npm run build:mobile
npx cap sync
```

4. Open in native IDE:
```bash
npx cap open android
npx cap open ios
```

## 🔒 Security

### Implemented Security Measures
- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Short-lived access tokens with refresh mechanism
- **Password Hashing**: bcrypt for secure password storage
- **CORS**: Proper CORS configuration
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Validation on both client and server

### Additional Recommendations
- Use HTTPS in production
- Set secure cookie flags
- Implement CSRF protection
- Regular security audits
- Keep dependencies updated

## ⚡ Optimization

### Performance Optimizations
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Redis caching for frequent queries
- **Database Indexing**: Proper indexing for fast queries
- **WebSocket Compression**: Enabled in Socket.IO

### Bundle Optimization
- **Tree Shaking**: Automatic with Next.js
- **Minification**: Production build minification
- **Compression**: Gzip/Brotli compression

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
reale/
├── backend/              # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Middleware functions
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── index.js          # Main server file
├── frontend/             # Frontend application
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── store/        # Zustand store
│   │   └── styles/       # CSS styles
│   ├── next.config.js    # Next.js config
│   └── tailwind.config.js # Tailwind config
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## 🎯 Future Roadmap

- **Video Calls**: WebRTC-based video calling
- **End-to-End Encryption**: Secure message encryption
- **Message Search**: Full-text search in chats
- **Themes**: Customizable UI themes
- **Bots**: Bot API and integration
- **Analytics**: Usage statistics and insights

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

MIT License
