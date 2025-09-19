# Quick Touch Academy - Complete Module & Functionality Catalog

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Core Modules](#core-modules)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Page Functionality](#page-functionality)
8. [Business Logic](#business-logic)
9. [Integration Points](#integration-points)
10. [Technical Architecture](#technical-architecture)

---

## 🎯 System Overview

**Quick Touch Academy** is a comprehensive football academy management system that provides:
- Multi-academy support with role-based access control
- Player management and performance tracking
- AI-powered insights and analytics
- Training program management
- Event and match scheduling
- Real-time messaging system
- Advanced statistics and player comparison tools

---

## 🏗️ Core Modules

### 1. **Authentication & Authorization Module**
**Purpose**: Secure user authentication and role-based access control

**Components**:
- JWT-based authentication system
- Role-based access control (RBAC)
- Email verification system
- Password recovery functionality
- Session management

**Key Features**:
- Multi-role support (Super Admin, Admin, Coach, Player, Scout)
- Academy-based access isolation
- Secure token management
- Automatic role-based redirections

**Database Models**:
- `User` - User accounts and authentication
- `Academy` - Academy information and admin assignments

---

### 2. **User Management Module**
**Purpose**: Comprehensive user lifecycle management

**Components**:
- User registration and onboarding
- Profile management
- Role assignment and management
- Academy association
- User status tracking

**Key Features**:
- Multi-step registration process
- Email verification workflow
- Role-based user filtering
- Academy-based user isolation
- User activity tracking

**API Endpoints**:
- `POST /api/users` - Create new user
- `GET /api/users` - List users with filtering
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

---

### 3. **Academy Management Module**
**Purpose**: Multi-academy system management

**Components**:
- Academy registration and approval
- Academy profile management
- Admin assignment
- Academy settings and configuration

**Key Features**:
- Academy approval workflow
- Multi-academy isolation
- Admin role management
- Academy statistics and analytics
- Contact information management

**API Endpoints**:
- `GET /api/academy_management` - List academies
- `POST /api/academy_management` - Create academy
- `GET /api/academy_management/[id]` - Get academy details
- `PUT /api/academy_management/[id]` - Update academy
- `DELETE /api/academy_management/[id]` - Delete academy

---

### 4. **Player Management Module**
**Purpose**: Comprehensive player lifecycle and performance management

**Components**:
- Player registration and profiles
- Performance statistics tracking
- Player statistics and analytics
- Highlight reel management
- Player feedback system

**Key Features**:
- Detailed player profiles (age, height, position)
- Performance metrics tracking
- Match statistics integration
- Coach feedback system
- Player progress monitoring
- Academy-based player isolation

**Database Models**:
- `Player` - Player profiles and basic information
- `PlayerStats` - Match-by-match performance data
- `Feedback` - Coach feedback and ratings

**API Endpoints**:
- `GET /api/players_management` - List players with filtering
- `POST /api/players_management` - Create new player
- `GET /api/players_management/[id]` - Get player details
- `PUT /api/players_management/[id]` - Update player
- `DELETE /api/players_management/[id]` - Delete player

---

### 5. **Training Programs Module**
**Purpose**: Training session planning and management

**Components**:
- Training program creation
- Drill management
- Coach assignment
- Schedule management
- Progress tracking

**Key Features**:
- Detailed training program creation
- Drill and exercise management
- Coach-specific programs
- Date and time scheduling
- Academy-based program isolation

**Database Models**:
- `TrainingPlan` - Training programs and drills

**API Endpoints**:
- `GET /api/training_programs` - List training programs
- `POST /api/training_programs` - Create training program
- `GET /api/training_programs/[id]` - Get program details
- `PUT /api/training_programs/[id]` - Update program
- `DELETE /api/training_programs/[id]` - Delete program

---

### 6. **Event & Match Management Module**
**Purpose**: Event scheduling and match management

**Components**:
- Event creation and scheduling
- Match management
- Location management
- Attendance tracking
- Event type categorization

**Key Features**:
- Event and match scheduling
- Location-based organization
- Attendance tracking system
- Event type management (training, match, tournament)
- Academy-based event isolation

**Database Models**:
- `Event` - Training events and activities
- `Match` - Competitive matches
- `Attendance` - Player attendance tracking

**API Endpoints**:
- `GET /api/event_management` - List events
- `POST /api/event_management` - Create event
- `GET /api/event_management/[id]` - Get event details
- `PUT /api/event_management/[id]` - Update event
- `DELETE /api/event_management/[id]` - Delete event

---

### 7. **Attendance Management Module**
**Purpose**: Track player attendance and participation

**Components**:
- Attendance tracking system
- Check-in/check-out functionality
- Attendance reports
- Statistics and analytics

**Key Features**:
- Real-time attendance tracking
- Event and match attendance
- Attendance statistics
- Report generation
- Academy-based attendance isolation

**Database Models**:
- `Attendance` - Attendance records

---

### 8. **AI Insights Module**
**Purpose**: AI-powered player analysis and insights

**Components**:
- Video analysis processing
- Performance prediction algorithms
- Training recommendations
- Growth trajectory analysis
- Confidence scoring system

**Key Features**:
- Video analysis integration
- Performance predictions
- Training recommendations
- Growth trajectory analysis
- Automated insight generation
- Confidence scoring
- Notification system integration

**Database Models**:
- `AIInsight` - AI-generated insights and recommendations

**API Endpoints**:
- `GET /api/ai-insights` - Get AI insights for player
- `POST /api/ai-insights` - Create new AI insight
- `GET /api/ai-insights/video-analysis` - Get video analyses
- `POST /api/ai-insights/video-analysis` - Process video for analysis

---

### 9. **Advanced Statistics Module**
**Purpose**: Detailed player performance analytics

**Components**:
- Advanced performance metrics
- Match-by-match analysis
- Position heatmap data
- Performance trends
- Comparative analysis

**Key Features**:
- Pass accuracy tracking
- Distance covered metrics
- Sprint count analysis
- Position heatmap data
- Match-by-match performance breakdown
- Aggregated performance overview
- Historical trend analysis

**Database Models**:
- `AdvancedPlayerStats` - Advanced performance metrics

**API Endpoints**:
- `GET /api/advanced-stats` - Get advanced stats for player
- `POST /api/advanced-stats` - Create new advanced stats entry

---

### 10. **Player Comparison Module**
**Purpose**: Scout tools for player comparison and analysis

**Components**:
- Side-by-side player comparison
- Statistical analysis tools
- Performance metrics comparison
- Scout notes and observations
- Comparison history tracking

**Key Features**:
- Visual comparison charts
- Statistical analysis
- Performance trend comparison
- Scout notes system
- Comparison history
- Export functionality

**Database Models**:
- `PlayerComparison` - Comparison records
- `ScoutFavorite` - Scout's favorite players

**API Endpoints**:
- `GET /api/player-comparison` - Get player comparisons
- `POST /api/player-comparison` - Create new comparison
- `GET /api/player-comparison/[id]` - Get comparison details
- `PUT /api/player-comparison/[id]` - Update comparison
- `DELETE /api/player-comparison/[id]` - Delete comparison

---

### 11. **Messaging System Module**
**Purpose**: Real-time communication between users

**Components**:
- Real-time messaging
- Conversation management
- Media sharing
- Message status tracking
- Notification system

**Key Features**:
- Real-time messaging
- Role-based messaging permissions
- Media sharing (images, documents)
- Message read status tracking
- Conversation management
- Notification integration

**Database Models**:
- `Conversation` - Chat conversations
- `Message` - Individual messages
- `Notification` - System notifications

**API Endpoints**:
- `GET /api/messaging/conversations` - Get user conversations
- `POST /api/messaging/conversations` - Create new conversation
- `GET /api/messaging/conversations/[id]/messages` - Get messages
- `POST /api/messaging/conversations/[id]/messages` - Send message
- `GET /api/messaging/users` - Get users for messaging

---

### 12. **Notification System Module**
**Purpose**: System-wide notification management

**Components**:
- Notification creation and delivery
- User notification preferences
- Notification history
- Real-time notification updates

**Key Features**:
- Real-time notifications
- Notification categorization
- User-specific notifications
- Notification history
- Read/unread status tracking

**Database Models**:
- `Notification` - System notifications

---

## 🗄️ Database Schema

### Core Models

#### **User Model**
```prisma
model User {
  id                String          @id
  role              String          @default("player")
  fullName          String
  email             String          @unique
  password          String?
  phone             String?
  createdAt         DateTime        @default(now())
  profilePhoto      String?
  playerId          String?         @unique
  academyId         String
  isEmailVerified   Boolean         @default(false)
  verificationToken String?
  
  // Relations
  Academy           Academy         @relation(fields: [academyId], references: [id])
  Player            Player?         @relation(fields: [playerId], references: [id])
  Feedback          Feedback[]
  Notification      Notification[]
  ScoutFavorite     ScoutFavorite[]
  TrainingPlan      TrainingPlan[]
}
```

#### **Academy Model**
```prisma
model Academy {
  id           String         @id
  name         String
  location     String
  description  String?
  contactEmail String?
  contactPhone String?
  adminIds     String         @db.LongText
  createdAt    DateTime       @default(now())
  updatedAt    DateTime?
  
  // Relations
  Event        Event[]
  Match        Match[]
  Player       Player[]
  TrainingPlan TrainingPlan[]
  User         User[]
}
```

#### **Player Model**
```prisma
model Player {
  id             String          @id
  userId         String          @unique
  fullName       String
  age            Int
  height         Float
  position       String
  highlightReels String          @db.LongText
  academyId      String
  createdAt      DateTime        @default(now())
  updatedAt      DateTime
  
  // Relations
  Academy        Academy         @relation(fields: [academyId], references: [id])
  User           User?
  Attendance     Attendance[]
  Feedback       Feedback[]
  PlayerStats    PlayerStats[]
  ScoutFavorite  ScoutFavorite[]
}
```

#### **TrainingPlan Model**
```prisma
model TrainingPlan {
  id          String   @id
  coachId     String
  title       String
  description String
  drills      String   @db.LongText
  date        DateTime
  academyId   String
  createdAt   DateTime @default(now())
  
  // Relations
  Academy     Academy  @relation(fields: [academyId], references: [id])
  User        User     @relation(fields: [coachId], references: [id])
}
```

#### **Event Model**
```prisma
model Event {
  id          String       @id
  academyId   String
  title       String
  description String
  date        DateTime
  location    String
  type        String
  createdAt   DateTime     @default(now())
  
  // Relations
  Academy     Academy      @relation(fields: [academyId], references: [id])
  Attendance  Attendance[]
}
```

#### **Match Model**
```prisma
model Match {
  id          String        @id
  academyId   String
  title       String
  date        DateTime
  location    String
  type        String
  createdAt   DateTime      @default(now())
  
  // Relations
  Academy     Academy       @relation(fields: [academyId], references: [id])
  Attendance  Attendance[]
  PlayerStats PlayerStats[]
}
```

#### **PlayerStats Model**
```prisma
model PlayerStats {
  id            String   @id
  playerId      String
  matchId       String
  goals         Int      @default(0)
  assists       Int      @default(0)
  minutesPlayed Int      @default(0)
  date          DateTime
  createdAt     DateTime @default(now())
  
  // Relations
  Match         Match    @relation(fields: [matchId], references: [id])
  Player        Player   @relation(fields: [playerId], references: [id])
}
```

#### **Attendance Model**
```prisma
model Attendance {
  id        String   @id
  playerId  String
  eventId   String?
  matchId   String?
  status    String
  date      DateTime
  createdAt DateTime @default(now())
  
  // Relations
  Event     Event?   @relation(fields: [eventId], references: [id])
  Match     Match?   @relation(fields: [matchId], references: [id])
  Player    Player   @relation(fields: [playerId], references: [id])
}
```

#### **Feedback Model**
```prisma
model Feedback {
  id        String   @id
  playerId  String
  coachId   String
  rating    Int
  notes     String
  date      DateTime
  createdAt DateTime @default(now())
  
  // Relations
  User      User     @relation(fields: [coachId], references: [id])
  Player    Player   @relation(fields: [playerId], references: [id])
}
```

#### **Notification Model**
```prisma
model Notification {
  id        String   @id
  userId    String
  type      String
  title     String
  message   String
  relatedId String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  // Relations
  User      User     @relation(fields: [userId], references: [id])
}
```

#### **ScoutFavorite Model**
```prisma
model ScoutFavorite {
  id        String   @id
  scoutId   String
  playerId  String
  createdAt DateTime @default(now())
  
  // Relations
  Player    Player   @relation(fields: [playerId], references: [id])
  User      User     @relation(fields: [scoutId], references: [id])
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/auth/verify` - Token verification
- `POST /api/users/verify` - Email verification

### User Management Endpoints
- `GET /api/users` - List users with filtering
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Academy Management Endpoints
- `GET /api/academy_management` - List academies
- `POST /api/academy_management` - Create academy
- `GET /api/academy_management/[id]` - Get academy details
- `PUT /api/academy_management/[id]` - Update academy
- `DELETE /api/academy_management/[id]` - Delete academy

### Player Management Endpoints
- `GET /api/players_management` - List players with filtering
- `POST /api/players_management` - Create new player
- `GET /api/players_management/[id]` - Get player details
- `PUT /api/players_management/[id]` - Update player
- `DELETE /api/players_management/[id]` - Delete player

### Training Programs Endpoints
- `GET /api/training_programs` - List training programs
- `POST /api/training_programs` - Create training program
- `GET /api/training_programs/[id]` - Get program details
- `PUT /api/training_programs/[id]` - Update program
- `DELETE /api/training_programs/[id]` - Delete program

### Event Management Endpoints
- `GET /api/event_management` - List events
- `POST /api/event_management` - Create event
- `GET /api/event_management/[id]` - Get event details
- `PUT /api/event_management/[id]` - Update event
- `DELETE /api/event_management/[id]` - Delete event

### AI Insights Endpoints
- `GET /api/ai-insights` - Get AI insights for player
- `POST /api/ai-insights` - Create new AI insight
- `GET /api/ai-insights/video-analysis` - Get video analyses
- `POST /api/ai-insights/video-analysis` - Process video for analysis

### Advanced Statistics Endpoints
- `GET /api/advanced-stats` - Get advanced stats for player
- `POST /api/advanced-stats` - Create new advanced stats entry

### Player Comparison Endpoints
- `GET /api/player-comparison` - Get player comparisons
- `POST /api/player-comparison` - Create new comparison
- `GET /api/player-comparison/[id]` - Get comparison details
- `PUT /api/player-comparison/[id]` - Update comparison
- `DELETE /api/player-comparison/[id]` - Delete comparison

### Messaging Endpoints
- `GET /api/messaging/conversations` - Get user conversations
- `POST /api/messaging/conversations` - Create new conversation
- `GET /api/messaging/conversations/[id]/messages` - Get messages
- `POST /api/messaging/conversations/[id]/messages` - Send message
- `GET /api/messaging/users` - Get users for messaging

---

## 🎨 Frontend Components

### Core Components
- **Sidebar** - Role-based navigation
- **Navbar** - Top navigation bar
- **AuthContext** - Authentication state management
- **Layout** - Page layout wrapper

### Player Management Components
- **PlayerList** - Player listing with filtering
- **PlayerForm** - Player creation/editing form
- **PlayerCard** - Individual player display
- **PlayerStats** - Player statistics display

### Training Components
- **TrainingProgramList** - Training program listing
- **TrainingProgramForm** - Program creation/editing
- **TrainingProgramCard** - Program display card

### Analytics Components
- **AIInsightsDashboard** - AI insights display
- **AdvancedStatsDashboard** - Advanced statistics
- **PlayerComparisonForm** - Comparison creation
- **PlayerComparisonChart** - Visual comparison charts

### Messaging Components
- **MessagingApp** - Main messaging interface
- **ConversationList** - Conversation listing
- **MessageList** - Chat interface
- **MessageInput** - Message composition

### Dashboard Components
- **DashboardStats** - Statistics cards
- **QuickActions** - Quick action buttons
- **RecentActivities** - Activity feed
- **Notifications** - Notification display

---

## 👥 User Roles & Permissions

### Super Admin
**Access Level**: System-wide
**Permissions**:
- Full system access
- Academy management
- User management across all academies
- System configuration
- Admin approval workflow

**Pages Access**:
- Main Dashboard
- Academy Management
- Admin Approvals
- All Players
- All Events
- User Management
- All analytics and insights

### Admin
**Access Level**: Academy-specific
**Permissions**:
- Academy user management
- Player management within academy
- Event and match management
- Training program management
- Academy analytics

**Pages Access**:
- Academy Dashboard
- Player Management
- Training Programs
- Event Management
- Attendance Management
- AI Insights
- Advanced Stats

### Coach
**Access Level**: Academy-specific, limited
**Permissions**:
- Player management within academy
- Training program creation
- Event management
- Player feedback
- Limited analytics access

**Pages Access**:
- Coach Dashboard
- Players Management
- Training Programs
- Event Management
- Attendance Management
- AI Insights
- Advanced Stats
- Messaging

### Player
**Access Level**: Personal data only
**Permissions**:
- View own profile and statistics
- Access personal AI insights
- Messaging with coaches and admins
- View own performance data

**Pages Access**:
- My Dashboard
- My AI Insights
- My Stats
- Messaging

### Scout
**Access Level**: Cross-academy, read-only
**Permissions**:
- View players across academies
- Create player comparisons
- Access analytics and insights
- Messaging with admins and coaches

**Pages Access**:
- Dashboard
- Players Management
- Player Comparison
- AI Insights
- Advanced Stats
- Messaging

---

## 📄 Page Functionality

### Authentication Pages

#### Login Page (`/login`)
**Functionality**:
- Email/password authentication
- Role-based redirection
- Remember me functionality
- Forgot password link
- Form validation and error handling

**Technical Details**:
- JWT token generation
- Secure password verification
- Automatic role-based routing
- Session management

#### Register Page (`/register`)
**Functionality**:
- Two-tab interface (User/Academy)
- Two-column responsive layout
- User registration with role selection
- Academy registration with approval workflow
- Email verification integration
- Form validation and error handling

**Technical Details**:
- Multi-step registration process
- Academy selection dropdown
- Email verification token generation
- Password strength validation

### Dashboard Pages

#### Main Dashboard (`/pages/dashboard`)
**Functionality**:
- System-wide statistics
- Academy overview
- User management access
- Global analytics
- Quick action buttons

**Technical Details**:
- Real-time statistics fetching
- Role-based access control
- Automatic redirection for non-super-admins

#### Academy Dashboard (`/pages/academy-dashboard`)
**Functionality**:
- Academy-specific statistics
- Player management overview
- Event and training summaries
- Quick access to academy features

**Technical Details**:
- Academy-filtered data
- Role-based access control
- Real-time updates

#### Coach Dashboard (`/pages/coach-dashboard`)
**Functionality**:
- Coach-specific statistics
- Player performance overview
- Training program management
- Upcoming events
- Quick actions for coaches

**Technical Details**:
- Coach-specific data filtering
- Performance metrics display
- Training program integration

### Management Pages

#### User Management (`/pages/users`)
**Functionality**:
- User listing with pagination
- Add/edit/delete users
- Role management
- Email verification status
- Academy filtering
- Search and filter capabilities

**Technical Details**:
- CRUD operations
- Role-based access control
- Academy isolation
- Form validation

#### Player Management (`/pages/players_management`)
**Functionality**:
- Player listing with advanced filtering
- Player profile management
- Statistics integration
- Performance tracking
- Academy-based filtering

**Technical Details**:
- Advanced filtering (age, position, academy)
- Statistics aggregation
- Performance metrics display
- CRUD operations

#### Training Programs (`/pages/training_programs`)
**Functionality**:
- Training program listing
- Program creation and editing
- Coach assignment
- Schedule management
- Program statistics

**Technical Details**:
- Program CRUD operations
- Coach assignment logic
- Date/time scheduling
- Academy isolation

#### Event Management (`/pages/event_management`)
**Functionality**:
- Event and match listing
- Event creation and editing
- Schedule management
- Location management
- Attendance tracking integration

**Technical Details**:
- Event CRUD operations
- Date/time scheduling
- Location management
- Attendance integration

### Analytics Pages

#### AI Insights (`/pages/ai-insights`)
**Functionality**:
- Player performance analysis
- AI-generated insights
- Video analysis integration
- Training recommendations
- Performance predictions

**Technical Details**:
- AI insight processing
- Video analysis integration
- Performance prediction algorithms
- Confidence scoring

#### Advanced Stats (`/pages/advanced-stats`)
**Functionality**:
- Detailed performance metrics
- Match-by-match analysis
- Position heatmap data
- Performance trends
- Comparative analysis

**Technical Details**:
- Advanced metrics calculation
- Heatmap data processing
- Trend analysis
- Performance aggregation

#### Player Comparison (`/pages/player-comparison`)
**Functionality**:
- Side-by-side player comparison
- Statistical analysis
- Visual comparison charts
- Scout notes and observations
- Comparison history

**Technical Details**:
- Statistical comparison algorithms
- Visual chart generation
- Scout note system
- Comparison history tracking

### Communication Pages

#### Messaging (`/pages/messaging`)
**Functionality**:
- Real-time messaging
- Conversation management
- Media sharing
- Message status tracking
- Role-based messaging permissions

**Technical Details**:
- Real-time WebSocket communication
- Media upload and sharing
- Message status tracking
- Role-based permissions

---

## 🔧 Business Logic

### Academy Isolation
- All data is filtered by academy ID
- Users can only access data from their academy
- Super admins have cross-academy access
- Scouts have read-only cross-academy access

### Role-Based Access Control
- JWT-based authentication
- Role verification on every request
- Permission-based feature access
- Automatic redirection based on role

### Data Validation
- Input validation on all forms
- Server-side validation on all APIs
- Email format validation
- Password strength requirements
- Required field validation

### Email System
- Email verification for new users
- Password recovery emails
- Notification emails
- Academy registration approval emails

### Notification System
- Real-time notifications
- Email notifications
- In-app notification display
- Notification categorization

---

## 🔗 Integration Points

### Database Integration
- Prisma ORM for database operations
- MySQL database
- Connection pooling
- Transaction management

### Authentication Integration
- JWT token system
- bcrypt password hashing
- Email verification system
- Session management

### Email Integration
- Nodemailer for email sending
- SMTP configuration
- Email templates
- Delivery tracking

### File Upload Integration
- Profile photo uploads
- Document sharing in messaging
- Video upload for AI analysis
- File type validation

### Real-time Integration
- WebSocket for messaging
- Real-time notifications
- Live updates
- Connection management

---

## 🏗️ Technical Architecture

### Frontend Architecture
- Next.js 13+ with App Router
- React 18 with hooks
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design

### Backend Architecture
- Next.js API routes
- Prisma ORM
- MySQL database
- JWT authentication
- RESTful API design

### Security Architecture
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Performance Architecture
- Database indexing
- Connection pooling
- Caching strategies
- Optimized queries
- Lazy loading

### Deployment Architecture
- Vercel deployment
- Environment variable management
- Database migration system
- Error monitoring
- Performance monitoring

---

## 📊 System Statistics

### Database Models: 12
### API Endpoints: 50+
### Frontend Pages: 32
### User Roles: 5
### Core Modules: 12
### Integration Points: 5

---

## 🚀 Future Enhancements

### Planned Features
- Mobile app development
- Advanced AI analytics
- Video analysis integration
- Payment system integration
- Multi-language support
- Advanced reporting system

### Technical Improvements
- Performance optimization
- Caching implementation
- Real-time data synchronization
- Advanced security features
- API rate limiting
- Monitoring and logging

---

This comprehensive catalog provides a complete overview of the Quick Touch Academy system, including all modules, functionality, technical details, and business logic. It serves as a complete reference for developers, stakeholders, and users of the system.
