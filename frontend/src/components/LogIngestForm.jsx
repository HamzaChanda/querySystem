import React, { useState } from 'react';
import { postLog } from '../api/logs';

const initialState = {
  level: '',
  message: '',
  resourceId: '',
  timestamp: '',
  traceId: '',
  spanId: '',
  commit: '',
  metadata: '{}',
};

const levels = ['error', 'warn', 'info', 'debug'];

export default function LogIngestForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    let metadataObj;
    try {
      metadataObj = JSON.parse(form.metadata || '{}');
    } catch {
      setError('Metadata must be valid JSON');
      setLoading(false);
      return;
    }
    const log = {
      ...form,
      metadata: metadataObj,
    };
    try {
      await postLog(log);
      setSuccess('Log ingested successfully!');
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="log-ingest-form" onSubmit={handleSubmit}>
      <h3 className="log-ingest-title">Ingest New Log</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <select name="level" value={form.level} onChange={handleChange} required className="log-ingest-select">
          <option value="" disabled>Select log level</option>
          {levels.map(lvl => <option key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</option>)}
        </select>
        <input name="message" value={form.message} onChange={handleChange} placeholder="Log message (e.g. 'Database connection failed')" required className="log-ingest-input" />
        <input name="resourceId" value={form.resourceId} onChange={handleChange} placeholder="Resource ID (e.g. 'server-1234')" required className="log-ingest-input" />
        <input name="timestamp" type="datetime-local" value={form.timestamp} onChange={handleChange} required className="log-ingest-input" />
        <input name="traceId" value={form.traceId} onChange={handleChange} placeholder="Trace ID (e.g. 'abc-xyz-123')" required className="log-ingest-input" />
        <input name="spanId" value={form.spanId} onChange={handleChange} placeholder="Span ID (e.g. 'span-456')" required className="log-ingest-input" />
        <input name="commit" value={form.commit} onChange={handleChange} placeholder="Commit hash (e.g. '5e5342f')" required className="log-ingest-input" />
        <input name="metadata" value={form.metadata} onChange={handleChange} placeholder='Metadata (JSON, e.g. {"parentResourceId": "server-5678"})' required className="log-ingest-input" />
      </div>
      <button type="submit" disabled={loading} className="log-ingest-btn">
        {loading ? 'Ingesting...' : 'Ingest Log'}
      </button>
      {error && <div style={{ color: '#dc2626', marginTop: 8, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: '#059669', marginTop: 8, fontWeight: 500 }}>{success}</div>}
    </form>
  );
} 