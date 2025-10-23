# 🧠 Brain Tumor Detection - Spring Boot Backend

This is the **backend service** for the Brain Tumor Detection application, built with **Java Spring Boot**. It provides RESTful APIs for user authentication, patient/doctor management, and storing AI prediction results from the FastAPI model.

---

## 🚀 Overview

The Spring Boot backend serves as the **data management layer** between the Angular frontend and the FastAPI ML service. It handles:

- **User Authentication** (Doctor/Patient login and registration)
- **Result Management** (Storing and retrieving MRI scan predictions)
- **Patient-Doctor Relationship** (Linking results to specific patients and doctors)

---

## ⚙️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | Spring Boot 3.x |
| **Language** | Java 17+ |
| **Database** | PostgreSQL |
| **API Architecture** | RESTful API |
| **Build Tool** | Maven |
| **Frontend Integration** | Angular (CORS enabled) |

---

## 📁 Project Structure

```
brain-tumor-detection-backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/e/braintumordetectionbackend/
│   │   │       ├── model/
│   │   │       │   ├── BtdUser.java         # User entity
│   │   │       │   └── Result.java          # Result entity
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── ResultRepository.java
│   │   │       ├── service/
│   │   │       │   ├── BtdUserService.java
│   │   │       │   └── ResultServiceImpl.java
│   │   │       └── web/
│   │   │           ├── BtdUserController.java    # User API endpoints
│   │   │           └── ResultController.java     # Result API endpoints
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│
├── pom.xml                                   # Maven dependencies
└── README.md
```

---

## 🔧 Installation

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL database
- Angular CLI (for frontend)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brain-tumor-detection-backend
   ```

2. **Configure database**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/brain_tumor_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   
   server.port=8080
   ```

3. **Install dependencies**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The API will be available at: **`http://localhost:8080`**

---

## 📡 API Endpoints

### **User Management (`/user`)**

#### **POST `/user/create`**
Register a new user (Doctor or Patient)

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "securePassword123",
  "name": "John",
  "surname": "Doe",
  "embg": "1234567890123"
}
```

**Response:**
```
201 Created
```

---

#### **POST `/user/login`**
Authenticate a user

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "doctor@example.com",
  "name": "John",
  "surname": "Doe",
  "embg": "1234567890123",
  "role": "DOCTOR"
}
```

**Error Response:**
```
404 Not Found - Invalid credentials
```

---

### **Result Management (`/result`)**

#### **POST `/result/save`**
Save an MRI scan prediction result

**Request Body:**
```json
{
  "confidence": 0.9547,
  "classification": "Tumor",
  "modelUsed": "CNN",
  "notes": "Patient shows signs of glioblastoma",
  "patientEmbg": "1234567890123",
  "doctorEmail": "doctor@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "confidence": 0.9547,
  "classification": "Tumor",
  "modelUsed": "CNN",
  "notes": "Patient shows signs of glioblastoma",
  "patientEmbg": "1234567890123",
  "doctorEmail": "doctor@example.com",
  "createdAt": "2025-10-22T10:30:00"
}
```

---

#### **GET `/result/doctor/{username}`**
Retrieve all results submitted by a specific doctor

**Response:**
```json
[
  {
    "id": 1,
    "confidence": 0.9547,
    "classification": "Tumor",
    "modelUsed": "CNN",
    "patientEmbg": "1234567890123",
    "doctorEmail": "doctor@example.com",
    "createdAt": "2025-10-22T10:30:00"
  },
  {
    "id": 2,
    "confidence": 0.8821,
    "classification": "Healthy",
    "modelUsed": "VIT",
    "patientEmbg": "9876543210987",
    "doctorEmail": "doctor@example.com",
    "createdAt": "2025-10-22T11:15:00"
  }
]
```

---

#### **GET `/result/patient/{username}`**
Retrieve all results for a specific patient (by EMBG)

**Response:**
```json
[
  {
    "id": 1,
    "confidence": 0.9547,
    "classification": "Tumor",
    "modelUsed": "CNN",
    "notes": "Follow-up required",
    "patientEmbg": "1234567890123",
    "doctorEmail": "doctor@example.com",
    "createdAt": "2025-10-22T10:30:00"
  }
]
```

---

## 🌐 CORS Configuration

The backend is configured to accept requests from the Angular frontend running on `http://localhost:4200`:

```java
@CrossOrigin(origins = "http://localhost:4200")
```

For production, update this to your deployed frontend URL.

---

## 🗄️ Database Schema

### **Users Table (`btd_user`)**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| email | VARCHAR | User email (unique) |
| password | VARCHAR | Hashed password |
| name | VARCHAR | First name |
| surname | VARCHAR | Last name |
| embg | VARCHAR | Unique citizen ID (13 digits) |
| role | ENUM | DOCTOR or PATIENT |

### **Results Table (`result`)**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| confidence | FLOAT | Model confidence (0-1) |
| classification | VARCHAR | "Tumor" or "Healthy" |
| model_used | VARCHAR | "CNN" or "VIT" |
| notes | TEXT | Doctor's notes |
| patient_embg | VARCHAR | Foreign key to user |
| doctor_email | VARCHAR | Foreign key to user |
| created_at | TIMESTAMP | Result creation time |

---

## 🔒 Security Considerations

**Current Implementation:**
- Basic authentication (email/password)
- CORS enabled for Angular frontend

**Recommended for Production:**
1. **Password Hashing**: Use BCrypt to hash passwords
   ```java
   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
   }
   ```

2. **JWT Authentication**: Implement token-based authentication
   ```xml
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt</artifactId>
   </dependency>
   ```

3. **Input Validation**: Add `@Valid` annotations and validation constraints

4. **HTTPS**: Enable SSL/TLS for encrypted communication

5. **Rate Limiting**: Prevent brute force attacks

---

## 🔗 Integration with FastAPI

The Spring Boot backend works alongside the FastAPI ML service:

1. **Angular Frontend** → Sends MRI image to **FastAPI** for prediction
2. **FastAPI** → Returns prediction result to Angular
3. **Angular** → Sends result + metadata to **Spring Boot** for storage
4. **Spring Boot** → Saves result in database and links to patient/doctor

**Example Flow:**
```
User uploads MRI → Angular → FastAPI (prediction) 
                         ↓
                    Result displayed
                         ↓
                  Spring Boot (save to DB)
```

---

## 📊 Dependencies

Add to `pom.xml`:
```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok (Optional) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot Starter Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 👥 Contributors

Sandra Georgiev

---

## 📧 Contact

For questions or support, please contact sandrageorgiev002@gmail.com

---

## ⚠️ Disclaimer

This application is intended for research and educational purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for medical advice.
