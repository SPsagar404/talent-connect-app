export default function StatusBadge({ status }) {
    const styles = {
        PENDING: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' },
        SENT: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' },
        FAILED: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
    };

    const s = styles[status] || styles.PENDING;

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...s }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
            {status}
        </span>
    );
}
