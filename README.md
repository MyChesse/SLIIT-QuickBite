# SLIIT-QuickBite - Canteen Management System

A complete MERN stack Canteen Management System with a comprehensive Support module for feedback and complaints management.

## Features

### Support Module
- **Feedback System**: Users can submit feedback with ratings, categories, and detailed messages
- **Complaint System**: Users can file complaints with photo uploads, priority levels, and tracking
- **Complaint Tracking**: Users can track their complaint status using complaint ID
- **Admin Dashboard**: Admin can view, filter, manage feedback and complaints
- **Status Management**: Admin can update complaint status and add replies

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, Multer
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer for image uploads

## Project Structure

```
SLIIT-QuickBite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── feedbackController.js
│   │   │   └── complaintController.js
│   │   ├── middleware/
│   │   │   ├── upload.js          # Multer configuration
│   │   │   └── errorHandler.js    # Error handling
│   │   ├── models/
│   │   │   ├── Feedback.js
│   │   │   └── Complaint.js
│   │   ├── routes/
│   │   │   ├── feedbackRoutes.js
│   │   │   └── complaintRoutes.js
│   │   └── server.js              # Express server setup
│   ├── uploads/                   # Uploaded complaint images
│   ├── .env                       # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FeedbackForm.jsx
    │   │   └── ComplaintForm.jsx
    │   ├── pages/
    │   │   ├── SupportPage.jsx
    │   │   ├── ComplaintTracker.jsx
    │   │   ├── AdminFeedbackPage.jsx
    │   │   └── AdminComplaintsPage.jsx
    │   ├── services/
    │   │   └── api.js              # Axios API configuration
    │   ├── App.jsx                 # Main app with routing
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/canteen-management
PORT=5001
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Feedback API
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Get all feedback (admin)
- `GET /api/feedback/:id` - Get feedback by ID
- `DELETE /api/feedback/:id` - Delete feedback (admin)

### Complaint API
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - Get all complaints (admin)
- `GET /api/complaints/:id` - Get complaint by ID (admin)
- `GET /api/complaints/track/:complaintId` - Track complaint by ID (user)
- `PUT /api/complaints/:id/status` - Update complaint status (admin)
- `PUT /api/complaints/:id/reply` - Add reply to complaint (admin)
- `DELETE /api/complaints/:id` - Delete complaint (admin)

## Application Routes

- `/` - Support page (default)
- `/support` - Support page with feedback/complaint forms
- `/track-complaint` - Complaint tracking page
- `/admin/feedback` - Admin feedback management
- `/admin/complaints` - Admin complaint management

## Features Details

### Feedback System
- Name, email, user type (Student/Staff)
- Feedback categories: Food quality, Service, Cleanliness, Pricing, Suggestion
- Rating system (1-5 stars)
- Message field for detailed feedback

### Complaint System
- Auto-generated complaint ID (CMP-1001, CMP-1002, etc.)
- Categories: Food issue, Staff behavior, Delay, Hygiene, Wrong order, Payment issue, Other
- Priority levels: Low, Medium, High
- Optional photo upload (max 5MB)
- Status tracking: Pending, In Review, Resolved, Rejected
- Admin reply functionality

### Admin Features
- View all feedback/complaints with filtering options
- Filter by category, status, priority, user type, rating
- Update complaint status
- Add/edit admin replies
- Delete feedback/complaints
- Summary statistics for feedback

## File Upload
- Complaint photos are stored in `/backend/uploads/`
- Served statically at `/uploads/`
- Max file size: 5MB
- Supported formats: Images only

## Error Handling
- Centralized error handling middleware
- Proper HTTP status codes
- Consistent JSON response format
- Input validation on both frontend and backend

## Running the Application

1. Make sure MongoDB is running
2. Start the backend server (`npm run dev` in backend directory)
3. Start the frontend server (`npm run dev` in frontend directory)
4. Open `http://localhost:5173` in your browser

## Notes
- No authentication implemented (admin pages are accessible to all)
- Plain JSX styling (no CSS frameworks as requested)
- Beginner-friendly code with proper comments
- Fully functional CRUD operations
- RESTful API design