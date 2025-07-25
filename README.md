# 🚀 Grag GIG - Centralized Career Platform

## 🌟 Overview

Grag GIG revolutionizes the way organizations and educational institutions manage career opportunities. Our platform serves as the bridge between employers seeking talent and students/professionals looking for their next career move. Built with modern web technologies and enterprise-grade architecture patterns, this system ensures scalability, maintainability, and exceptional user experience.

## ✨ Key Features

### 🏢 For Companies & Organizations
- **Multi-tier Job Posting System** - Create and manage internships, part-time, and full-time positions for undergraduates
- **Advanced Applicant Management** - Review and  filter  candidates
- **Real-time Analytics Dashboard** - Track application metrics and engagement
- **Company Profile Management** - Showcase company culture and opportunities

### 🎓 For Career Guidance Units
- **Institutional Dashboard** - Monitor student engagement and placement statistics
- **Bulk Job Management** - Post multiple opportunities across different departments
- **Student Progress Tracking** - Oversee application status and career development
- **Reporting & Analytics** - Generate comprehensive placement reports

### 👨‍🎓 For Students & Job Seekers
- **One-Click Applications** - Streamlined application process
- **Application Tracking** - Wish to implement monitor status of all submitted applications
- **Profile Builder** - Create compelling professional profiles with resume upload

## 🏗️ Technical Architecture

### Frontend Architecture
```
Frontend (Client-Side)
├── HTML5 - Semantic structure and accessibility
├── CSS3 - Modern styling with responsive design
└── JavaScript (ES6+) - Dynamic interactions and API consumption
```

### Backend Architecture
```
Backend (Server-Side)
├── PHP 8+ - Server-side logic and business rules
├── RESTful API Design - Clean API endpoints
├── MySQL Database - Robust data persistence
└── Singleton Pattern - Consistent resource management
```

### Design Patterns Implemented

#### 🔧 Singleton Pattern
Our application extensively uses the **Singleton Design Pattern** to ensure:
- **Database Connection Management** - Single instance database connections
- **Configuration Management** - Centralized application settings
- **Session Management** - Consistent user state handling
- **API Response Formatting** - Uniform response structure


### 🔄 API-First Approach

We implemented a **clean separation of concerns** by decoupling the frontend from the backend:

- **Frontend** - Pure client-side rendering with API consumption
- **Backend** - RESTful API serving JSON responses

This architecture provides:
- **Scalability** - Independent scaling of frontend and backend
- **Maintainability** - Clear separation of presentation and business logic
- **Flexibility** - Easy integration with mobile apps or third-party services
- **Performance** - Optimized API responses and caching strategies

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | User interface and experience |
| **Backend** | PHP 8+ | Server-side logic and API |
| **Database** | MySQL 8.0+ | Data persistence and management |
| **Architecture** | RESTful API, Singleton Pattern | System design and structure |
| **Communication** | JSON | Client-server data exchange |

## 🚀 Getting Started

### Prerequisites
- PHP 8.0 or higher
- MySQL 8.0 or higher
- Apache web server
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KavishkaVenuka/CSE2032-Group-Project.git
   cd CSE2032-Group-Project
   ```

2. **Configure the database**
   ```bash
   # Import the database schema
   mysql -u username -p database_name < database/schema.sql
   ```

3. **Set up configuration**
   ```php
   // config/database.php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'grag_gig');
   ```

4. **Start the application**
   ```bash
   # For development
   php -S localhost:8000
   
   # Or configure your web server to point to the project directory
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Create accounts for different user types to explore features

## 📁 Project Structure

```
CSE2032-Group-Project/
├── frontend/                # Client-side application
│   ├── html/                # HTML templates
│   ├── css/                 # Stylesheets           
│   └── js/                  # JavaScript modules
│ 
├── backend/                 # Server-side API
│   └── php filse            # All the php files 
│ 
├── database/                # Database related files
│   └── job_cgu.sql          # Database structure
│          
└── docs/                    # Documentation
```

## 🎯 Core Functionalities

### User Management System
- **Multi-role Authentication** - Students, Companies, Career Units
- **Profile Management** - Comprehensive user profiles
- **Permission-based Access** - Role-specific feature access

### Job Management System
- **Dynamic Job Posting** - Rich job descriptions with requirements
- **Advanced Search & Filtering** - Location, type, experience level
- **Application Workflow** - Complete application lifecycle management

### Communication System
- **Real-time Notifications** - Status updates and messages
- **Email Integration** - Automated email communications
- **In-app Messaging** - Direct communication between users

## 🔒 Security Features

- **Input Validation & Sanitization** - Protection against injection attacks
- **Password Hashing** - Industry-standard password security
- **CSRF Protection** - Cross-site request forgery prevention
- **SQL Injection Prevention** - Prepared statements and parameterized queries

## 📈 Performance Optimizations

- **Database Query Optimization** - Efficient database operations
- **Caching Strategy** - Reduced server load and faster responses
- **Lazy Loading** - Optimized resource loading
- **Compressed Assets** - Minified CSS and JavaScript files

## 🧪 Testing

Our application includes comprehensive testing:
- **Unit Tests** - Individual component testing
- **Integration Tests** - API endpoint testing
- **User Acceptance Testing** - End-to-end functionality verification

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Development Team

This project was developed as part of the CSE2032 course, demonstrating modern web development practices and software engineering principles associated with Faculty of Computing University of Sri Jayewardenapura - Sri Lanka

## 🌐 Demo & Documentation

- **Live Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **User Manual**: Comprehensive guide for all user types

## 📞 Support

For support, please create an issue in this repository or contact the development team.

---

<div align="center">
  <p><strong>Built with ❤️ using modern web technologies</strong></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>