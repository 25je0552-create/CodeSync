# CodeSync

CodeSync is a full-stack real-time collaborative code editor that allows multiple users to join shared coding rooms, write and synchronize code in real time, execute code in multiple programming languages, and view active room members.

The project is built to explore real-time communication, authentication, collaborative systems, and full-stack application development.

## Features

- User signup and login
- JWT-based authentication using HTTP-only cookies
- Protected routes
- Create and join coding rooms
- Real-time code synchronization
- Shared room state for newly joined users
- Active room member tracking
- Real-time join and leave updates
- Multi-language code editor
- Code execution
- Output console
- Room ID sharing
- Leave room confirmation
- Responsive user interface

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Monaco Editor
- Axios
- React Router
- React Hot Toast
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt.js
- Cookie Parser
- CORS

## Project Structure

```text
CodeSync/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── socket.js
│   └── package.json
│
├── backend/
│   ├── server/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md