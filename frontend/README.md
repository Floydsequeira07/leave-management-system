# Leave Management System — Frontend

React.js frontend for the Leave Management System developed as part of the Full Stack Developer selection task for **Exelon Circuits Pvt. Ltd.**

The frontend provides separate interfaces for employees and administrators to manage leave applications, leave balances, leave history, and leave approvals.

The application is responsive and works across desktop, tablet, and mobile devices.

---

## 1. Project Overview

The frontend is built using React.js and communicates with the backend through REST APIs.

### Employee

Employees can:

- Log in
- View their leave balance
- Apply for leave
- View leave history
- Track pending, approved, and rejected requests
- View Casual, Sick, Earned, and LOP leave balances

### Admin

Administrators can:

- Log in using the Admin role
- View dashboard statistics
- View all employee leave requests
- View employee leave balances
- Approve leave requests
- Reject leave requests
- View request status
- Automatically refresh leave information

---

# 2. Features

## Employee Features

- Employee login
- Role-based login
- Employee dashboard
- Casual Leave balance
- Sick Leave balance
- Earned Leave balance
- Unpaid Leave / LOP
- Apply for leave
- Leave type selection
- Start and end date selection
- Leave reason
- Leave history
- Leave request status
- Automatic balance and request refresh
- Logout

## Admin Features

- Admin login
- Admin dashboard
- Total employee count
- Pending leave count
- Approved leave count
- Rejected leave count
- View all leave requests
- View employee leave balances
- Approve leave requests
- Reject leave requests
- Confirmation popup before approval/rejection
- Automatic dashboard refresh
- Logout

---

# 3. Leave Management

The frontend supports the following leave types:

- Casual Leave
- Sick Leave
- Earned Leave
- Unpaid Leave / LOP

The backend handles the leave balance calculation and approval logic.

When a leave request is approved:

1. Available paid leave is checked.
2. The corresponding paid leave balance is deducted.
3. If the requested days exceed the available paid leave, the excess is counted as LOP.
4. Pending requests do not reduce the balance.
5. Rejected requests do not reduce the balance.
6. Paid leave balances cannot become negative.

---

# 4. Responsive Design

The frontend is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive Tailwind CSS classes are used for:

- Navigation
- Dashboard cards
- Forms
- Tables
- Buttons
- Leave request sections
- Admin dashboard
- Employee dashboard

---

# 5. Technology Stack

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

## Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

## Deployment

- Vercel




└── README.md
