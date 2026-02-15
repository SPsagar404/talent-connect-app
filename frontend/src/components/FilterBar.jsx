import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterBar({ filters, onFilterChange, onClear }) {
    const [open, setOpen] = useState(false);
    const hasFilters = filters.status || filters.companyName || filters.startDate || filters.endDate;

    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: open ? '12px' : '0' }}>
                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px',
                        fontSize: '13px', fontWeight: 500, border: '1px solid #334155', cursor: 'pointer', transition: 'all 0.2s',
                        background: hasFilters ? 'rgba(79,70,229,0.15)' : 'transparent',
                        color: hasFilters ? '#818cf8' : '#94a3b8',
                    }}
                >
                    <FunnelIcon style={{ width: '16px', height: '16px' }} />
                    Filters {hasFilters && '•'}
                </button>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: '#f87171', background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer' }}
                    >
                        <XMarkIcon style={{ width: '14px', height: '14px' }} />
                        Clear
                    </button>
                )}
            </div>

            {open && (
                <div className="glass-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '4px' }}>Status</label>
                            <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className="select-dark">
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="SENT">Sent</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '4px' }}>Company</label>
                            <input
                                type="text"
                                value={filters.companyName}
                                onChange={(e) => onFilterChange('companyName', e.target.value)}
                                placeholder="Search company..."
                                className="input-dark"
                                style={{ padding: '10px 14px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '4px' }}>From Date</label>
                            <input type="date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className="input-dark" style={{ padding: '10px 14px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '4px' }}>To Date</label>
                            <input type="date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className="input-dark" style={{ padding: '10px 14px' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
