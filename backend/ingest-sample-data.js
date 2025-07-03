const fs = require('fs');
const path = require('path');

const SAMPLE_FILE = path.join(__dirname, 'sample-logs.json');
const API_URL = process.env.API_URL || 'http://localhost:4000/logs';

async function ingest() {
  let fetch;
  try {
    fetch = (await import('node-fetch')).default;
  } catch (e) {
    console.error('node-fetch is not installed. Run: npm install node-fetch');
    process.exit(1);
  }

  const logs = JSON.parse(fs.readFileSync(SAMPLE_FILE, 'utf-8'));
  for (const log of logs) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!res.ok) {
        console.error('Failed to ingest log:', await res.text());
      } else {
        console.log('Ingested log:', log.message);
      }
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error('ERROR: Backend is not running at http://localhost:4000. Start the backend first!');
        process.exit(1);
      } else {
        console.error('Error:', err);
      }
    }
  }
}

ingest(); 