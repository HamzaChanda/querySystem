import React from 'react';

const levelStyles = {
  error: { borderLeft: '5px solid #e57373', background: '#ffebee' },
  warn: { borderLeft: '5px solid #ffb300', background: '#fff8e1' },
  info: { borderLeft: '5px solid #64b5f6', background: '#e3f2fd' },
  debug: { borderLeft: '5px solid #90a4ae', background: '#eceff1' },
};

export default function LogList({ logs }) {
  if (!logs.length) return <div>No logs found.</div>;
  return (
    <div className="log-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {logs.map((log, idx) => (
        <div
          key={idx}
          style={{
            padding: '1rem',
            borderRadius: '6px',
            ...levelStyles[log.level] || {},
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            [{log.level.toUpperCase()}] {log.timestamp} - {log.resourceId}
          </div>
          <div style={{ marginBottom: 4 }}>{log.message}</div>
          <div style={{ fontSize: '0.9em', color: '#555' }}>
            Trace: {log.traceId} | Span: {log.spanId} | Commit: {log.commit}
          </div>
          <div style={{ fontSize: '0.85em', color: '#888', marginTop: 2 }}>
            Metadata: <pre style={{ display: 'inline', margin: 0 }}>{JSON.stringify(log.metadata, null, 2)}</pre>
          </div>
        </div>
      ))}
    </div>
  );
} 