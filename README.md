# 🎓 ASTU COMPLAINT MANAGEMENT SYSTEM  
# 🚨 THIS IS A FRONTEND PROJECT 🚨

---

## 📌 Project Overview

The ASTU Complaint Management System is a frontend web application designed to help university students submit complaints and allow staff members to manage and resolve them efficiently.

This system simulates a real-world complaint workflow including:

- Student complaint submission
- Category selection
- Staff status updates
- Admin category management
- Notification system for students
- Staff remarks on complaints

The project uses **HTML, CSS, and JavaScript** and stores data using **LocalStorage**.

---

## 🛠 Technologies Used

- HTML5  
- CSS3  
- JavaScript (Vanilla JS)  
- Browser LocalStorage  

---

## 📂 Project Structure

```
astu-complaint-system/
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── index.html
│
└── README.md
```

---

## 👥 User Roles & Features

### 🎓 Student
- Login as student
- Submit complaints
- Select complaint category
- Upload file (optional)
- Track complaint status
- View staff remarks
- Receive status update notifications

---

### 👨‍💼 Staff
- Login as staff
- View assigned complaints
- Update complaint status (Pending / In Progress / Resolved)
- Add remarks to complaints

---

### 🛠 Admin
- Add new complaint categories
- Delete existing categories
- Manage system categories dynamically

---

## 🔔 Notification System

When a staff member updates a complaint status:
- The system sets a notification flag
- The student sees a notification on next login
- Notification clears automatically after being viewed

---

## 💾 Data Storage

All data is stored in the browser using **LocalStorage**:
- Users
- Categories
- Complaints
- Status updates
- Remarks
- Notifications

No backend or database is used in this version.

---

## 🚀 How to Run the Project

1. Clone the repository:
   ```
   git clone 
   
   ```

2. Open the project folder in VS Code.

3. Open `index.html` in your browser.

No server setup required.

---

## 📌 Future Improvements

- Backend integration (Node.js / Django / Flask)
- Real database connection
- Department-based password system
- Authentication system improvement
- Email notifications
- Responsive mobile design

---

## 👩‍💻 Author

Developed by Selamawit Dereje  
Computer Science and Engineering Student   

---

## ⭐ Project Status

Frontend version complete  
Ready for backend integration