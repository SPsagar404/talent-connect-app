# 🚀 Talent Connect — Job Outreach Management App

A full-stack application for job seekers to manage HR contacts, send cold emails with resume attachments (individually and in bulk), and track email delivery status — all from a single premium dashboard.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![Tech Stack](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure signup/login with token-based auth |
| **HR Contact Management** | Full CRUD with search, filters, and pagination |
| **Single & Bulk Email** | Send cold emails to one or multiple HR contacts at once |
| **Resume Attachment** | Upload resume once — auto-attached to every outreach email |
| **Email Status Tracking** | Track Sent / Pending / Failed status per contact |
| **Advanced Filtering** | Filter by status, company name, and date range |
| **Dashboard Analytics** | Real-time stats: total contacts, sent, pending, failed |
| **Dark Premium UI** | Glassmorphism design with smooth animations |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4, Axios, React Router |
| **Backend** | Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0 |
| **Email** | Gmail SMTP with JavaMailSender |
| **Auth** | JWT (jjwt) + BCrypt password hashing |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
talent-connect-app/
├── docker-compose.yml              # One-command startup
├── README.md
├── ARCHITECTURE.md
│
├── backend/                         # Spring Boot API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/talentconnect/
│       ├── config/                  # Security, CORS
│       ├── controller/              # REST endpoints
│       ├── dto/                     # Request/Response objects
│       ├── entity/                  # JPA entities
│       ├── exception/               # Global error handling
│       ├── repository/              # Data access layer
│       ├── security/                # JWT filter & service
│       └── service/                 # Business logic
│
└── frontend/                        # React SPA
    ├── Dockerfile
    ├── nginx.conf                   # Production server config
    └── src/
        ├── components/              # Reusable UI components
        ├── context/                 # Auth state management
        ├── pages/                   # Page-level components
        └── services/                # API client layer
```

---

## 🐳 Quick Start (Docker — One Command)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run
```bash
git clone <repo-url>
cd talent-connect-app
docker-compose up --build
```

Open **http://localhost:5173** → Sign Up → Upload Resume → Add HR Contacts → Send Emails!

---

## 🐳 All Docker Commands

### Build & Start

```bash
# Build and start all services (first time or after code changes)
docker-compose up --build

# Build and start in detached/background mode
docker-compose up --build -d

# Start without rebuilding (if images already exist)
docker-compose up -d
```

### Stop & Teardown

```bash
# Stop all containers (preserves data)
docker-compose stop

# Stop and remove containers (preserves volumes/data)
docker-compose down

# Stop, remove containers AND delete all data (MySQL + resume uploads)
docker-compose down -v
```

### Logs & Monitoring

```bash
# Live logs from all services
docker-compose logs -f

# Logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last N lines of logs
docker-compose logs --tail 100 backend

# Container status overview
docker-compose ps

# CPU/Memory usage of running containers
docker stats
```

### Restart & Rebuild

```bash
# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql

# Rebuild only backend (after Java code changes)
docker-compose up --build -d backend

# Rebuild only frontend (after React code changes)
docker-compose up --build -d frontend

# Force clean rebuild (no Docker cache)
docker-compose build --no-cache
docker-compose up -d
```

### Debugging & Shell Access

```bash
# Open shell inside a container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mysql bash

# Connect to MySQL CLI directly
docker-compose exec mysql mysql -u root -ptalent_connect_2026 talent_connect_db

# Inspect a container's config
docker inspect tc-backend
```

### Cleanup

```bash
# Remove stopped containers
docker-compose rm

# Remove unused Docker images (free disk space)
docker image prune -a

# Remove unused volumes (⚠️ deletes data)
docker volume prune

# Full nuclear cleanup
docker system prune -a --volumes
```

---

## 🖥️ Manual Setup (Without Docker)

### Prerequisites
- **Java 17+** and **Maven 3.9+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+**

### 1. Database

```sql
CREATE DATABASE IF NOT EXISTS talent_connect_db;
```

### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
```

> 💡 Generate a Gmail App Password at: https://myaccount.google.com/apppasswords

### 3. Start Backend

```bash
cd backend
mvn spring-boot:run       # Starts on port 8080
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev               # Starts on port 5173
```

### 5. Open

Navigate to **http://localhost:5173**

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### HR Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hr?page=0&size=10` | List contacts (paginated) |
| `GET` | `/api/hr/:id` | Get single contact |
| `POST` | `/api/hr` | Add new contact |
| `PUT` | `/api/hr/:id` | Update contact |
| `DELETE` | `/api/hr/:id` | Delete contact |
| `GET` | `/api/hr/stats` | Dashboard statistics |

### Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/email/send` | Send email to selected contacts |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/upload` | Upload resume (PDF/DOC/DOCX) |
| `GET` | `/api/resume/info` | Get current resume info |

---

## 🔐 Environment & Ports

| Service | Container | Internal Port | External Port |
|---------|-----------|---------------|---------------|
| MySQL | `tc-mysql` | 3306 | **3307** |
| Backend | `tc-backend` | 8080 | **8080** |
| Frontend | `tc-frontend` | 80 | **5173** |

---

## 📄 License

This project is for educational and personal use.

---

<p align="center">Built with ❤️ by Sagar Pujari</p>
