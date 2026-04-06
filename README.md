# 📏 Quantity Measurement Application (Full Stack)

> A full-stack application for performing quantity measurement operations, built using **Spring Boot (Backend)** and **React (Frontend)**. The system evolves into a secure, scalable, enterprise-ready architecture.

---

## 📖 Overview

- Full-stack system supporting unit conversion, arithmetic operations, and history tracking  
- Backend built with **Spring Boot, JPA, and Security (JWT + OAuth2)**  
- Frontend built with **React (Vite)** for fast and responsive UI  
- Follows clean architecture and modern development practices  

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login (JWT-based)
- Google & GitHub OAuth2 login
- Role-based authorization (USER, ADMIN)
- Secure REST APIs

### 📏 Quantity Operations
Supports multiple measurement types:
- Length  
- Weight  
- Volume  
- Temperature  

Operations:
- Conversion  
- Addition  
- Subtraction  
- Comparison  

### 📊 History Tracking
- Stores and retrieves past operations  
- Admin-only access for error logs  

### 🎨 Frontend (React)
- Responsive UI using React  
- Form handling and validation  
- API integration with backend  
- Token-based authentication handling  

---

## 🧰 Tech Stack

### Backend
- Java 17  
- Spring Boot  
- Spring Data JPA  
- Spring Security  
- JWT  
- OAuth2 (Google & GitHub)  
- HikariCP  
- Swagger / OpenAPI  
- JUnit 5  

### Frontend
- React (Vite)  
- JavaScript (ES6+)  
- Axios / Fetch API  
- CSS / Material UI  

---

## 📂 Project Structure

```
project-root/
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── security/
│   └── QuantityMeasurementApplication.java
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── styles/
│   │   ├── main.jsx
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 🔧 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:  
http://localhost:8080

---

### ⚛️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:  
http://localhost:5173

---

## 🔗 API Integration

- Auth APIs → /api/v1/auth  
- Quantity APIs → /api/v1/quantities  

Frontend communicates using JWT tokens in request headers.

---

## 🔐 Environment Configuration

### Backend (application.properties)

```
app.jwt.secret=your_secret
app.jwt.expiration-ms=86400000
spring.datasource.url=your_db_url
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 🧪 Testing

- Backend:
  - Unit Tests  
  - Integration Tests  

- Frontend:
  - Manual UI testing  

---

## 🏗️ Architecture Evolution

- Core OOP Design → Generic Model  
- N-Tier Architecture → JDBC Integration  
- Spring Boot REST → JPA Persistence  
- JWT & OAuth2 Security → Full Stack Integration  

---

## 📌 Future Enhancements

- Add Redux / Context API  
- Add frontend testing (Jest, React Testing Library)  
- Improve UI/UX  
- Deploy using Docker & Cloud  

---
