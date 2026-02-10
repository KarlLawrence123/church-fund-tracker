# Church Weekly Fund Tracker

A mobile-first web application for tracking church weekly contributions and expenses. Built with React + Vite and Firebase backend.

## Features

- **Member Management**: Add, edit, and manage church members
- **Contribution Tracking**: Track weekly ₱30 contributions per member
- **Expense Management**: Record and categorize church expenses
- **Financial Dashboard**: Real-time overview of church finances
- **Mobile-First Design**: Responsive UI that works perfectly on all devices
- **Secure Authentication**: Firebase Authentication with email/password
- **Real-time Data**: Live updates using Firestore

## System Requirements

- Weekly contribution: ₱30 per member
- Collection day: Sunday (first day of the week)
- Works 100% on Firebase free (Spark) plan

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Additional**: React Router, date-fns, recharts

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier)
- Git

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd church-funds
npm install --legacy-peer-deps
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "church-fund-tracker"
3. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Hosting

### 3. Configure Firebase

1. In Firebase Console, go to Project Settings
2. Add a Web App and copy the configuration
3. Update `src/firebase/config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Set Up Firestore Rules

1. In Firestore Database, go to Rules tab
2. Replace with the content from `firestore.rules`
3. Publish the rules

### 5. Set Up Firestore Indexes

1. In Firestore Database, go to Indexes tab
2. Create the indexes defined in `firestore.indexes.json`
3. Or use Firebase CLI: `firebase deploy --only firestore:indexes`

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 7. Deploy to Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

## Database Schema

### Collections

#### Users
```javascript
{
  uid: string,
  email: string,
  name: string,
  role: string, // 'member' | 'admin'
  createdAt: timestamp
}
```

#### Members
```javascript
{
  name: string,
  email: string,
  phone: string,
  address: string,
  joinDate: string,
  isActive: boolean,
  createdAt: timestamp
}
```

#### Contributions
```javascript
{
  memberId: string,
  memberName: string,
  amount: number,
  date: timestamp,
  notes: string,
  createdAt: timestamp
}
```

#### Expenses
```javascript
{
  description: string,
  category: string, // 'general' | 'utilities' | 'maintenance' | 'events' | 'outreach' | 'administrative' | 'other'
  amount: number,
  date: timestamp,
  receiptNumber: string,
  notes: string,
  createdAt: timestamp
}
```

#### Weekly Summaries
```javascript
{
  weekStart: timestamp,
  weekEnd: timestamp,
  expectedAmount: number,
  actualAmount: number,
  expenses: number,
  balance: number,
  createdAt: timestamp
}
```

## Usage

### 1. First Time Setup

1. Create an admin account through the authentication screen
2. Add church members through the Members page
3. Start tracking contributions and expenses

### 2. Weekly Workflow

1. On Sunday, record member contributions
2. Throughout the week, add any expenses
3. Monitor the dashboard for financial overview
4. Generate weekly reports

### 3. Features Overview

- **Dashboard**: Overview of current week's finances
- **Members**: Manage member information
- **Contributions**: Record weekly ₱30 contributions
- **Expenses**: Track and categorize expenses

## Firebase Free Plan Limits

The application is optimized to work within Firebase Spark plan limits:

- **Firestore**: 1GB storage, 50k reads/day, 20k writes/day, 20k deletes/day
- **Authentication**: 10k/month active users
- **Hosting**: 10GB storage, 360MB/day transfer

## Security

- All Firebase operations require authentication
- Firestore rules ensure users can only access their own data
- Input validation on all forms
- Secure password handling through Firebase Auth

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
1. Check the Firebase console for any errors
2. Review browser console for JavaScript errors
3. Ensure Firebase rules are properly configured
4. Verify all environment variables are set correctly

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This application is designed for church fund management and promotes transparency and accountability in financial operations.
