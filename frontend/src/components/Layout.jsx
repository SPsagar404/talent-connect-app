import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserGroupIcon,
    DocumentArrowUpIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
        { path: '/hr-management', icon: UserGroupIcon, label: 'HR Contacts' },
        { path: '/resume', icon: DocumentArrowUpIcon, label: 'Resume' },
    ];

    const sidebarStyle = {
        width: '256px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30,
        backdropFilter: 'blur(12px)',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020617', display: 'flex' }}>
            {/* Sidebar */}
            <aside style={sidebarStyle}>
                {/* Brand */}
                <div style={{ padding: '24px', borderBottom: '1px solid #1e293b' }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>T</span>
                        </div>
                        <div>
                            <h1 className="gradient-text" style={{ fontSize: '16px', fontWeight: 'bold' }}>TalentConnect</h1>
                            <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Outreach Manager</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const active = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    background: active ? 'rgba(79,70,229,0.15)' : 'transparent',
                                    color: active ? '#818cf8' : '#94a3b8',
                                    boxShadow: active ? '0 2px 8px rgba(79,70,229,0.1)' : 'none',
                                }}
                            >
                                <Icon style={{ width: '20px', height: '20px' }} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '0 8px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</p>
                            <p style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <ArrowRightStartOnRectangleIcon style={{ width: '16px', height: '16px' }} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content — offset for sidebar */}
            <main style={{ flex: 1, marginLeft: '256px', padding: '32px' }}>
                {children}
            </main>
        </div>
    );
}
