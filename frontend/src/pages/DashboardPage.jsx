import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    UserGroupIcon,
    PaperAirplaneIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { hrService } from '../services/hrService';
import Layout from '../components/Layout';
import ResumeUpload from '../components/ResumeUpload';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await hrService.getStats();
            setStats(res.data.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        { label: 'Total HR Contacts', value: stats.totalHrContacts, icon: UserGroupIcon, gradient: 'linear-gradient(135deg, #6366f1, #7c3aed)', shadow: 'rgba(99,102,241,0.25)' },
        { label: 'Emails Sent', value: stats.emailsSent, icon: PaperAirplaneIcon, gradient: 'linear-gradient(135deg, #10b981, #0d9488)', shadow: 'rgba(16,185,129,0.25)' },
        { label: 'Pending', value: stats.emailsPending, icon: ClockIcon, gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)', shadow: 'rgba(245,158,11,0.25)' },
        { label: 'Failed', value: stats.emailsFailed, icon: ExclamationTriangleIcon, gradient: 'linear-gradient(135deg, #ef4444, #e11d48)', shadow: 'rgba(239,68,68,0.25)' },
    ] : [];

    return (
        <Layout>
            <div className="animate-fade-in">
                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>Dashboard</h1>
                        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>Overview of your outreach activity</p>
                    </div>
                    <Link to="/hr-management" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Manage HR Contacts
                    </Link>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <LoadingSpinner size="lg" />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        {statCards.map(({ label, value, icon: Icon, gradient, shadow }, idx) => (
                            <div key={label} className="glass-card animate-fade-in" style={{ padding: '24px', animationDelay: `${idx * 80}ms` }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${shadow}` }}>
                                        <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
                                    </div>
                                </div>
                                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f1f5f9' }}>{value}</p>
                                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Resume Upload Section */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Your Resume</h2>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                        Upload your resume once and it will be automatically attached to all outreach emails.
                    </p>
                    <ResumeUpload />
                </div>
            </div>
        </Layout>
    );
}
