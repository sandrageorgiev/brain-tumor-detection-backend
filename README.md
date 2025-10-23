# 🧠 Brain Tumor Detection - Spring Boot Backend

This is the **backend service** for the Brain Tumor Detection application, built with **Java Spring Boot**. It provides RESTful APIs for user authentication, patient/doctor management, and storing AI prediction results from the FastAPI model.

---

## 🚀 Overview

The Spring Boot backend serves as the **data management layer** between the Angular frontend and the FastAPI ML service. It handles:

- **User Authentication** (Doctor/Patient login and registration)
- **Result Management** (Storing and retrieving MRI scan predictions)
- **Patient-Doctor Relationship** (Linking results to specific patients and doctors)
- **Email Notifications** (Automated email alerts to patients when results are ready)

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
│   │   │       │   ├── ResultServiceImpl.java
│   │   │       │   └── EmailService.java          # Email notification service
│   │   │       └── web/
│   │   │           ├── BtdUserController.java    # User API endpoints
│   │   │           └── ResultController.java     # Result API endpoints
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           └── images/
│   │               └── logo.png               # Email logo image
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
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/brain_tumor_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   
   # Server Configuration
   server.port=8080
   
   # Email Configuration (Gmail example)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```
   
   **Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

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

## 📧 Email Notification System

The application includes an **automated email notification service** that alerts patients when their MRI scan results are ready.

### **Email Service Features**

- **HTML Email Templates**: Professional, branded email design
- **Inline Logo**: NeuroScan logo embedded in emails
- **Direct Link**: One-click access to patient portal
- **Automatic Triggering**: Emails sent when doctors save results

### **Email Template**

The email includes:
- NeuroScan AI Portal branding with logo
- Personalized patient greeting
- Professional styling with gradient button
- Direct link to view results at `http://localhost:4200/patient`

### **Configuration**

1. **Add logo image**: Place your logo at:
   ```
   src/main/resources/static/images/logo.png
   ```

2. **Configure SMTP** in `application.properties`:
   ```properties
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   ```

3. **Gmail Setup** (if using Gmail):
   - Enable 2-factor authentication
   - Generate an [App Password](https://support.google.com/accounts/answer/185833)
   - Use the app password in configuration

### **Usage**

The `EmailService` is automatically triggered when a result is saved:

```java
emailService.sendResultNotification(
    patientEmail, 
    patientName
);
```

### **Email Preview**

```
┌──────────────────────────────────┐
│      [NeuroScan Logo]            │
│                                  │
│  Hello John Doe,                 │
│                                  │
│  Your medical result has been    │
│  processed and is now available  │
│  on the NeuroScan AI Portal.     │
│                                  │
│     [View Result Button]         │
│                                  │
└──────────────────────────────────┘
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

## 🧪 Testing

Run unit tests:
```bash
mvn test
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
    
    <!-- Spring Boot Starter Mail -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
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

## 👥 Contributors

Sandra Georgiev

---

## 📧 Contact

For questions or support, please contact sandrageorgiev002@gmail.com

---

## ⚠️ Disclaimer

This application is intended for research and educational purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for medical advice.
