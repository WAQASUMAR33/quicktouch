# Quick Touch Academy - Detailed Page-by-Page Functionality Catalog

## 📋 Table of Contents
1. [Authentication Pages](#authentication-pages)
2. [Dashboard Pages](#dashboard-pages)
3. [Management Pages](#management-pages)
4. [Analytics & Insights Pages](#analytics--insights-pages)
5. [Communication Pages](#communication-pages)
6. [Development & Testing Pages](#development--testing-pages)
7. [Legacy Pages](#legacy-pages)

---

## 🔐 Authentication Pages

### 1. **Home Page (`/`)**
**File**: `src/app/page.js`
**Purpose**: Application entry point and automatic redirection
**Functionality**:
- **Automatic Redirect**: Immediately redirects users to `/login` page
- **Entry Point**: Serves as the main landing page for the application
- **No User Interface**: Pure redirection logic with no visible content

**Elements**:
- `redirect('/login')` - Next.js redirect function that sends users to login page

---

### 2. **Login Page (`/login`)**
**File**: `src/app/login/page.js`
**Purpose**: User authentication and role-based redirection
**Functionality**:
- **User Authentication**: Validates email and password credentials
- **Form Validation**: Checks email format and required fields
- **JWT Token Management**: Stores authentication token and user data in localStorage
- **Role-Based Redirection**: Automatically redirects users based on their role
- **Password Visibility Toggle**: Allows users to show/hide password
- **Remember Me**: Checkbox for session persistence (UI only)
- **Error Handling**: Displays authentication errors with visual feedback

**Elements**:
- **Background**: Gradient background with subtle pattern overlay
- **Glass Card**: Semi-transparent card with backdrop blur effect
- **Logo Section**: Academy logo and branding
- **Email Input**: Email field with icon and validation
- **Password Input**: Password field with show/hide toggle
- **Remember Me Checkbox**: Session persistence option
- **Forgot Password Link**: Links to password recovery (placeholder)
- **Login Button**: Primary action button with loading state
- **Sign Up Link**: Navigation to registration page
- **Error Display**: Red error message container with icon

**Technical Details**:
- Form submission with API call to `/api/login`
- JWT token storage in localStorage
- Automatic redirection based on user role:
  - `admin` → `/pages/academy-dashboard`
  - `super_admin` → `/pages/dashboard`
  - `coach` → `/pages/coach-dashboard`
  - Others → `/pages/dashboard`

---

### 3. **Register Page (`/register`)**
**File**: `src/app/register/page.js`
**Purpose**: User and academy registration with two-tab interface
**Functionality**:
- **Dual Registration**: Separate tabs for user and academy registration
- **Two-Column Layout**: Responsive form layout for better UX
- **User Registration**: Individual user signup with role selection
- **Academy Registration**: Academy signup with approval workflow
- **Form Validation**: Comprehensive validation for all fields
- **Email Verification**: Integration with email verification system
- **Academy Selection**: Dropdown for existing academies during user signup
- **Password Confirmation**: Password matching validation

**Elements**:
- **Tab Navigation**: Switch between User and Academy registration
- **User Registration Form**:
  - **Left Column**: Full Name, Email, Phone fields
  - **Right Column**: Role selection, Academy selection, Password fields
  - **Role Dropdown**: Player, Coach, Scout options
  - **Academy Dropdown**: Dynamic list of available academies
  - **Password Fields**: Password and confirm password with visibility toggle
- **Academy Registration Form**:
  - **Left Column**: Academy Name, Location, Contact Email, Contact Person, Password
  - **Right Column**: Description, Contact Phone, Contact Person Phone, Confirm Password
  - **Description Textarea**: Multi-line academy description
- **Submit Buttons**: Role-specific submission buttons with loading states
- **Loading States**: Spinner animations during form submission
- **Error Handling**: Field-specific error messages

**Technical Details**:
- Two-column responsive grid layout (`grid-cols-1 md:grid-cols-2`)
- Dynamic academy loading from API
- Form state management with React hooks
- API integration for both user and academy creation
- Email verification token generation

---

## 🏠 Dashboard Pages

### 4. **Main Dashboard (`/pages/dashboard`)**
**File**: `src/app/pages/dashboard/page.js`
**Purpose**: Super admin system overview and management hub
**Functionality**:
- **System Overview**: Displays system-wide statistics and metrics
- **Role-Based Access**: Only accessible to super_admin users
- **Automatic Redirection**: Redirects other roles to appropriate dashboards
- **Real-Time Statistics**: Fetches live data from multiple APIs
- **Quick Actions**: Direct links to key management functions
- **Recent Activity**: Shows system activity feed
- **Academy Information**: Displays academy details and status

**Elements**:
- **Welcome Header**: Gradient header with logo and user information
  - **Logo Display**: Academy logo with branding
  - **User Greeting**: Personalized welcome message
  - **Role Display**: Shows user role and privileges
- **Statistics Cards**: Four key metric cards
  - **Total Players**: Count of all registered players
  - **Total Coaches**: Count of all coaches in the system
  - **Total Matches**: Count of scheduled matches
  - **Total Events**: Count of all events and training sessions
- **Quick Actions Grid**: Two-column action buttons
  - **Manage Players**: Link to player management
  - **Schedule Events**: Link to event management
  - **Messages**: Link to messaging system
  - **Compare Players**: Link to player comparison tools
- **Recent Activity Feed**: Timeline of recent system activities
  - **Activity Items**: Individual activity entries with timestamps
  - **Status Indicators**: Color-coded activity types
- **Academy Information Panel**: Academy details display
  - **Academy Name**: Current academy name
  - **Location**: Academy location
  - **Established Date**: Academy founding date

**Technical Details**:
- Fetches data from `/api/setup`, `/api/players_management`, `/api/event_management`
- Role verification and automatic redirection
- Real-time statistics calculation
- Error handling with user feedback

---

### 5. **Academy Dashboard (`/pages/academy-dashboard`)**
**File**: `src/app/pages/academy-dashboard/page.js`
**Purpose**: Academy-specific management dashboard for admins
**Functionality**:
- **Academy Overview**: Displays academy-specific statistics
- **Admin Access**: Restricted to admin role users
- **Academy Metrics**: Shows academy-specific data and performance
- **Management Tools**: Quick access to academy management functions
- **User Management**: Academy user overview and management
- **Event Overview**: Academy events and training sessions

**Elements**:
- **Academy Header**: Academy branding and information
- **Statistics Dashboard**: Academy-specific metrics
- **Quick Actions**: Academy management tools
- **User Overview**: Academy user statistics
- **Event Calendar**: Upcoming academy events
- **Performance Metrics**: Academy performance indicators

**Technical Details**:
- Academy-filtered data display
- Admin role verification
- Academy-specific API calls
- Real-time data updates

---

### 6. **Coach Dashboard (`/pages/coach-dashboard`)**
**File**: `src/app/pages/coach-dashboard/page.js`
**Purpose**: Coach-specific dashboard with training and player management tools
**Functionality**:
- **Coach Overview**: Personalized dashboard for coaches
- **Player Management**: Quick access to player information
- **Training Programs**: Training session management
- **Event Scheduling**: Event and match scheduling tools
- **Performance Tracking**: Player performance monitoring
- **Communication Tools**: Messaging and feedback systems

**Elements**:
- **Welcome Header**: Personalized coach greeting
- **Statistics Grid**: Four key coach metrics
  - **Total Players**: Number of players under coach
  - **Training Programs**: Active training programs
  - **Upcoming Events**: Scheduled events and matches
  - **Attendance Rate**: Player attendance percentage
- **Quick Actions**: Coach-specific action buttons
  - **Manage Players**: Player management interface
  - **Training Programs**: Training session tools
  - **Events & Matches**: Event scheduling
  - **AI Insights**: Player analysis tools
- **Recent Activities**: Coach activity timeline
- **Player Analysis Tools**: Advanced player analytics
  - **Player Comparison**: Side-by-side player analysis
  - **Advanced Statistics**: Detailed performance metrics
- **Communication Section**: Messaging and feedback tools
  - **Messaging**: Direct communication with players
  - **Attendance Management**: Attendance tracking tools

**Technical Details**:
- Coach role verification and access control
- Academy-specific data filtering
- Real-time statistics from multiple APIs
- Integration with training and event management systems

---

## 👥 Management Pages

### 7. **User Management (`/pages/users`)**
**File**: `src/app/pages/users/page.js`
**Purpose**: Comprehensive user lifecycle management and administration
**Functionality**:
- **User CRUD Operations**: Create, read, update, delete users
- **Role Management**: Assign and modify user roles
- **Email Verification**: Manage email verification status
- **Pagination**: Handle large user lists with pagination
- **Search and Filter**: Find users by various criteria
- **Bulk Operations**: Perform actions on multiple users
- **User Status Tracking**: Monitor user activity and status

**Elements**:
- **Page Header**: Title and add user button
  - **Add New User Button**: Opens user creation modal
- **User Table**: Comprehensive user listing
  - **ID Column**: Unique user identifier
  - **Email Column**: User email address
  - **Name Column**: User full name
  - **Role Column**: User role (admin, coach, player, scout, super_admin)
  - **Email Verified Column**: Verification status
  - **Actions Column**: Edit and delete buttons
- **Pagination Controls**: Navigate through user pages
  - **Page Numbers**: Clickable page number buttons
  - **Active Page Highlighting**: Current page indication
- **User Creation/Edit Modal**: Popup form for user management
  - **Email Field**: User email input with validation
  - **Name Field**: User full name input
  - **Password Field**: Password input with confirmation
  - **Role Dropdown**: Role selection with all available roles
  - **Email Verified Checkbox**: Verification status toggle
  - **Save/Cancel Buttons**: Form action buttons
- **Error Display**: Error message container
- **Loading States**: Spinner during data operations

**Technical Details**:
- API integration with `/api/users` endpoints
- Form validation and error handling
- Role-based access control
- Real-time data updates after operations
- Pagination with configurable items per page (5 items)

---

### 8. **Players Management (`/pages/players_management`)**
**File**: `src/app/pages/players_management/page.js`
**Purpose**: Comprehensive player profile and performance management
**Functionality**:
- **Player Profiles**: Complete player information management
- **Performance Tracking**: Player statistics and metrics
- **Position Management**: Player position and role assignment
- **Academy Integration**: Academy-specific player filtering
- **Player Statistics**: Position-based player analytics
- **CRUD Operations**: Full player lifecycle management

**Elements**:
- **Page Header**: Title and add player button
  - **Add New Player Button**: Links to player creation page
- **Player Grid**: Card-based player display
  - **Player Cards**: Individual player information cards
    - **Avatar**: Player initial in colored circle
    - **Player Name**: Full name display
    - **Age and Position**: Key player information
    - **Height**: Player physical attributes
    - **Join Date**: Player registration date
    - **Action Buttons**: View, Edit, Delete options
- **Empty State**: When no players exist
  - **Empty State Icon**: Visual placeholder
  - **Empty State Message**: Encouraging message
  - **Add First Player Button**: Call-to-action button
- **Player Statistics Panel**: Summary statistics
  - **Total Players**: Overall player count
  - **Position Breakdown**: Forwards, Midfielders, Defenders counts
  - **Color-coded Metrics**: Different colors for each position

**Technical Details**:
- API integration with `/api/players_management`
- Academy-based data filtering
- Real-time statistics calculation
- Responsive grid layout
- Error handling and loading states

---

### 9. **Training Programs (`/pages/training_programs`)**
**File**: `src/app/pages/training_programs/page.js`
**Purpose**: Training session planning and program management
**Functionality**:
- **Program Creation**: Create new training programs
- **Coach Assignment**: Assign programs to specific coaches
- **Schedule Management**: Date and time scheduling
- **Program Statistics**: Training program analytics
- **Role-Based Access**: Coach and admin access control
- **Program Details**: Detailed program information display

**Elements**:
- **Page Header**: Title and create program button
  - **Create New Program Button**: Role-restricted creation button
- **Program Grid**: Card-based program display
  - **Program Cards**: Individual program information
    - **Program Title**: Training program name
    - **Description**: Program description with text truncation
    - **Training Badge**: Program type indicator
    - **Date Display**: Program scheduled date
    - **Coach Information**: Assigned coach name
    - **Action Buttons**: View, Edit, Delete options
- **Empty State**: When no programs exist
  - **Empty State Icon**: Visual placeholder
  - **Empty State Message**: Encouraging message
  - **Create First Program Button**: Role-restricted CTA
- **Training Statistics Panel**: Program analytics
  - **Total Programs**: Overall program count
  - **Upcoming Programs**: Future program count
  - **Completed Programs**: Past program count
  - **Programs with Drills**: Programs with detailed drill information

**Technical Details**:
- API integration with `/api/training_programs`
- Role-based access control (coach/admin only)
- Date-based filtering and statistics
- Academy-specific data filtering
- Real-time data updates

---

### 10. **Event Management (`/pages/event_management`)**
**File**: `src/app/pages/event_management/page.js`
**Purpose**: Event and match scheduling and management
**Functionality**:
- **Event Creation**: Create training events and matches
- **Tab Navigation**: Switch between events and matches
- **Event Types**: Different event type management
- **Location Management**: Event location tracking
- **Schedule Overview**: Calendar view of events
- **Event Statistics**: Event analytics and reporting

**Elements**:
- **Page Header**: Title and action buttons
  - **Add New Event Button**: Create training events
  - **Schedule Match Button**: Create competitive matches
- **Tab Navigation**: Switch between event types
  - **Events & Training Tab**: Training session management
  - **Matches Tab**: Competitive match management
- **Event Grid**: Card-based event display
  - **Event Cards**: Individual event information
    - **Event Title**: Event name
    - **Description**: Event details
    - **Type Badge**: Color-coded event type
    - **Date Display**: Event scheduled date
    - **Location**: Event venue
    - **Action Buttons**: View, Edit, Delete options
- **Empty States**: When no events exist
  - **Empty State Icons**: Visual placeholders
  - **Empty State Messages**: Encouraging messages
  - **Create First Event Buttons**: Call-to-action buttons
- **Calendar View**: Upcoming schedule display
  - **Calendar Placeholder**: Future calendar integration

**Technical Details**:
- API integration with `/api/event_management`
- Tab-based navigation system
- Event type filtering and categorization
- Date-based event organization
- Location tracking and management

---

## 📊 Analytics & Insights Pages

### 11. **AI Insights (`/pages/ai-insights`)**
**File**: `src/app/pages/ai-insights/page.js`
**Purpose**: AI-powered player analysis and performance insights
**Functionality**:
- **Player Selection**: Choose player for AI analysis
- **AI Dashboard**: Comprehensive AI insights display
- **Performance Analysis**: AI-generated performance metrics
- **Training Recommendations**: AI-suggested training improvements
- **Video Analysis**: AI video processing and analysis
- **Confidence Scoring**: AI prediction confidence levels

**Elements**:
- **Page Header**: Title and user information
  - **User Role Display**: Shows current user role
- **Player Selection Panel**: For non-player users
  - **Player Dropdown**: Select player for analysis
  - **Player Information**: Age and position display
- **AI Insights Dashboard**: Main analysis interface
  - **AIInsightsDashboard Component**: Comprehensive AI analysis
  - **Performance Metrics**: AI-calculated performance data
  - **Training Recommendations**: AI-suggested improvements
  - **Video Analysis**: AI video processing results
- **Empty States**: When no player selected
  - **Player Selection Prompt**: Encourages player selection
  - **No Profile Message**: For players without profiles

**Technical Details**:
- API integration with `/api/ai-insights`
- Player-specific data filtering
- Role-based access control
- AI analysis integration
- Real-time insight updates

---

### 12. **Player Comparison (`/pages/player-comparison`)**
**File**: `src/app/pages/player-comparison/page.js`
**Purpose**: Scout tools for side-by-side player analysis
**Functionality**:
- **Scout Access**: Restricted to scout and admin roles
- **Player Comparison**: Side-by-side player analysis
- **Statistical Analysis**: Comprehensive performance metrics
- **Visual Charts**: Graphical comparison displays
- **Scout Notes**: Observation and note-taking system
- **Comparison History**: Track comparison records

**Elements**:
- **Page Header**: Title and user information
- **Tab Navigation**: Switch between comparison modes
  - **Create Tab**: New comparison creation
  - **List Tab**: Existing comparisons
- **Player Comparison Form**: Comparison creation interface
  - **Player Selection**: Choose players to compare
  - **Comparison Criteria**: Select comparison metrics
  - **Scout Notes**: Add observations and notes
- **Comparison List**: Existing comparisons display
  - **Comparison Cards**: Individual comparison records
  - **Comparison Results**: Statistical comparison data
  - **Action Buttons**: View, Edit, Delete options

**Technical Details**:
- Role-based access control (scout/admin only)
- API integration with `/api/player-comparison`
- Statistical analysis algorithms
- Visual chart generation
- Comparison history tracking

---

### 13. **Advanced Statistics (`/pages/advanced-stats`)**
**File**: `src/app/pages/advanced-stats/page.js`
**Purpose**: Detailed player performance analytics and metrics
**Functionality**:
- **Performance Metrics**: Detailed statistical analysis
- **Match Analysis**: Match-by-match performance breakdown
- **Position Heatmaps**: Visual position data
- **Trend Analysis**: Performance trend tracking
- **Comparative Analysis**: Player performance comparison
- **Data Visualization**: Charts and graphs for metrics

**Elements**:
- **Statistics Dashboard**: Main analytics interface
- **Performance Charts**: Visual data representation
- **Match Breakdown**: Individual match analysis
- **Heatmap Display**: Position-based performance data
- **Trend Graphs**: Performance over time
- **Filter Options**: Data filtering and sorting

**Technical Details**:
- API integration with `/api/advanced-stats`
- Advanced statistical calculations
- Data visualization components
- Performance trend analysis
- Real-time metric updates

---

## 💬 Communication Pages

### 14. **Messaging (`/pages/messaging`)**
**File**: `src/app/pages/messaging/page.js`
**Purpose**: Real-time communication between users
**Functionality**:
- **Real-Time Messaging**: Live chat functionality
- **Conversation Management**: Manage chat conversations
- **Role-Based Permissions**: Messaging based on user roles
- **Media Sharing**: Share images and documents
- **Message Status**: Read/unread message tracking
- **Notification Integration**: Message notifications

**Elements**:
- **Page Header**: Title and user information
- **Messaging App**: Main chat interface
  - **Conversation List**: List of active conversations
  - **Message Display**: Chat message area
  - **Message Input**: Text input for new messages
  - **Media Upload**: File and image sharing
  - **User Selection**: Choose conversation participants

**Technical Details**:
- Real-time WebSocket communication
- Role-based messaging permissions
- Media upload and sharing
- Message status tracking
- Notification system integration

---

## 🧪 Development & Testing Pages

### 15. **LocalStorage Test (`/pages/localstorage-test`)**
**File**: `src/app/pages/localstorage-test/page.js`
**Purpose**: Testing localStorage functionality and debugging
**Functionality**:
- **LocalStorage Testing**: Test browser storage functionality
- **Token Debugging**: Debug authentication tokens
- **Data Persistence**: Test data storage and retrieval
- **Browser Compatibility**: Test across different browsers
- **Debug Information**: Display stored data for debugging

**Elements**:
- **Test Interface**: LocalStorage testing tools
- **Data Display**: Show stored data
- **Test Buttons**: Perform storage operations
- **Debug Information**: Technical debugging data

**Technical Details**:
- Browser storage API testing
- Authentication token debugging
- Data persistence validation
- Cross-browser compatibility testing

---

## 🏢 Legacy Pages

### 16. **Legacy Business Pages**
**Files**: Various legacy business management pages
**Purpose**: Legacy business management functionality (unused)
**Functionality**:
- **Sales Management**: Legacy sales tracking
- **Dealer Management**: Dealer relationship management
- **Supplier Management**: Supplier information management
- **Product Management**: Product catalog management
- **Tax Management**: Tax calculation and reporting
- **Transaction Management**: Financial transaction tracking

**Elements**:
- **Legacy Forms**: Old business management forms
- **Data Tables**: Legacy data display
- **Business Logic**: Outdated business processes
- **Legacy UI**: Old user interface components

**Technical Details**:
- Legacy business logic
- Outdated data models
- Unused functionality
- Historical code preservation

---

## 🔧 Common Page Elements

### **Layout Components**
- **Sidebar**: Role-based navigation menu
- **Navbar**: Top navigation bar with user info
- **AuthContext**: Authentication state management
- **Page Layout**: Consistent page structure wrapper

### **Common UI Elements**
- **Loading Spinners**: Consistent loading indicators
- **Error Messages**: Standardized error display
- **Success Messages**: Success notification system
- **Form Validation**: Input validation and feedback
- **Modal Dialogs**: Popup forms and confirmations
- **Data Tables**: Consistent table styling
- **Action Buttons**: Standardized button components
- **Status Badges**: Color-coded status indicators

### **Technical Features**
- **Responsive Design**: Mobile-friendly layouts
- **Role-Based Access**: Permission-based functionality
- **Real-Time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations
- **Form Validation**: Client and server-side validation
- **API Integration**: RESTful API communication
- **State Management**: React state and context management

---

## 📱 Page Navigation Flow

### **Authentication Flow**
1. **Home (`/`)** → **Login (`/login`)**
2. **Login** → **Role-based Dashboard**
3. **Register (`/register`)** → **Email Verification** → **Login**

### **Dashboard Flow**
1. **Login** → **Main Dashboard** (Super Admin)
2. **Login** → **Academy Dashboard** (Admin)
3. **Login** → **Coach Dashboard** (Coach)

### **Management Flow**
1. **Dashboard** → **User Management** → **User CRUD**
2. **Dashboard** → **Players Management** → **Player CRUD**
3. **Dashboard** → **Training Programs** → **Program CRUD**
4. **Dashboard** → **Event Management** → **Event CRUD**

### **Analytics Flow**
1. **Dashboard** → **AI Insights** → **Player Analysis**
2. **Dashboard** → **Player Comparison** → **Scout Analysis**
3. **Dashboard** → **Advanced Stats** → **Performance Metrics**

### **Communication Flow**
1. **Dashboard** → **Messaging** → **Real-time Chat**

---

This detailed catalog provides comprehensive information about each page's purpose, functionality, elements, and technical implementation, serving as a complete reference for developers, users, and stakeholders.
