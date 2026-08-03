# 🚀 InterviewForge

InterviewForge is a full-stack technical interview platform designed for conducting real-time coding interviews. It provides a collaborative coding environment with interviewer and candidate dashboards, secure authentication, live communication, interview management, and candidate evaluation.

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication
- Interviewer & Candidate Roles
- Secure Login & Signup
- Protected Routes

### 💻 Live Coding
- Monaco Code Editor
- Real-time Collaborative Editing
- Multiple Programming Languages
- Lock / Unlock Editor
- Code Synchronization

### 🎯 Interview Management
- Create Interview Sessions
- Unique Interview Links
- Candidate Invitations
- Interview Timer
- End Interview
- Remove Candidate

### 👥 Real-time Collaboration
- Live Participants
- Live Chat
- Activity Feed
- Language Synchronization

### 🛡️ Interview Monitoring
- Tab Switch Detection
- Fullscreen Exit Detection
- Copy Detection
- Paste Detection

### 📊 Evaluation
- Scorecard Submission
- Notes Panel
- Download Interview Transcript
- Interview History

### 📈 Dashboards
#### Interviewer Dashboard
- Create Interviews
- View Interview History
- Track Completed Interviews

#### Candidate Dashboard
- Join Interviews
- View Previous Interviews

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Monaco Editor
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- bcrypt

---

## 📂 Project Structure

```
client/
server/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/InterviewForge.git
```

### Install Dependencies

Client

```bash
cd client
npm install
```

Server

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` inside **server**

```env
PORT=4000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
```

---

## Run Project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## Future Improvements

- AI Interview Assistant
- AI Code Evaluation
- Calendar Scheduling
- Email Invitations
- Bulk Delete Interview History
- Search & Filters
- Analytics Dashboard

---

## License

MIT License
