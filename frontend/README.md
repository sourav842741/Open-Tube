# 📺 Open Tube

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](#)  
[![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)  
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)  
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

> **Open Tube** — A fully functional YouTube clone built with React, Node.js, and MongoDB. Upload, watch, like, comment, and manage videos with a smooth, modern UI.  

---

## 📺 Video Demo

> Watch Open Tube in action directly below.

### Home Page & Browse Videos
<video width="600" controls>
  <source src="https://www.example.com/video1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Video Playback & Comments
<video width="600" controls>
  <source src="https://www.example.com/video2.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

## ✨ Features

- 🎥 Upload & stream videos  
- ❤️ Like, dislike, and comment on videos  
- 🔍 Search videos by title or category  
- 🧑‍💻 User registration & authentication (JWT-based)  
- 📂 Channel creation & management  
- 📈 View counts & statistics  
- ⚡ Responsive and modern UI  
- 🌐 Offline detection & shimmer loading  

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
```
PORT=
MONGOURL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL=
EMAIL_PASS=
```
### Frontend
```
VITE_FIREBASE_APIKEY=
```