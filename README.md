# Leave Management System

A full-stack web application for managing employee leave requests. Built with Node.js/Express backend and React frontend with TailwindCSS styling.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Role-Based Access**: HR and Employee roles with different permissions
- **Leave Management**: 
  - Employees can request leaves with different types
  - HR can approve/reject leave requests
  - Track leave history and status
- **Dashboard**: Employee and HR dashboards with leave analytics
- **Responsive Design**: Mobile-friendly UI built with React and TailwindCSS

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend integration

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Notifications**: SweetAlert2
- **Icons**: Lucide React

## Project Structure

```
backend/
├── src/
│   ├── server.js           # Express server entry point
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   └── leave.controller.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   └── leave.routes.js
│   └── services/          # Business logic
│       ├── auth.service.js
│       └── leave.service.js
├── database.sql           # Database schema
├── initialize-db.js       # DB initialization script
└── package.json

leave-frontend/
├── src/
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   ├── api/               # API integration
│   │   ├── auth.api.js
│   │   ├── leave.api.js
│   │   └── axios.js       # Axios instance
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ui/            # UI component library
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── employee/
│   │   │   └── EmployeeDashboard.jsx
│   │   └── hr/
│   │       └── HRDashboard.jsx
│   └── utils/            # Utility functions
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Database Setup

### Database Schema

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('HR', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create leaves table
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` enum('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_user_id ON leaves(user_id);
CREATE INDEX idx_status ON leaves(status);
CREATE INDEX idx_created_at ON leaves(created_at);
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=leave_management
JWT_SECRET=your_secret_key
PORT=5000
```

4. Initialize the database:
```bash
npm run migrate
```

Or manually run the SQL queries from `database.sql`:
```bash
mysql -u root -p < database.sql
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd leave-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Leave Management
- `GET /api/leaves` - Get all leaves (HR) or user leaves (Employee)
- `POST /api/leaves` - Create new leave request
- `GET /api/leaves/:id` - Get leave details
- `PATCH /api/leaves/:id` - Update leave status (HR only)
- `DELETE /api/leaves/:id` - Delete leave request

## User Roles

### Employee
- Create leave requests
- View own leave history
- Check leave status
- View dashboard with leave statistics

### HR
- View all leave requests
- Approve or reject leave requests
- View all employees
- Analytics and reporting

## Default Users

After initialization, you can use these default credentials:
- **HR**: email: `hr@example.com` | password: `password123`
- **Employee**: email: `emp@example.com` | password: `password123`

## Build for Production

### Frontend
```bash
cd leave-frontend
npm run build
```

Output will be in the `dist/` directory.

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists and tables are created

### CORS Errors
- Ensure frontend URL matches CORS configuration in backend
- Check Express CORS middleware settings

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Clear browser localStorage and try logging in again

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue in the repository.

---

**Happy coding!** 🚀
