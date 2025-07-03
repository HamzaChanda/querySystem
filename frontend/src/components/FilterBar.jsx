import React from 'react';

const levels = ['error', 'warn', 'info', 'debug'];

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
      {/* Message search */}
      <input
        type="text"
        placeholder="Search message..."
        value={filters.message || ''}
        onChange={e => onChange({ ...filters, message: e.target.value })}
        style={{ flex: 2 }}
      />
      {/* Level dropdown */}
      <select
        value={filters.level || ''}
        onChange={e => onChange({ ...filters, level: e.target.value })}
        style={{ flex: 1 }}
      >
        <option value="">All Levels</option>
        {levels.map(lvl => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>
      {/* ResourceId */}
      <input
        type="text"
        placeholder="Resource ID..."
        value={filters.resourceId || ''}
        onChange={e => onChange({ ...filters, resourceId: e.target.value })}
        style={{ flex: 1 }}
      />
      {/* Timestamp start */}
      <input
        type="datetime-local"
        value={filters.timestamp_start || ''}
        onChange={e => onChange({ ...filters, timestamp_start: e.target.value })}
        style={{ flex: 1 }}
      />
      {/* Timestamp end */}
      <input
        type="datetime-local"
        value={filters.timestamp_end || ''}
        onChange={e => onChange({ ...filters, timestamp_end: e.target.value })}
        style={{ flex: 1 }}
      />
    </div>
  );
} 