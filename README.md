# HAU Eco-Quest

A comprehensive environmental sustainability platform designed for Holy Angel University students to engage in eco-friendly activities, complete quests, and build a community around environmental consciousness.

## Project Overview

HAU Eco-Quest is a gamified environmental platform that encourages students to participate in sustainability activities through quests, challenges, and community engagement. The platform features role-based access for students, partners, and administrators, with a comprehensive reward system including points, badges, and leaderboards.

## Team Members

- **Aguiluz, Josh Andrei D.** - Project Manager, Full-Stack Developer
- **Camus, Mark Dave** - Frontend Developer, Technical Writer  
- **Tienzo, Krisean** - Technical Writer
- **Velasquez, Ainshley** - UI/UX Designer, Full-Stack Developer
- **Yamaguchi, Mikaella** - Full-Stack Developer

## Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/signup with role-based access control
- **Quest System** - Environmental challenges with different difficulty levels and categories
- **Community Hub** - Social platform for sharing achievements and environmental tips
- **Leaderboard System** - Department and individual rankings based on eco-scores
- **Badge & Achievement System** - Rewards for completing quests and challenges
- **Admin Dashboard** - Comprehensive management interface for administrators
- **Partner Dashboard** - Specialized interface for environmental partners

### Quest Categories
- **Gardening & Planting** - Tree planting, garden maintenance
- **Recycling & Waste** - Waste reduction, recycling initiatives
- **Energy Conservation** - Energy-saving practices
- **Water Conservation** - Water-saving techniques
- **Education & Awareness** - Environmental education activities

### User Roles
- **Students** - Complete quests, earn points, participate in community
- **Partners** - Create and manage environmental challenges and quests
- **Administrators** - Full platform management and oversight

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage and processing
- **Sharp** - Image optimization
- **Multer** - File upload handling

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Radix UI** - Accessible UI components

## Project Structure

```
6WCSERVER-Final-Project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── layout/        # Layout components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── models/                # MongoDB models
├── routes/                # API routes
├── middleware/            # Authentication & authorization
├── utils/                 # Server utilities
├── config/                # Configuration files
└── server.js              # Main server file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Josh-Aguiluz/6WCSERVER-Final-Project.git
   cd 6WCSERVER-Final-Project
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   node server.js
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend client**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Production build**
   ```bash
   # Build client
   cd client
   npm run build

## API Endpoints

### Quests
- `GET /api/quests` - Get all quests
- `POST /api/quests` - Create quest (admin/partner)
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests/:id/submit` - Submit quest completion

### Community
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post

### Leaderboard
- `GET /api/users/leaderboard` - Get leaderboard data
- `GET /api/users/profile/:id` - Get user profile

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user role

## 🎮 How to Use

### For Students
1. **Sign Up** - Create an account with your HAU email
2. **Browse Quests** - Explore available environmental challenges
3. **Complete Quests** - Follow quest instructions and submit evidence
4. **Earn Points** - Accumulate eco-scores for completed activities
5. **Join Community** - Share your environmental journey with others
6. **Track Progress** - Monitor your achievements and leaderboard position

### For Partners
1. **Request Partner Access** - Contact administrators for partner status
2. **Create Challenges** - Design quests and environmental challenges for students
3. **Monitor Progress** - Track challenge participation and completion
4. **Engage Community** - Share environmental initiatives and updates

### For Administrators
1. **User Management** - Approve users and manage roles
2. **Quest Management** - Create, edit, and manage quests
3. **Content Moderation** - Review and moderate community posts
4. **Analytics** - Monitor platform usage and environmental impact

## Gamification Features

- **Points System** - Earn eco-scores for completing activities
- **Badge Collection** - Unlock achievements for milestones
- **Level Progression** - Advance through environmental warrior levels
- **Department Competition** - Compete with other HAU departments
- **Daily Quests** - Special daily challenges with bonus rewards
- **Community Challenges** - Collaborative environmental goals

## Development

### Code Structure
- **Frontend**: Component-based React architecture with context for state management
- **Backend**: RESTful API with Express.js and MongoDB
- **Authentication**: JWT-based with role-based access control
- **File Upload**: Cloudinary integration for image storage and optimization

### Key Components
- **UserContext** - Global user state management
- **API Utils** - Centralized API communication
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Image Optimization** - Automatic compression and resizing

## Key Features Highlights

- **Real-time Leaderboards** - Live updates of department and individual rankings
- **Quest Verification** - Photo/video evidence submission for quest completion
- **Community Engagement** - Like, comment, and share environmental achievements
- **Progress Tracking** - Comprehensive dashboard showing user statistics
- **Notification System** - Real-time updates for quest approvals and community activity
- **Search & Filter** - Advanced quest discovery with category and difficulty filters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Support

For support and questions:
- Email: hauecoquest@gmail.com
- Location: HAU Main Campus

## Future Enhancements

- Mobile app development
- Advanced analytics dashboard

---
