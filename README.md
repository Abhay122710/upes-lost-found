# 🎒 UPES Lost & Found System

A modern web-based platform designed to help students at UPES report, track, and claim lost or found items efficiently.

---

## 📌 Project Overview

The **UPES Lost & Found System** is a full-stack web application that provides a centralized solution for managing lost and found items within the university campus.

Students can:

* Report lost items
* Post found items
* Search and filter items
* Claim items with proof verification

---

## 🚀 Features

### 🔐 Authentication System

* User Signup (with SAP ID)
* Secure Login
* Forgot Password (with security questions)

---

### 📋 Dashboard

* Personalized user dashboard
* Quick navigation to all features
* View activity and claims

---

### 🔍 Lost & Found Listings

* Add lost items with image upload
* Add found items with details
* Browse all items
* Filter by category, date, and location

---

### 📸 Image Upload

* Upload item images
* Preview before submission

---

### 🧾 Claim System

* Claim found items
* Upload proof of ownership
* Claim status:

  * Pending
  * Approved
  * Rejected

---

### 🤖 AI Chatbot (Optional)

* Integrated chatbot using **Google Dialogflow**
* Helps users navigate and find items

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Java
* Spring Boot

### Tools & Design

* Figma (UI Design)
* REST APIs

### Database

* (Add your DB here: MySQL / Firebase / Supabase)

---

## 📂 Project Structure

```
UPES-Lost-And-Found/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── styles/
│   ├── scripts/
│
├── backend/
│   ├── src/main/java/
│   ├── controller/
│   ├── service/
│   ├── model/
│   ├── repository/
│
├── assets/
│   ├── images/
│
├── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/upes-lost-found.git
cd upes-lost-found
```

---

### 2️⃣ Backend Setup (Spring Boot)

* Open project in IntelliJ / VS Code
* Configure `application.properties`
* Add database credentials

Run the backend:

```
mvn spring-boot:run
```

---

### 3️⃣ Frontend Setup

* Open `index.html` in browser
  OR
* Use Live Server in VS Code

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint    | Description    |
| ------ | ----------- | -------------- |
| GET    | /items      | Get all items  |
| POST   | /items      | Add new item   |
| GET    | /items/{id} | Get item by ID |
| POST   | /claims     | Submit claim   |

---


---

## 📈 Future Enhancements

* 🔔 Real-time notifications
* 🌙 Dark mode
* 📊 Analytics dashboard
* 🤖 Advanced AI-based item matching
* 📱 Mobile app version

---

## 👨‍💻 Author

**Abhay Chaudhary**
B.Tech CSE (Gaming & Graphics)
UPES

---

## 📄 License

This project is for educational purposes.

---

## ⭐ Acknowledgements

* UPES (University of Petroleum and Energy Studies)
* Open-source community
