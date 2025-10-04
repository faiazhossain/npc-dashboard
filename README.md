# Project Handover Report

### Project Name: NPS Dashboard (National Polling Survey Application)

**Prepared For:** NPS  
**Prepared By:** Faiaz Hossain  
**Date:** 03/10/2025

## 1. Project Overview

The NPS Dashboard is a comprehensive survey and voting management dashboard consisting of:

- **Frontend Dashboard** built with Next.js for analytics, data visualization, and user management
- **Integration with Backend API** for managing surveys, candidates, and users
- **Redux State Management** for efficient data handling and state persistence
- **Responsive UI** for optimal viewing on different devices
- **Visualization Components** powered by Recharts for interactive data display

This document provides details on project setup, framework information, dashboard features, and usage instructions.

## 2. Technical Stack Information

### Frontend Dashboard

- **Framework:** Next.js 15.5.3
- **UI Library:** React 19.1.0
- **State Management:** Redux Toolkit 2.9.0
- **Styling:** Tailwind CSS 4.x
- **Animation:** Framer Motion 12.23.15
- **Data Visualization:** Recharts 3.2.1
- **Icons:** React Icons 5.5.0
- **Notification:** React Toastify 11.0.5

## 3. Dashboard Features and Components

### 3.1 Key Features

- **Authentication System**

  - Login/Logout functionality with role-based access control
  - JWT token management for secure API requests
  - Session persistence with local storage

- **Data Visualization**

  - Interactive charts and graphs for survey analytics
  - Filtering capabilities by region, time period, and demographic factors
  - Exportable reports and insights

- **Survey Management**

  - View survey results and responses
  - Filter survey data by division, district, constituency, etc.
  - Analyze voter demographics and preferences

### 3.2 Key Components

- **Navbar** - Navigation and user information
- **Dashboard** - Main analytics overview
- **Filters** - Geographic and demographic data filtering
- **Survey Content** - Survey results and detailed analytics
- **User Management** - Admin, surveyor, and user management
- **Visualization Charts** - Pie charts, bar graphs for data representation

## 4. Project Structure

```
nps-dashboard/
├── app/                   # Next.js app directory
│   ├── dashboard/         # Dashboard routes and pages
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout component
│   └── page.js            # Home page
├── components/            # Reusable React components
│   ├── Dashboard.js       # Main dashboard component
│   ├── Login.js           # Authentication component
│   ├── Navbar.js          # Navigation component
│   ├── dashboardTab/      # Dashboard tab components
│   └── surveyTab/         # Survey-related components
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Authentication hook
├── public/                # Static assets
│   └── Images/            # Image assets
├── services/              # API services
├── store/                 # Redux store configuration
│   ├── ReduxProvider.js   # Redux provider component
│   ├── index.js           # Store configuration
│   └── slices/            # Redux slices
├── utils/                 # Utility functions
├── next.config.mjs        # Next.js configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## 5. Setup and Installation

### 5.1 Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### 5.2 Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/faiazhossain/npc-dashboard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd npc-dashboard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. For production build:
   ```bash
   npm run build
   npm run start
   ```

## 6. Authentication and Access Control

### 6.1 User Roles

- **Admin:** Full access to all dashboard features and settings
- **Data User (duser):** Limited access to view only percentage data without detailed counts

### 6.2 Login Process

1. Navigate to the login page
2. Enter credentials (username/password)
3. System authenticates with the backend API
4. On successful login, JWT token is stored and user is redirected to the dashboard

## 7. Dashboard Usage Guide

### 7.1 Main Dashboard

- Overview of key metrics and survey statistics
- Quick access to different sections via navigation tabs
- Geographic filtering options at the top

### 7.2 Survey Analytics

- View survey results filtered by location
- Analyze voting patterns and preferences
- Interactive charts showing party popularity and candidate support

### 7.3 Candidate Information

- View candidate profiles and popularity metrics
- Compare candidate performance across regions
- Analyze voter perception of candidates

### 7.4 Seat Distribution

- View seat distribution data and projections
- Filter by division, district, and constituency
- Visualize party popularity across different regions

### 7.5 User Management (Admin Only)

- Create and manage user accounts
- Assign roles and permissions
- Monitor user activity and survey contributions

## 8. Data Filtering System

The dashboard implements a comprehensive filtering system:

1. **Division Level** - Select a specific division
2. **District Level** - Further filter by districts within the selected division
3. **Constituency Level** - Filter by constituencies within the selected district
4. **Additional Filters** - Filter by demographics, date ranges, and other parameters

## 10. Security Considerations

- JWT tokens are stored securely and refreshed automatically
- Role-based access control prevents unauthorized access to sensitive data
- API requests are authenticated with proper headers
- Data validation is performed on both client and server sides

## Contact Information

For technical support and inquiries, please contact:

- **Repository:** https://github.com/faiazhossain/npc-dashboard.git

---

**© 2025 National Polling Survey. All rights reserved.**
