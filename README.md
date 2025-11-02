# 🧩 Coaching Programme Management System

##  📖 Overview
The **Coaching Programme Management System** is a full-stack web application designed to streamline the management of child development programmes across communities.  
It provides a centralized platform for managing **child profiles**, **attendance**, **home visits**, **coach assignments**, and **programme reports**.

Built with a **React frontend**, **Django REST Framework backend**, and **PostgreSQL database**, it ensures scalability, data integrity, and a user-friendly experience.

---

## 🚀 Features

### 👦 Child Profile Management
- Maintain unified records for each child across communities and programmes.  
- Track transfer history and dual-programme participation.  
- Bulk upload and edit profiles via Excel.

### 🧾 Attendance Tracking
- Record attendance for sessions in real-time.  
- Auto-update attendance in child profiles.  
- Generate session-wise attendance reports.

### 🏠 Home Visit Management
- Record, track, and manage home visit details.  
- Monitor frequency and outcome of visits.  
- Integrated with child profiles for better insights.

### 🧑‍🏫 Coach Management
- Manage coach profiles, assignments, and schedules.  
- Link coaches to communities or programmes.  
- Role-based dashboard access.

### 📊 Reports & Analytics
- Generate comprehensive programme and attendance reports.  
- Export reports to Excel/PDF formats.  
- Dashboard with visual statistics for quick insights.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Create React App), CSS3 (Grid, Flexbox, Float), Axios, Chart.js |
| **Backend** | Django, Django REST Framework, JWT Authentication (`rest_framework_simplejwt`) |
| **Database** | PostgreSQL |
| **Tools** | Git, Postman, VS Code, Virtual Environment (venv) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/coaching-programme-management.git
cd coaching-programme-management
```

### 2️⃣ Setup Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # For Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs on http://127.0.0.1:8000/
### 3️⃣ Setup Frontend (React)
```bash
cd ../frontend
npm install
npm start
```
Frontend runs on http://localhost:3000/

### 🔐 Authentication
The backend uses JWT (JSON Web Token) authentication.
To access secured endpoints:


1. Login via /api/token/ to receive access and refresh tokens.


2. Include the token in API headers:
 Authorization: Bearer <access_token>



### 🧮 Database Schema
| **Table Name**   | **Description** |
|------------------|-----------------|
| `ChildProfile`   | Stores all child-related data and history |
| `Attendance`     | Tracks session-wise attendance |
| `HomeVisit`      | Records home visit details |
| `Coach`          | Manages coach details and programme assignments |
| `Report`         | Stores generated reports |
| `Program`        | Defines programme-level information |

### 📂 Folder Structure
```java
coaching_app/
├── backend/
│   ├── manage.py
│   ├── core/
│   ├── ChildProfiles/
│   ├── Attendance/
│   ├── HomeVisits/
│   ├── Coaches/
│   └── Reports/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
└── README.md
```

### 📸 Screenshots



![Dashboard Screenshot](https://github.com/user-attachments/assets/d70de8b7-57e9-461b-9e86-5eae256bf196)

![Attendance Page](https://github.com/user-attachments/assets/9d522f1d-761b-4a6b-80f9-302d10384624)



### 📈 Future Enhancements


1. Email/SMS alerts for attendance or visit updates


2. Calendar integration for session scheduling


3. Export dashboards as PDF/CSV


4. Dark Mode toggle for UI


5. Advanced filters and search



### 🧑‍💻 Contributors


- Vimal M (CIT College) – Developer & Project Lead
- Ravindran S (CIT College) – Developer 
- Thulasiram K (CIT College) – Developer 
- Padmavibhav Senthilkumar (CIT College) – Developer 


Open for contributions! Feel free to fork this repo and submit pull requests.



### 🪪 License
This project is licensed under the MIT License.
See the LICENSE file for more information.





