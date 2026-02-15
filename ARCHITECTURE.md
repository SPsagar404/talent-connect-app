# 🏗️ Talent Connect — Architecture Plan

## System Overview

Talent Connect is a three-tier web application deployed as Docker containers behind an Nginx reverse proxy.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Docker Compose Network                        │
│                                                                        │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │   Frontend    │     │     Backend       │     │     MySQL        │   │
│  │   (Nginx)     │────▶│  (Spring Boot)    │────▶│     8.0          │   │
│  │   :80         │ API │  :8080            │ JPA │  :3306           │   │
│  │               │     │                   │     │                  │   │
│  │  React SPA    │     │  JWT Auth         │     │  users           │   │
│  │  Static Files │     │  REST APIs        │     │  hr_details      │   │
│  │  API Proxy    │     │  Email Service    │     │  email_logs      │   │
│  └──────┬───────┘     │  File Storage     │     └──────────────────┘   │
│         │              └──────────┬───────┘                            │
│         │                         │                                    │
│         │                         ▼                                    │
│         │              ┌──────────────────┐                           │
│         │              │   Gmail SMTP     │                           │
│         │              │   (External)     │                           │
│         │              └──────────────────┘                           │
│         │                                                              │
└─────────┼──────────────────────────────────────────────────────────────┘
          │
    ┌─────▼─────┐
    │  Browser   │
    │ :5173      │
    └───────────┘
```

---

## Layer Architecture

### 1. Presentation Layer (Frontend)

```
React 18 + Vite + Tailwind CSS v4
│
├── Pages (LoginPage, SignupPage, DashboardPage, HrManagementPage, AddEditHrPage, ResumePage)
│
├── Components (Layout, FilterBar, Modal, Pagination, StatusBadge, ResumeUpload, LoadingSpinner)
│
├── Context (AuthContext — JWT token + user state in localStorage)
│
└── Services (Axios HTTP client with JWT interceptor → /api/*)
```

**Key Decisions:**
- Context API over Redux — simple auth state doesn't need external state management
- Axios interceptors handle JWT attachment and 401 redirects globally
- Nginx in production serves static files and proxies `/api/*` to backend

### 2. API Layer (Backend Controllers)

```
Spring Boot 3.2
│
├── AuthController        POST /api/auth/signup, /api/auth/login
├── HrDetailController    GET/POST/PUT/DELETE /api/hr, GET /api/hr/stats
├── EmailController       POST /api/email/send
└── ResumeController      POST /api/resume/upload, GET /api/resume/info
```

**Key Decisions:**
- DTOs for all request/response — entities never exposed to API consumers
- `@Valid` annotation with Jakarta Validation for input sanitization
- `GlobalExceptionHandler` returns consistent `ApiResponse` wrapper for all errors

### 3. Business Logic Layer (Services)

```
├── AuthService           Registration (duplicate check, BCrypt hash) + Login (JWT generation)
├── HrDetailService       CRUD + filtering + pagination + stats aggregation
├── EmailService          Single/bulk send via JavaMailSender with resume attachment
├── FileStorageService    Resume upload (PDF/DOC/DOCX, 10MB limit, UUID naming)
└── CustomUserDetailsService   Spring Security UserDetails loader
```

**Key Decisions:**
- Email sending is synchronous per request — acceptable for ≤50 contacts per batch
- File storage on local filesystem (Docker volume for persistence)
- Ownership verification: users can only access their own HR contacts

### 4. Security Layer

```
┌────────────────┐    ┌────────────────┐    ┌─────────────────┐
│  HTTP Request   │───▶│  JwtAuthFilter  │───▶│  SecurityConfig  │
│                 │    │  (OncePerReq)   │    │  (Stateless)     │
└────────────────┘    └───────┬────────┘    └─────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    JwtService       │
                    │  Generate / Validate│
                    │  HMAC-SHA256        │
                    └───────────────────┘
```

- **Public endpoints:** `/api/auth/**`
- **Protected endpoints:** Everything else (requires `Authorization: Bearer <token>`)
- **Password storage:** BCrypt with default strength
- **Token expiry:** 24 hours
- **CORS:** Configured for frontend origin

### 5. Data Layer

```
├── UserRepository        findByEmail, existsByEmail
├── HrDetailRepository    Dynamic @Query with optional filters (status, company, date range)
└── EmailLogRepository    Tracks every email attempt
```

---

## Database Schema

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│      users       │       │     hr_details        │       │    email_logs     │
├──────────────────┤       ├──────────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)              │       │ id (PK)          │
│ full_name        │       │ hr_name              │       │ hr_detail_id(FK) │
│ email (UNIQUE)   │◀──┐   │ email                │   ┌──▶│ user_id (FK)     │
│ password (hash)  │   │   │ mobile_number        │   │   │ status (ENUM)    │
│ resume_path      │   ├───│ company_name         │───┤   │ error_message    │
│ resume_orig_name │   │   │ job_role             │   │   │ sent_at          │
│ created_at       │   │   │ notes                │   │   └──────────────────┘
└──────────────────┘   │   │ email_status (ENUM)  │   │
                       │   │ user_id (FK)─────────┘   │
                       │   │ date_added           │   │
                       │   │ last_emailed_at      │   │
                       │   └──────────────────────┘   │
                       │                               │
                       └───────────────────────────────┘

EmailStatus ENUM: PENDING | SENT | FAILED

Indexes:
  - hr_details: (user_id, email_status) — filter queries
  - hr_details: (user_id, date_added)   — date range queries
```

---

## Request Flow Example: Bulk Email

```
1. User selects HR contacts on frontend
2. Clicks "Send Email" → fills subject + body
3. Frontend POST /api/email/send { hrDetailIds, subject, body }
        │
4. JwtAuthFilter validates token → extracts user
        │
5. EmailService.sendBulkEmails()
   ├── Loads User entity (gets resume path)
   ├── Loads HrDetail entities (verifies ownership)
   ├── For each HR contact:
   │   ├── Creates MimeMessage with attachment
   │   ├── Sends via Gmail SMTP
   │   ├── Updates hr_details.email_status → SENT/FAILED
   │   └── Creates EmailLog entry
   └── Returns { successCount, failCount }
        │
6. Frontend shows toast notification
7. Table refreshes with updated statuses
```

---

## Docker Deployment Architecture

```
                    External
                   ┌─────────┐
                   │ Browser  │
                   │ :5173    │
                   └────┬────┘
                        │
            ┌───────────▼───────────┐
            │  tc-frontend (Nginx)  │
            │  - Serves React SPA   │
            │  - Proxies /api/*     │
            │  Port: 5173 → 80      │
            └───────────┬───────────┘
                        │ /api/*
            ┌───────────▼───────────┐
            │  tc-backend (JRE 17)  │
            │  - Spring Boot app    │
            │  - Profile: docker    │
            │  - Volume: uploads    │
            │  Port: 8080 → 8080    │
            └───────────┬───────────┘
                        │ JDBC
            ┌───────────▼───────────┐
            │  tc-mysql (MySQL 8)   │
            │  - Healthcheck        │
            │  - Volume: data       │
            │  Port: 3307 → 3306    │
            └───────────────────────┘

Volumes:
  mysql_data      → /var/lib/mysql          (persistent DB storage)
  resume_uploads  → /app/uploads/resumes    (persistent file storage)

Network: tc-network (bridge)
```

---

## Scalability Considerations

| Concern | Current | Future Improvement |
|---------|---------|-------------------|
| Email sending | Synchronous | Async with message queue (RabbitMQ/Kafka) |
| File storage | Local filesystem | AWS S3 or MinIO |
| Database | Single MySQL | Read replicas, connection pooling |
| Auth | JWT in localStorage | HttpOnly cookies + refresh tokens |
| Frontend | Vite dev / Nginx prod | CDN deployment (Cloudflare/Vercel) |
| Backend | Single instance | Horizontal scaling with load balancer |
