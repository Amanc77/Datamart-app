# DataMart - Mini SaaS Platform

DataMart is a **MERN Stack SaaS platform** where users can log in, explore sample datasets, apply filters, preview results, and purchase access to a custom number of rows. After payment, users can download their filtered data as a CSV file.

🔗 **Live Demo:** [https://datamart-app.vercel.app/](https://datamart-app.vercel.app/)

🎥 **Video Demo:** [https://youtu.be/QOSu3dbh2l8](https://youtu.be/QOSu3dbh2l8)

---

## 🧩 Features
- **User Authentication:** Secure login and signup using JWT.
- **Dataset Preview:** Users can view sample datasets (e.g., Startup Funding, Real Estate).
- **Dynamic Filters:** Filter data based on specific criteria (country, funding, year, etc.).
- **Custom Data Purchase:** Pay only for the number of rows you want.
- **Payment Integration:** Razorpay is used for handling payments.
- **Downloadable CSV:** Users receive their filtered data instantly after purchase.
- **Fully Deployed:** Frontend (Vercel) and Backend (connected to MongoDB) are live.

---

## 🛠️ Tech Stack
### Frontend:
- React.js (Vite)
- Axios
- Redux Toolkit
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- Razorpay API
- JWT Authentication

### Deployment:
- Frontend → Vercel  
- Backend → Render / Railway  
- Database → MongoDB Atlas

---

## ⚙️ Environment Variables
Create a `.env` file inside the `backend` folder and add the following:

```bash
# Server
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Frontend
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Razorpay
RAZORPAY_ID_KEY=your_razorpay_id_key
RAZORPAY_SECRET_KEY=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/datamart-app.git
cd datamart-app
```

### 2️⃣ Install Dependencies
#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

### 3️⃣ Run the App
#### Start Backend:
```bash
npm run dev
```

#### Start Frontend:
```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📂 Folder Structure
```
DATAMART-APP
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── app.js
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── features
│   │   ├── lib
│   │   ├── pages
│   │   └── store
│   └── package.json
```

---

## 🧠 Approach & Decisions
- Separated frontend and backend for cleaner structure.
- Used **JWT** for authentication and **MongoDB Atlas** for data storage.
- Razorpay was chosen for its simple test environment.
- Implemented filtering logic in the backend to fetch data efficiently.
- CSV generation is handled dynamically after payment verification.

---

## 📸 Screenshots
- Login Page
  <img width="3067" height="1485" alt="Screenshot from 2025-10-27 15-08-20" src="https://github.com/user-attachments/assets/1e1ca389-a73a-4393-a2c0-a39a318ca3fc" />

- Home Page
  <img width="3067" height="1485" alt="Screenshot from 2025-10-27 15-08-09" src="https://github.com/user-attachments/assets/f19856de-df7e-47ed-ad06-76f3d6ee5894" />
- Dataset Preview
  <img width="3067" height="1485" alt="Screenshot from 2025-10-27 15-08-02" src="https://github.com/user-attachments/assets/581ad421-a800-49d8-a074-80fe64f4899f" />

- My Purchases Page
   <img width="3067" height="1485" alt="Screenshot from 2025-10-27 15-07-50" src="https://github.com/user-attachments/assets/80a1039f-77e0-40f7-89c7-3b9468cecab3" />


---

## 💡 Future Improvements
- Add more datasets and filters.
- Implement user profile & subscription plans.
- Improve UI for dataset visualization.

---
