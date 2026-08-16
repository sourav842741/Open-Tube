# 📺 Open Tube


> **Open Tube** — A fully functional YouTube clone built with React, Node.js, and MongoDB. Upload, watch, like, comment, and manage videos with a smooth, modern UI.  

---

## 📺 Video Demo

> Watch Open Tube in action directly below.

### Home Page & Browse Videos
[![Watch Demo](https://github.com/sourav842741/Open-Tube/blob/711e4f77341c68ddcb42fe30b89521ff192810aa/Screenshot%202025-09-21%20235103.png)](https://res.cloudinary.com/dm9hpyepi/video/upload/v1758478198/Screen_Recording_2025-09-21_231202_1_1_1_iczgkd.mp4)



---

## ✨ Features

- 🎥 Upload & stream videos  
- ❤️ Like, dislike, and comment on videos  
- 🔍 Search videos by title or category  
- 🧑‍💻 User registration & authentication (JWT-based)  
- 📂 Channel creation & management  
- 📈 View counts & statistics  
- ⚡ Responsive and modern UI  

---

## 🧰 Tech Stack

- ⚛️ **React** + **Redux**  
- 🔀 **React Router DOM**  
- 📦 **Node.js** + **Express.js**  
- 🧪 **MongoDB** with Mongoose  
- 🎨 **Tailwind CSS**  
- ☁️ **Cloudinary** for video & thumbnail uploads  
- 🛠 JWT authentication, Axios for API calls, lazy loading  

---

## 📂 Project Structure

```base
open-tube/
├─ backend/
│  ├─ controller/
│  ├─ model/
│  ├─ routes/
│  ├─ config/
│  └─ index.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ redux/
│  │  ├─ services/
│  │  └─ App.jsx
├─ .env
├─ package.json
└─ README.md
```
## ♻️ Deployment

Open Tube can be deployed on Render, Vercel, or Netlify.

1. Build command: npm run build

2. Publish directory: build (frontend) or root (backend)

3. Add .env variables in hosting dashboard
---
## 📜 License

### This project is licensed under the MIT License.
See LICENSE file for details.

### ⭐ If you like this project, give it a star on GitHub!
---
## 🚀 Getting Started
Clone & Setup
```
# Clone repo
git clone https://github.com/<your-username>/open-tube.git
cd open-tube

# Install backend dependencies
npm install   # or yarn

# Start backend server
npm start     # or yarn start

# Install frontend dependencies
cd frontend
npm install
npm start     # or yarn start

# Production build
npm run build   # or yarn build
```
## ⚙️ Environment Variables

### Backend
Copy `backend/.env.example` to `backend/.env` and fill in your values.

```
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
USER_EMAIL=your_gmail_address
USER_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default `5000`) |
| `MONGODB_URL` | MongoDB connection string |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | Secret key for JWT signing |
| `USER_EMAIL` | Gmail address for sending OTP emails |
| `USER_PASSWORD` | Gmail app password (enable 2FA → create app password) |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |

### Frontend
Copy `frontend/.env.example` to `frontend/.env` and fill in your values.

```
VITE_FIREBASE_APIKEY=your_firebase_api_key
```

| Variable | Description |
|---|---|
| `VITE_FIREBASE_APIKEY` | Firebase web app API key for Google Sign-In |
