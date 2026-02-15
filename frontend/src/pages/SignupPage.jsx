import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required';
        else if (form.fullName.trim().length < 2) errs.fullName = 'Name must be at least 2 characters';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'At least 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await authService.signup({ fullName: form.fullName, email: form.email, password: form.password });
            login(res.data.data);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const errStyle = { marginTop: '4px', fontSize: '12px', color: '#f87171' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '16px' }}>
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '33%', right: '33%', width: '384px', height: '384px', background: 'rgba(79,70,229,0.12)', borderRadius: '50%', filter: 'blur(128px)' }} />
                <div style={{ position: 'absolute', bottom: '33%', left: '33%', width: '320px', height: '320px', background: 'rgba(139,92,246,0.12)', borderRadius: '50%', filter: 'blur(128px)' }} />
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }} className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', marginBottom: '16px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>T</span>
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Create Account</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Start managing your job outreach today</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" className="input-dark" />
                        {errors.fullName && <p style={errStyle}>{errors.fullName}</p>}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-dark" />
                        {errors.email && <p style={errStyle}>{errors.email}</p>}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" className="input-dark" />
                        {errors.password && <p style={errStyle}>{errors.password}</p>}
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" className="input-dark" />
                        {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginTop: '20px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#818cf8', fontWeight: 500, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
