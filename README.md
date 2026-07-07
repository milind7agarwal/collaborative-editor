# Collaborative Editor

A real-time collaborative code editor built with React, Monaco Editor, Yjs, and Socket.IO.

## Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously.
- **Code Editor**: Powered by Monaco Editor, providing a VS Code-like editing experience in the browser.
- **CRDTs**: Uses Yjs for efficient conflict resolution and state synchronization.
- **Modern Frontend**: Built with React 19, Vite, and TailwindCSS 4.
- **Backend Server**: Node.js and Express backend using Socket.IO for WebSocket communication.
- **Dockerized**: Includes a multi-stage Dockerfile for easy deployment.

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Monaco Editor (`@monaco-editor/react`)
- Yjs & y-monaco (for collaborative editing)
- y-socket.io

### Backend
- Node.js
- Express
- Socket.IO
- y-socket.io

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or yarn

### Running Locally

1. **Install Backend Dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Run Backend Development Server:**
   ```bash
   npm run dev
   ```

3. **Install Frontend Dependencies:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Frontend Development Server:**
   ```bash
   npm run dev
   ```

### Docker Build

You can build and run the entire application using Docker. The multi-stage Dockerfile builds the Vite frontend and serves the static files through the Node.js backend.

```bash
docker build -t collaborative-editor .
docker run -p 3000:3000 collaborative-editor
```
*(Make sure to adjust the port mapping if your backend server runs on a different port)*

## Project Structure

- `frontend/`: Contains the React + Vite application.
- `Backend/`: Contains the Node.js Express server and Socket.IO setup.
- `TODO.md`: Pending tasks and improvements for the project.
- `dockerfile`: Multi-stage Docker setup.
