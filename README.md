# Personal Expense Tracker

A full-stack web application for managing personal finances, tracking income and expenses, and visualizing monthly spending habits.

Built with **ASP.NET Core 8 Web API**, **React + TypeScript**, **Entity Framework Core**, and **SQLite**.

---

## 📋 Project Overview

The Personal Expense Tracker allows users to:

* Add income and expense transactions
* Edit and delete transactions
* Search expenses by title
* Filter by category
* Filter by date range
* View monthly financial summaries
* Monitor total income, total expenses, and current balance
* Visualize spending using charts

---

## 🛠️ Technology Stack

### Backend

* ASP.NET Core 8 Web API
* Entity Framework Core
* SQLite
* Repository Pattern
* Service Pattern

### Frontend

* React
* TypeScript
* Axios
* React Router
* React Hooks

---

## 📁 Project Structure

```text
PersonalExpenseTracker/

backend/
├── Controllers/
├── Models/
├── DTOs/
├── Data/
├── Repositories/
├── Services/
├── Interfaces/
├── Validators/
├── Migrations/
└── Program.cs

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── interfaces/
│   ├── routes/
│   ├── utils/
│   └── App.tsx
└── package.json
```

---

# ✨ Features

## Expense Management

* Create expense entries
* Edit expense entries
* Delete expense entries
* View all expenses

---

## Search & Filtering

### Search

Search expenses by title.

### Filter by Category

Examples:

* Food
* Transport
* Shopping
* Bills
* Entertainment
* Health

### Filter by Date Range

Examples:

* Today
* This Week
* This Month
* Custom Range

---

## Dashboard

The dashboard displays:

* Total Income
* Total Expenses
* Current Balance
* Monthly Expense Chart

Current Balance is calculated as:

```text
Current Balance = Total Income - Total Expenses
```

---

# 🗄️ Database Model

## Expense

| Field    | Type     | Description        |
| -------- | -------- | ------------------ |
| Id       | Integer  | Primary Key        |
| Title    | String   | Expense title      |
| Amount   | Decimal  | Transaction amount |
| Category | String   | Expense category   |
| Date     | DateTime | Transaction date   |
| Type     | String   | Income or Expense  |
| Notes    | String   | Additional notes   |

---

# 🏗️ Backend Architecture

The backend follows a layered architecture.

```text
Controller
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Entity Framework Core
    ↓
SQLite Database
```

---

# 📡 API Endpoints

## Expenses

### Get all expenses

```http
GET /api/expenses
```

---

### Get expense by id

```http
GET /api/expenses/{id}
```

---

### Create expense

```http
POST /api/expenses
```

---

### Update expense

```http
PUT /api/expenses/{id}
```

---

### Delete expense

```http
DELETE /api/expenses/{id}
```

---

### Search by title

```http
GET /api/expenses/search?title=groceries
```

---

### Filter by category

```http
GET /api/expenses/category/{category}
```

---

### Filter by date range

```http
GET /api/expenses/date-range?startDate=2026-01-01&endDate=2026-01-31
```

---

### Get monthly totals

```http
GET /api/expenses/monthly-totals
```

---

# 🖥️ Frontend Pages

## Dashboard

Displays:

* Total Income
* Total Expenses
* Current Balance
* Monthly Chart

---

## Expense List

Displays:

* All expenses
* Search bar
* Category filters
* Date filters

---

## Add Expense

Form fields:

* Title
* Amount
* Category
* Date
* Type
* Notes

---

## Edit Expense

Allows users to modify existing expense information.

---

# ✅ Validation Rules

| Field    | Rule                      |
| -------- | ------------------------- |
| Title    | Required                  |
| Amount   | Must be greater than 0    |
| Category | Required                  |
| Date     | Required                  |
| Type     | Must be Income or Expense |
| Notes    | Optional                  |

---

# 🚀 Running the Project

## Backend

Navigate to the backend folder:

```bash
cd backend
```

Install packages:

```bash
dotnet restore
```

Create database:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

Backend URL:

```text
https://localhost:5001
```

---

## Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🎯 Future Improvements

Possible enhancements:

* User authentication
* Export data to CSV
* Dark mode
* Budget goals
* Notifications
* Recurring expenses
* Multi-currency support

---

# 📚 Learning Objectives

This project demonstrates:

* Full-stack application development
* REST API design
* React component architecture
* State management with React Hooks
* Database integration using Entity Framework Core
* Repository and Service patterns
* Data validation and filtering
* Dashboard and chart visualization

---

# 👨‍💻 Conclusion

The Personal Expense Tracker provides a practical solution for managing personal finances while demonstrating modern full-stack development practices using ASP.NET Core and React.

The application is built with clean architecture principles, reusable components, and scalable code organization, making it suitable for learning, portfolio projects, and future expansion.
