const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const LOGS_FILE = path.join(__dirname, 'logs.json');

app.use(cors());
app.use(express.json());

// Ensure logs.json exists
if (!fs.existsSync(LOGS_FILE)) {
  fs.writeFileSync(LOGS_FILE, '[]', 'utf-8');
}

// Helper: Validate log entry against schema
function validateLogEntry(entry) {
  const levels = ['error', 'warn', 'info', 'debug'];
  if (
    typeof entry !== 'object' ||
    typeof entry.level !== 'string' || !levels.includes(entry.level) ||
    typeof entry.message !== 'string' ||
    typeof entry.resourceId !== 'string' ||
    typeof entry.timestamp !== 'string' || isNaN(Date.parse(entry.timestamp)) ||
    typeof entry.traceId !== 'string' ||
    typeof entry.spanId !== 'string' ||
    typeof entry.commit !== 'string' ||
    typeof entry.metadata !== 'object' || Array.isArray(entry.metadata)
  ) {
    return false;
  }
  return true;
}

// Helper: Read logs from file
function readLogs() {
  try {
    const data = fs.readFileSync(LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: Write logs to file
function writeLogs(logs) {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

// POST /logs - Ingest a log entry
app.post('/logs', (req, res) => {
  const log = req.body;
  if (!validateLogEntry(log)) {
    return res.status(400).json({ message: 'Invalid log schema.' });
  }
  try {
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Failed to persist log.' });
  }
});

// GET /logs - Retrieve logs with filtering
app.get('/logs', (req, res) => {
  try {
    let logs = readLogs();
    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;

    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    if (message) {
      const msg = message.toLowerCase();
      logs = logs.filter(log => log.message.toLowerCase().includes(msg));
    }
    if (resourceId) {
      logs = logs.filter(log => log.resourceId === resourceId);
    }
    if (timestamp_start) {
      const start = Date.parse(timestamp_start);
      logs = logs.filter(log => Date.parse(log.timestamp) >= start);
    }
    if (timestamp_end) {
      const end = Date.parse(timestamp_end);
      logs = logs.filter(log => Date.parse(log.timestamp) <= end);
    }
    if (traceId) {
      logs = logs.filter(log => log.traceId === traceId);
    }
    if (spanId) {
      logs = logs.filter(log => log.spanId === spanId);
    }
    if (commit) {
      logs = logs.filter(log => log.commit === commit);
    }
    // Sort reverse-chronological by timestamp
    logs.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve logs.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 