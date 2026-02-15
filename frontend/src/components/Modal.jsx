import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const widthMap = { 'max-w-sm': '384px', 'max-w-md': '448px', 'max-w-lg': '512px', 'max-w-xl': '576px' };
    const modalWidth = widthMap[maxWidth] || '448px';

    return createPortal(
        <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Backdrop */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

            {/* Modal content */}
            <div
                className="glass-card animate-fade-in"
                style={{ position: 'relative', width: '100%', maxWidth: modalWidth, padding: '24px', border: '1px solid #334155' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{ padding: '6px', borderRadius: '8px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <XMarkIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}
