# CampusConnect+ Academic Doubt Resolution Platform

A comprehensive peer learning platform designed for academic institutions to facilitate structured doubt resolution, knowledge sharing, and collaborative learning among students.

## 🚀 Features

### Core Functionality
- **College Email Authentication**: Secure registration with email verification
- **Anonymous/Named Posting**: Students can ask questions anonymously or with their identity
- **Priority System**: Categorize questions as Critical, Hard, or Medium priority
- **Comprehensive Tagging**: Subject-based tagging system for easy filtering
- **Real-time Engagement**: Upvoting system and view tracking
- **Answer Management**: Accept answers and mark questions as resolved
- **Advanced Search**: Search across questions, content, and tags

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Live question and answer interactions
- **Smart Filtering**: Filter by tags, priority, department, and semester
- **Contributor Recognition**: Leaderboard system with reputation points
- **User Profiles**: Detailed profiles with statistics and achievements

### Technical Features
- **RESTful API**: Well-structured backend with MongoDB
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Automated email verification system
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling and user feedback

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **bcryptjs** for password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email verification)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/campusconnect
# JWT_SECRET=your_super_secret_jwt_key
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password
# CLIENT_URL=http://localhost:5173

# Seed sample data (optional)
npm run seed

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
PORT=5000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user
- `POST /api/auth/resend-verification` - Resend verification email

### Question Endpoints
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `POST /api/questions/:id/upvote` - Upvote question
- `POST /api/questions/:id/answers` - Add answer
- `POST /api/questions/:questionId/answers/:answerId/upvote` - Upvote answer
- `POST /api/questions/:questionId/answers/:answerId/accept` - Accept answer
- `PATCH /api/questions/:id/resolve` - Mark as resolved

### User Endpoints
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/stats/overview` - Get platform statistics

## 🎯 Key Features Implementation

### Email Verification System
- Automated email sending with verification links
- Token-based verification with expiration
- Resend verification functionality

### Reputation System
- Points for asking questions (+2)
- Points for answering questions (+2)
- Points for receiving upvotes (+3-5)
- Bonus points for accepted answers (+15)

### Advanced Filtering
- Search by keywords in title/content
- Filter by tags, priority, department
- Sort by date, popularity, or relevance

### Anonymous Posting
- Complete anonymity protection
- Separate reputation tracking
- Privacy-focused design

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy server directory
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, TypeScript, Tailwind CSS
- **Backend Development**: Node.js, Express, MongoDB
- **UI/UX Design**: Modern, responsive design principles
- **DevOps**: Deployment and environment configuration

## 🎉 Acknowledgments

- Built for academic institutions to enhance peer learning
- Inspired by modern Q&A platforms with academic focus
- Designed with student privacy and engagement in mind

---

**CampusConnect+** - Connecting minds, sharing knowledge, building futures! 🎓