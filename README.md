# Leave Management System

A full-stack Leave Management System developed as part of the Full Stack Developer selection task for **Exelon Circuits Pvt. Ltd.**

The application provides separate workflows for employees and administrators to manage leave requests, approvals, leave history, and leave balances.

The application is designed to be **responsive** and works across desktop, tablet, and mobile screen sizes.

---

## 1. Project Overview

The Leave Management System allows employees to:

- Log in securely
- View their leave balance
- Apply for leave
- View their leave history
- Track the status of leave requests
- View approved, rejected, and pending leave requests
- Track paid leave and Loss of Pay (LOP)

Administrators can:

- Log in through the Admin role
- View the admin dashboard
- View employee leave requests
- View employee leave balances
- Approve leave requests
- Reject leave requests
- View overall leave statistics

The system uses:

- React.js for the frontend
- JavaScript for application development
- Node.js and Express.js for the backend
- MySQL for the database
- Tailwind CSS for responsive UI styling

---

# 2. Features

## Employee Features

- Employee login
- Role-based login
- Employee dashboard
- View Casual Leave balance
- View Sick Leave balance
- View Earned Leave balance
- View LOP (Loss of Pay)
- Apply for leave
- Select leave type
- Select start and end dates
- Enter leave reason
- View leave history
- View leave request status
- Responsive user interface
- Automatic refresh of leave status and balance

## Admin Features

- Admin login
- Admin dashboard
- View total number of employees
- View pending leave requests
- View approved leave requests
- View rejected leave requests
- View all employee leave requests
- View employee leave balances
- Approve leave requests
- Reject leave requests
- Confirmation popup before approving/rejecting leave
- Responsive admin interface

## Leave Management

The system supports:

- Casual Leave
- Sick Leave
- Earned Leave
- Unpaid Leave / LOP

When a leave request is approved:

1. The system checks the employee's available paid leave.
2. Available paid leave is deducted from the corresponding leave balance.
3. If the requested number of days exceeds the available paid leave, the remaining days are counted as LOP.
4. Pending requests do not reduce the leave balance.
5. Rejected requests do not reduce the leave balance.
6. Leave balances never become negative.

---

# 3. Responsive Design

The application has been designed to be responsive across:

- Desktop
- Laptop
- Tablet
- Mobile devices

Tailwind CSS responsive utility classes are used to adapt:

- Navigation
- Dashboard cards
- Forms
- Tables
- Leave request sections
- Buttons
- Layouts
- Admin dashboard
- Employee dashboard

The application is intended to provide a consistent user experience across different screen sizes.

---

# 4. Technology Stack

## Frontend

- React.js
- JavaScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Select
- React Hot Toast
- React Icons

## Backend

- Node.js
- Express.js
- MySQL2
- JWT
- bcryptjs
- CORS
- dotenv

## Database

- MySQL

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- npm

## Deployment

- Frontend: Vercel
- Backend: Vercel
- Database: MySQL

---

