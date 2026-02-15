export default function LoadingSpinner({ size = 'md' }) {
    const sizes = { sm: 24, md: 36, lg: 48 };
    const s = sizes[size] || sizes.md;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
            <div style={{
                width: `${s}px`, height: `${s}px`,
                border: '3px solid #334155',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
