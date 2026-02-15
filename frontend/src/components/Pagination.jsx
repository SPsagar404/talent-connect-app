import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
    if (totalPages <= 1) return null;

    const btnStyle = (active) => ({
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'rgba(79,70,229,0.2)' : 'transparent',
        color: active ? '#818cf8' : '#94a3b8',
        transition: 'all 0.15s',
        minWidth: '36px',
    });

    const pages = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
                Showing page {page + 1} of {totalPages} ({totalElements} total)
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button onClick={() => onPageChange(page - 1)} disabled={page === 0} style={{ ...btnStyle(false), opacity: page === 0 ? 0.4 : 1 }}>
                    <ChevronLeftIcon style={{ width: '16px', height: '16px' }} />
                </button>
                {pages.map(p => (
                    <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p === page)}>
                        {p + 1}
                    </button>
                ))}
                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} style={{ ...btnStyle(false), opacity: page >= totalPages - 1 ? 0.4 : 1 }}>
                    <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
                </button>
            </div>
        </div>
    );
}
