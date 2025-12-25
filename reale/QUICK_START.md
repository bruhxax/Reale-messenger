# 🚀 Quick Start Guide for Reale Messenger

This guide will help you get Reale Messenger up and running quickly.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

2. **PostgreSQL** (v14 or higher)
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Redis** (v6 or higher)
   - Download: https://redis.io/download/
   - Verify: `redis-cli --version`

## 🛠️ Installation

### 1. Clone the repository (if you haven't already)

```bash
git clone https://github.com/your-repo/reale-messenger.git
cd reale-messenger
```

### 2. Install dependencies

```bash
npm install
```

This will install all required dependencies for both frontend and backend.

## ⚙️ Configuration

### 1. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred text editor and update the values:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=reale_db

# JWT configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# Server configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 2. Set up PostgreSQL database

1. Connect to PostgreSQL:

```bash
psql -U your_postgres_username
```

2. Create the database:

```sql
CREATE DATABASE reale_db;
```

3. Exit PostgreSQL:

```sql
\q
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

This will set up the database schema with all required tables.

## 🏃 Running the Application

### Development Mode (Recommended for local development)

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:3001`
- Start the frontend development server on `http://localhost:3000`
- Automatically open your browser to the application
- Enable hot reloading for both frontend and backend

### Production Mode

1. Build the application:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

This will:
- Build optimized production assets
- Start the server on the configured port (default: 3001)
- Serve the production-ready application

## 📱 Accessing the Application

After starting the application:

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the Reale Messenger login page

## 🧪 Testing the Application

### Create an account

1. Click on "Register" link
2. Fill in the registration form:
   - Username: Your desired username
   - Email: Your email address
   - Password: Secure password (minimum 6 characters)
3. Click "Register"

### Log in

1. Enter your email and password
2. Click "Login"
3. You should be redirected to the main messenger interface

### Explore features

- **Servers**: Create and join servers (Discord-like)
- **Chats**: Start private or group chats
- **Messages**: Send text messages, add reactions, reply to messages
- **User Status**: See who's online and typing indicators

## 🐛 Troubleshooting

### Common Issues

#### 1. Database connection errors

**Error**: `Database connection error`

**Solution**:
- Make sure PostgreSQL is running
- Verify your `.env` database credentials
- Check that the database `reale_db` exists

#### 2. Redis connection errors

**Error**: `Redis connection error`

**Solution**:
- Make sure Redis server is running
- Verify your `.env` Redis configuration
- Try restarting Redis: `redis-cli shutdown` then `redis-server`

#### 3. Port already in use

**Error**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**:
- Change the port in `.env` file
- Or kill the process using the port:
  - On Linux/Mac: `lsof -i :3001` then `kill -9 PID`
  - On Windows: `netstat -ano | findstr :3001` then `taskkill /PID PID /F`

#### 4. Dependency installation issues

**Error**: `npm install` fails

**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm cache clean --force`
- Try `npm install` again

## 🔧 Additional Commands

### Run only backend

```bash
npm run dev:backend
```

### Run only frontend

```bash
npm run dev:frontend
```

### Build for mobile (PWA)

```bash
npm run build:mobile
```

### Check for updates

```bash
npm outdated
```

## 📱 Mobile Development

### Install as PWA

1. Open Chrome browser
2. Navigate to `http://localhost:3000`
3. Click the install icon in the address bar
4. Follow the prompts to install as a desktop app

### For native mobile apps (using Capacitor)

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
npx cap open android  # For Android Studio
npx cap open ios      # For Xcode
```

## 🎯 Next Steps

1. **Customize**: Modify the UI, colors, and branding
2. **Extend**: Add new features like video calls or file sharing
3. **Deploy**: Set up production deployment
4. **Monitor**: Add logging and monitoring
5. **Scale**: Configure for multiple users and high traffic

## 📚 Documentation

For more detailed information, check out:

- [README.md](README.md) - Main documentation
- [API_EXAMPLES.md](API_EXAMPLES.md) - API examples
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

## 🤝 Support

If you encounter any issues not covered in this guide:

1. Check the error message and logs
2. Review the documentation
3. Search for similar issues online
4. Ask for help in the project's issue tracker

Enjoy using Reale Messenger! 🚀
