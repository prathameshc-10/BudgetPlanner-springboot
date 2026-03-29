# Smart Budget Planner — Backend

A REST API built with **Spring Boot**, **Spring Data JPA**, and **MySQL** that powers the Smart Budget Planner application. Supports full CRUD operations on budget categories with clean layered architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 4.0.5 |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8.0 |
| Build Tool | Maven |
| Validation | Jakarta Bean Validation |

---

## Project Structure

```
src/
└── main/
    ├── java/
    │   └── com/example/smart_budget_planner/
    │       ├── SmartBudgetPlannerApplication.java
    │       ├── controller/
    │       │   └── BudgetController.java
    │       ├── service/
    │       │   ├── BudgetService.java
    │       │   └── BudgetServiceImpl.java
    │       ├── repository/
    │       │   └── BudgetRepository.java
    │       ├── entity/
    │       │   └── Budget.java
    │       ├── dto/
    │       │   └── BudgetDTO.java
    │       ├── exception/
    │       │   ├── ResourceNotFoundException.java
    │       │   └── GlobalExceptionHandler.java
    │       └── config/
    │           └── CorsConfig.java
    └── resources/
        └── application.properties
```

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+

---

## Database Setup

Log in to MySQL and create the database:

```sql
CREATE DATABASE IF NOT EXISTS smart_budget_db;
```

Then run the schema script to create tables and insert sample data:

```sql
USE smart_budget_db;

CREATE TABLE budget_categories (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name  VARCHAR(100)   NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    icon           VARCHAR(50)    DEFAULT '💰',
    color          VARCHAR(20)    DEFAULT '#6366f1',
    sort_order     INT            DEFAULT 0,
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO budget_categories (category_name, allocated_amount, icon, color, sort_order) VALUES
('Rent',             25000.00, '🏠', '#6366f1', 1),
('Food & Groceries',  8000.00, '🍔', '#f59e0b', 2),
('Travel',            5000.00, '✈️', '#10b981', 3),
('Entertainment',     3000.00, '🎬', '#ec4899', 4),
('Healthcare',        4000.00, '💊', '#14b8a6', 5),
('Education',         6000.00, '📚', '#8b5cf6', 6);
```

---

## Configuration

### Local Development

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_budget_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Production (Recommended)

Use environment variables instead of hardcoding credentials:

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
```

Set these variables on your hosting platform (Railway, Render, etc.).

---

## Running the Application

```bash
# Clone and navigate to backend folder
cd smart-budget-planner

# Run with Maven
./mvnw spring-boot:run

# OR build JAR and run
./mvnw clean package
java -jar target/smart-budget-planner-0.0.1-SNAPSHOT.jar
```

Server starts at: `http://localhost:8080`

---

## API Reference

Base URL: `http://localhost:8080/api`

### GET /api/budgets
Returns all budget categories sorted by `sort_order`.

**Response 200:**
```json
[
  {
    "id": 1,
    "categoryName": "Rent",
    "allocatedAmount": 25000.00,
    "icon": "🏠",
    "color": "#6366f1",
    "sortOrder": 1
  }
]
```

---

### POST /api/budgets
Creates a new budget category.

**Request Body:**
```json
{
  "categoryName": "Gym",
  "allocatedAmount": 2000,
  "icon": "💪",
  "color": "#10b981",
  "sortOrder": 7
}
```

**Response 201:**
```json
{
  "id": 7,
  "categoryName": "Gym",
  "allocatedAmount": 2000.00,
  "icon": "💪",
  "color": "#10b981",
  "sortOrder": 7
}
```

---

### PUT /api/budgets/{id}
Updates an existing budget category by ID.

**Request Body:** Same as POST

**Response 200:** Updated category object

**Response 404:**
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Budget category not found with id: 99"
}
```

---

### DELETE /api/budgets/{id}
Deletes a budget category by ID.

**Response 204:** No content

**Response 404:** Category not found

---

## Validation Rules

| Field | Rule |
|---|---|
| `categoryName` | Required, max 100 characters |
| `allocatedAmount` | Required, must be >= 0 |
| `icon` | Optional, defaults to `💰` |
| `color` | Optional, defaults to `#6366f1` |

Validation errors return HTTP 400 with field-level details:

```json
{
  "status": 400,
  "errors": {
    "categoryName": "Category name cannot be blank",
    "allocatedAmount": "Amount must be >= 0"
  }
}
```

---

## Architecture

```
Request → Controller → Service → Repository → MySQL
                ↓
          GlobalExceptionHandler (handles all errors centrally)
```

- **Controller** — handles HTTP request/response, delegates to service
- **Service** — business logic, maps between Entity and DTO
- **Repository** — extends JpaRepository, talks to MySQL
- **Entity** — maps to `budget_categories` table
- **DTO** — controls what fields are exposed in the API
- **GlobalExceptionHandler** — catches exceptions and returns structured JSON errors
- **CorsConfig** — allows requests from the React frontend

---

## CORS

The backend allows requests from:

- `http://localhost:3000` (local React dev server)
- Your production frontend URL (update `CorsConfig.java` before deploying)

---

## Deployment

### Railway (Recommended)

1. Push the project to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add the following environment variables in Railway dashboard:

```
DATABASE_URL     = jdbc:mysql://<host>:<port>/<dbname>?useSSL=true&serverTimezone=UTC
DATABASE_USERNAME = <username>
DATABASE_PASSWORD = <password>
```

4. Railway auto-detects Spring Boot and deploys on push.

### Free MySQL Hosting Options

| Provider | Free Tier |
|---|---|
| [PlanetScale](https://planetscale.com) | 5GB, 1 database |
| [Aiven](https://aiven.io) | 1 month free trial |
| [Railway](https://railway.app) | MySQL add-on available |

---

## Author

Prathamesh — Backend Developer  
Stack: Java · Spring Boot · MySQL · REST APIs
