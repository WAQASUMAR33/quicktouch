# Quick Touch Academy - Page Catalog

## Overview
This document provides a comprehensive catalog of all pages in the Quick Touch Academy application, organized by functionality and user roles.

---

## 🔐 Authentication Pages

### 1. **Login Page** (`/login`)
- **File**: `src/app/login/page.js`
- **Purpose**: User authentication and login
- **Features**:
  - Email/password login
  - Role-based redirection after login
  - Remember me functionality
  - Forgot password link
- **Access**: Public
- **Redirects**: 
  - Super Admin → `/pages/dashboard`
  - Admin → `/pages/academy-dashboard`
  - Coach → `/pages/coach-dashboard`
  - Others → `/pages/dashboard`

### 2. **Register Page** (`/register`)
- **File**: `src/app/register/page.js`
- **Purpose**: User and academy registration
- **Features**:
  - Two-tab interface (User Signup / Academy Registration)
  - Two-column responsive layout
  - User signup with role selection
  - Academy registration with approval workflow
  - Email verification
- **Access**: Public

### 3. **Forgot Password Page** (`/forgot-password`)
- **File**: `src/app/forgot-password/page.js`
- **Purpose**: Password recovery
- **Features**: Email-based password reset
- **Access**: Public

---

## 🏠 Dashboard Pages

### 4. **Main Dashboard** (`/pages/dashboard`)
- **File**: `src/app/pages/dashboard/page.js`
- **Purpose**: Super admin dashboard
- **Features**:
  - System-wide statistics
  - Academy management overview
  - User management access
  - Global analytics
- **Access**: Super Admin only
- **Redirects**: Other roles to their respective dashboards

### 5. **Academy Dashboard** (`/pages/academy-dashboard`)
- **File**: `src/app/pages/academy-dashboard/page.js`
- **Purpose**: Academy admin dashboard
- **Features**:
  - Academy-specific statistics
  - Player management
  - Event management
  - Academy settings
- **Access**: Admin role

### 6. **Coach Dashboard** (`/pages/coach-dashboard`)
- **File**: `src/app/pages/coach-dashboard/page.js`
- **Purpose**: Coach-specific dashboard
- **Features**:
  - Player statistics
  - Training program management
  - Upcoming events
  - Quick actions for coaches
- **Access**: Coach role

---

## 👥 User Management Pages

### 7. **User Management** (`/pages/users`)
- **File**: `src/app/pages/users/page.js`
- **Purpose**: Manage system users
- **Features**:
  - User listing with pagination
  - Add/edit/delete users
  - Role management (super_admin, admin, coach, player, scout)
  - Email verification status
  - Academy filtering
- **Access**: Admin, Coach, Super Admin

---

## 🏢 Academy Management Pages

### 8. **Academy Management** (`/pages/academy_management`)
- **File**: `src/app/pages/academy_management/page.js`
- **Purpose**: Manage academies
- **Features**:
  - Academy listing
  - Academy details
  - Academy settings
  - Multi-academy support
- **Access**: Super Admin

### 9. **Admin Approvals** (`/pages/admin-approvals`)
- **File**: `src/app/pages/admin-approvals/page.js`
- **Purpose**: Approve academy registrations
- **Features**:
  - Pending academy approvals
  - Approval/rejection workflow
  - Academy verification
- **Access**: Super Admin

---

## ⚽ Player Management Pages

### 10. **Players Management** (`/pages/players_management`)
- **File**: `src/app/pages/players_management/page.js`
- **Purpose**: Manage players
- **Features**:
  - Player listing
  - Player profiles
  - Statistics tracking
  - Performance metrics
- **Access**: Admin, Coach, Scout

### 11. **Add New Player** (`/pages/players_management/new`)
- **File**: `src/app/pages/players_management/new/page.js`
- **Purpose**: Add new players
- **Features**:
  - Player registration form
  - Profile creation
  - Academy assignment
- **Access**: Admin, Coach

### 12. **Player Details** (`/pages/players_management/[id]`)
- **File**: `src/app/pages/players_management/[id]/page.js`
- **Purpose**: Individual player details
- **Features**:
  - Player profile view
  - Statistics display
  - Performance history
  - Edit capabilities
- **Access**: Admin, Coach, Scout

---

## 📊 Analytics & Insights Pages

### 13. **AI Insights** (`/pages/ai-insights`)
- **File**: `src/app/pages/ai-insights/page.js`
- **Purpose**: AI-powered player insights
- **Features**:
  - Player performance analysis
  - Predictive analytics
  - AI recommendations
  - Performance trends
- **Access**: All roles

### 14. **Advanced Stats** (`/pages/advanced-stats`)
- **File**: `src/app/pages/advanced-stats/page.js`
- **Purpose**: Advanced player statistics
- **Features**:
  - Detailed statistics
  - Performance metrics
  - Comparative analysis
  - Historical data
- **Access**: All roles

### 15. **Player Comparison** (`/pages/player-comparison`)
- **File**: `src/app/pages/player-comparison/page.js`
- **Purpose**: Compare players
- **Features**:
  - Side-by-side comparison
  - Statistical analysis
  - Performance metrics
  - Scout tools
- **Access**: Scout, Admin

---

## 🏆 Training & Events Pages

### 16. **Training Programs** (`/pages/training_programs`)
- **File**: `src/app/pages/training_programs/page.js`
- **Purpose**: Manage training programs
- **Features**:
  - Training program listing
  - Create/edit programs
  - Coach assignments
  - Program scheduling
- **Access**: Coach, Admin

### 17. **Event Management** (`/pages/event_management`)
- **File**: `src/app/pages/event_management/page.js`
- **Purpose**: Manage events and matches
- **Features**:
  - Event listing
  - Match scheduling
  - Event details
  - Calendar view
- **Access**: Coach, Admin

### 18. **New Event** (`/pages/event_management/new`)
- **File**: `src/app/pages/event_management/new/page.js`
- **Purpose**: Create new events
- **Features**:
  - Event creation form
  - Date/time selection
  - Participant management
- **Access**: Coach, Admin

### 19. **New Match** (`/pages/event_management/match/new`)
- **File**: `src/app/pages/event_management/match/new/page.js`
- **Purpose**: Create new matches
- **Features**:
  - Match creation form
  - Team selection
  - Match details
- **Access**: Coach, Admin

### 20. **Attendance Management** (`/pages/attandance_management`)
- **File**: `src/app/pages/attandance_management/page.js`
- **Purpose**: Track attendance
- **Features**:
  - Attendance tracking
  - Player check-in/out
  - Attendance reports
  - Statistics
- **Access**: Coach, Admin

---

## 💬 Communication Pages

### 21. **Messaging** (`/pages/messaging`)
- **File**: `src/app/pages/messaging/page.js`
- **Purpose**: Internal messaging system
- **Features**:
  - Real-time messaging
  - Group conversations
  - File sharing
  - Message history
- **Access**: All roles

---

## 🧪 Development & Testing Pages

### 22. **LocalStorage Test** (`/pages/localstorage-test`)
- **File**: `src/app/pages/localstorage-test/page.js`
- **Purpose**: Test localStorage functionality
- **Features**: Development testing tools
- **Access**: Development only

### 23. **Token Debug** (`/pages/token-debug`)
- **File**: `src/app/pages/token-debug/page.js`
- **Purpose**: Debug authentication tokens
- **Features**: Token validation testing
- **Access**: Development only

### 24. **Dashboard Test** (`/pages/dashboard-test`)
- **File**: `src/app/pages/dashboard-test/page.js`
- **Purpose**: Test dashboard functionality
- **Features**: Dashboard testing tools
- **Access**: Development only

---

## 🏪 Legacy Business Pages (Unused)

### 25. **Sale List** (`/pages/sale_list`)
- **File**: `src/app/pages/sale_list/page.js`
- **Purpose**: Legacy sales management
- **Status**: Unused in current academy system

### 26. **Dealer Management** (`/pages/dealer_management`)
- **File**: `src/app/pages/dealer_management/page.js`
- **Purpose**: Legacy dealer management
- **Status**: Unused in current academy system

### 27. **Supplier Management** (`/pages/supplier_management`)
- **File**: `src/app/pages/supplier_management/page.js`
- **Purpose**: Legacy supplier management
- **Status**: Unused in current academy system

### 28. **Product Management** (`/pages/product_management`)
- **File**: `src/app/pages/product_management/page.js`
- **Purpose**: Legacy product management
- **Status**: Unused in current academy system

### 29. **Tax Management** (`/pages/tax_management`)
- **File**: `src/app/pages/tax_management/page.js`
- **Purpose**: Legacy tax management
- **Status**: Unused in current academy system

### 30. **Supplier Transactions** (`/pages/sup_trnx`)
- **File**: `src/app/pages/sup_trnx/page.js`
- **Purpose**: Legacy supplier transactions
- **Status**: Unused in current academy system

### 31. **Dealer Transactions** (`/pages/dealer_trnx`)
- **File**: `src/app/pages/dealer_trnx/page.js`
- **Purpose**: Legacy dealer transactions
- **Status**: Unused in current academy system

---

## 🏠 Root Page

### 32. **Home Page** (`/`)
- **File**: `src/app/page.js`
- **Purpose**: Application entry point
- **Features**: Redirects to login page
- **Access**: Public

---

## 🗺️ Page Structure Diagram

```
Quick Touch Academy Application Structure

┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC PAGES                             │
├─────────────────────────────────────────────────────────────┤
│  / (Home) → /login                                          │
│  /login (Authentication)                                    │
│  /register (User & Academy Registration)                    │
│  /forgot-password (Password Recovery)                       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                AUTHENTICATED PAGES                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   SUPER ADMIN   │  │     ADMIN       │  │    COACH     │ │
│  │                 │  │                 │  │              │ │
│  │ /dashboard      │  │ /academy-       │  │ /coach-      │ │
│  │ /academy_       │  │ dashboard       │  │ dashboard    │ │
│  │ management      │  │ /users          │  │ /players_    │ │
│  │ /admin-         │  │ /players_       │  │ management   │ │
│  │ approvals       │  │ management      │  │ /training_   │ │
│  │                 │  │ /training_      │  │ programs     │ │
│  │                 │  │ programs        │  │ /event_      │ │
│  │                 │  │ /event_         │  │ management   │ │
│  │                 │  │ management      │  │ /attendance_ │ │
│  │                 │  │ /attendance_    │  │ management   │ │
│  │                 │  │ management      │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     PLAYER      │  │     SCOUT       │  │   SHARED     │ │
│  │                 │  │                 │  │              │ │
│  │ /dashboard      │  │ /dashboard      │  │ /ai-insights │ │
│  │ /messaging      │  │ /players_       │  │ /advanced-   │ │
│  │ /ai-insights    │  │ management      │  │ stats        │ │
│  │ /advanced-      │  │ /player-        │  │ /messaging   │ │
│  │ stats           │  │ comparison      │  │              │ │
│  │                 │  │ /ai-insights    │  │              │ │
│  │                 │  │ /advanced-      │  │              │ │
│  │                 │  │ stats           │  │              │ │
│  │                 │  │ /messaging      │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                DEVELOPMENT PAGES                            │
├─────────────────────────────────────────────────────────────┤
│  /localstorage-test  /token-debug  /dashboard-test          │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                LEGACY PAGES (Unused)                        │
├─────────────────────────────────────────────────────────────┤
│  /sale_list  /dealer_management  /supplier_management       │
│  /product_management  /tax_management  /sup_trnx            │
│  /dealer_trnx                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Page Access Summary

### **Public Access**
- Login (`/login`)
- Register (`/register`)
- Forgot Password (`/forgot-password`)
- Home (`/`)

### **Super Admin Only**
- Main Dashboard (`/pages/dashboard`)
- Academy Management (`/pages/academy_management`)
- Admin Approvals (`/pages/admin-approvals`)

### **Admin & Coach**
- Academy Dashboard (`/pages/academy-dashboard`)
- User Management (`/pages/users`)
- Players Management (`/pages/players_management`)
- Training Programs (`/pages/training_programs`)
- Event Management (`/pages/event_management`)
- Attendance Management (`/pages/attandance_management`)

### **Coach Only**
- Coach Dashboard (`/pages/coach-dashboard`)

### **All Authenticated Users**
- AI Insights (`/pages/ai-insights`)
- Advanced Stats (`/pages/advanced-stats`)
- Messaging (`/pages/messaging`)

### **Scout & Admin**
- Player Comparison (`/pages/player-comparison`)

### **Development Only**
- LocalStorage Test (`/pages/localstorage-test`)
- Token Debug (`/pages/token-debug`)
- Dashboard Test (`/pages/dashboard-test`)

---

## 🔧 Technical Notes

- All pages use Next.js 13+ App Router
- Authentication is handled via JWT tokens
- Role-based access control is implemented
- Responsive design with Tailwind CSS
- Real-time features using WebSocket connections
- File uploads supported for player profiles and documents

---

## 📝 Maintenance Notes

- Legacy business pages (25-31) can be removed in future cleanup
- Development pages (22-24) should be removed in production
- All pages include proper error handling and loading states
- SEO optimization implemented where applicable
- Accessibility features included in all user-facing pages
