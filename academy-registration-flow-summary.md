# Academy Registration Flow - Complete Implementation

## Overview
The academy registration system has been updated to implement a proper approval workflow where:
1. **Academies register** with their information and admin credentials
2. **Admin reviews** the registration requests
3. **After approval**, academies can login and access their dashboard

## Updated Registration Flow

### 1. Academy Registration Form (`/academy-registration`)
- **Removed**: Admin information section (name, email, phone)
- **Added**: Login credentials section with password fields
- **Fields**:
  - Academy Information: Name, Location, Description, Contact Email, Contact Phone
  - Contact Person: Name and Phone
  - Login Credentials: Password and Confirm Password

### 2. Registration API (`/api/academy-registration`)
- **Validates** all required fields including password
- **Hashes** the password using bcrypt
- **Stores** academy data with status 'pending'
- **Returns** success message indicating admin review process

### 3. Admin Approval System

#### Admin Approvals Page (`/pages/admin-approvals`)
- **Access**: Super admin only
- **Features**:
  - View all pending academy registrations
  - Approve or reject applications
  - Statistics dashboard
  - Real-time updates

#### Admin Approvals API (`/api/admin-approvals`)
- **GET**: Fetch pending academies
- **POST**: Approve/reject specific academy

### 4. Approval Process
When an academy is **approved**:
1. Creates admin user with the **registered password**
2. Updates academy status to 'approved'
3. Links admin user to academy
4. Academy can now login with their credentials

When an academy is **rejected**:
1. Updates academy status to 'rejected'
2. No admin user is created

## Database Changes

### Academy Table Updates
```sql
ALTER TABLE Academy 
ADD COLUMN contactPerson VARCHAR(255),
ADD COLUMN contactPersonPhone VARCHAR(50),
ADD COLUMN adminPassword VARCHAR(255),
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
```

## User Experience

### For Academy Registration:
1. Fill out academy information
2. Provide contact person details
3. Set login password
4. Submit for admin review
5. Receive confirmation that application is under review

### For Admin Review:
1. Access admin approvals page
2. Review academy details
3. Approve or reject applications
4. Approved academies can immediately login

### For Approved Academies:
1. Login with registered email and password
2. Access academy dashboard
3. Manage academy operations

## Security Features
- **Password hashing** using bcrypt
- **Role-based access** control
- **Admin-only** approval system
- **Secure** password storage

## API Endpoints

### Registration
- `POST /api/academy-registration` - Submit academy registration

### Admin Approvals
- `GET /api/admin-approvals` - Get pending academies
- `POST /api/admin-approvals/[id]` - Approve/reject academy

## Files Modified/Created

### Frontend
- `src/app/academy-registration/page.js` - Updated registration form
- `src/app/pages/admin-approvals/page.js` - New admin approval page

### Backend
- `src/app/api/academy-registration/route.js` - Updated registration API
- `src/app/api/admin-approvals/route.js` - New approvals API
- `src/app/api/admin-approvals/[id]/route.js` - New approval action API

### Database
- `scripts/add-academy-fields.js` - Add new fields to Academy table
- `scripts/add-academy-password-field.js` - Add password field

## Testing
- ✅ Academy registration form loads correctly
- ✅ Registration API accepts all required fields
- ✅ Admin approvals API returns pending academies
- ✅ Password is properly hashed and stored
- ✅ Approval process creates admin user with correct password

## Next Steps
1. **Email notifications** for approval/rejection
2. **Email verification** for approved academies
3. **Admin dashboard** integration
4. **Audit logging** for approval actions
