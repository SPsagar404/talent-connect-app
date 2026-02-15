import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await authService.login(form);
            login(res.data.data);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '16px' }}>
            {/* Background glow */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '25%', left: '25%', width: '384px', height: '384px', background: 'rgba(79,70,229,0.12)', borderRadius: '50%', filter: 'blur(128px)' }} />
                <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '320px', height: '320px', background: 'rgba(139,92,246,0.12)', borderRadius: '50%', filter: 'blur(128px)' }} />
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }} className="animate-fade-in">
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', marginBottom: '16px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>T</span>
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in to your Talent Connect account</p>
                </div>

                {/* Form card */}
                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="you@example.com"
                            className="input-dark"
                        />
                        {errors.email && <p style={{ marginTop: '4px', fontSize: '12px', color: '#f87171' }}>{errors.email}</p>}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••"
                            className="input-dark"
                        />
                        {errors.password && <p style={{ marginTop: '4px', fontSize: '12px', color: '#f87171' }}>{errors.password}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginTop: '20px' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#818cf8', fontWeight: 500, textDecoration: 'none' }}>Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
