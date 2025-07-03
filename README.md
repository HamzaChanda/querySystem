Log Ingestion and Querying System

Overview

This is a full-stack Log Ingestion and Querying System that simulates a real-world developer tool for monitoring and debugging applications.

Tech Stack

- Backend: Node.js and Express
- Frontend: React (using Vite)
- Data Storage: File-based JSON persistence (`logs.json`), no external database

Core Features

Log Ingestion

- Accepts POST requests to ingest log entries in a predefined JSON schema
- Validates incoming log data before storing

Log Querying

- Displays logs in reverse-chronological order
- Full-text, case-insensitive search on the `message` field
- Filters available for:
  - Log `level` (e.g., error, warn, info, debug)
  - `resourceId`
  - Timestamp range (`timestamp_start`, `timestamp_end`)
  - `traceId`, `spanId`, and `commit`
- Supports combining multiple filters simultaneously

Frontend

- Built with React and Vite
- Clean, modern UI with:
  - Table/list view of logs
  - Color-coded visual cues for log levels
  - Filter bar with dynamic search
  - Responsive layout for desktop use

Getting Started (Local Development)

1. Clone the Repository

bash
git clone <your-repo-url>
cd querySystem


2. Backend Setup

bash
cd backend
npm install


3. Frontend Setup

bash
cd ../frontend
npm install


Running the Project Locally

Start the Backend

bash
cd backend
npm start


Runs on: `http://localhost:4000`

Start the Frontend

bash
cd frontend
npm run dev


Runs on: `http://localhost:5173` (or the address shown in terminal)

Optional: Ingest Sample Logs

bash
cd backend
node ingest-sample-data.js


This will send predefined sample logs to the backend for testing.

Deployment (Render or Other Platforms)

To deploy as a single full-stack app:

1. Build the Frontend

bash
cd frontend
npm run build


Move the build output to backend:

bash
mv dist ../backend/public


2. Deploy the Backend Folder

- Use Render (or any other service)
- Set root directory to `backend`
- Build command: `npm install`
- Start command: `npm start`

The backend server will serve both the API and the static frontend.

Make sure your `server.js` includes this for serving the frontend:

js
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


Design Decisions

- Logs are persisted in `logs.json` to meet the no-external-database requirement.
- All filtering and searching are handled in-memory using Node.js array methods.
- Frontend uses only React hooks (`useState`, `useEffect`) for state management.
- API communication is done using the Fetch API.
- UI prioritizes clarity, simplicity, and developer usability.

Bonus Features

- Script and sample file included for ingesting test data.
- Color-coded log levels in the frontend for better visibility.

Assumptions

- The application runs locally or is deployed with the frontend served by the backend.
- No authentication or user access control is required.
- The logs used are non-sensitive and for demonstration purposes only.

Contact

If you have any questions, please contact the project author or raise an issue in the repository.
