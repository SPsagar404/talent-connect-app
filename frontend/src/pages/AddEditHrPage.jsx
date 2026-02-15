import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { hrService } from '../services/hrService';
import toast from 'react-hot-toast';

export default function AddEditHrPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({ hrName: '', email: '', mobileNumber: '', companyName: '', jobRole: '', notes: '' });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => { if (isEdit) loadHrDetail(); }, [id]);

    const loadHrDetail = async () => {
        try {
            const res = await hrService.getById(id);
            const d = res.data.data;
            setForm({ hrName: d.hrName || '', email: d.email || '', mobileNumber: d.mobileNumber || '', companyName: d.companyName || '', jobRole: d.jobRole || '', notes: d.notes || '' });
        } catch { toast.error('Failed to load'); navigate('/hr-management'); }
        finally { setLoading(false); }
    };

    const validate = () => {
        const e = {};
        if (!form.hrName.trim()) e.hrName = 'HR name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
        if (!form.companyName.trim()) e.companyName = 'Company name is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            if (isEdit) { await hrService.update(id, form); toast.success('HR contact updated'); }
            else { await hrService.create(form); toast.success('HR contact added'); }
            navigate('/hr-management');
        } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
        finally { setSaving(false); }
    };

    const handleChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => ({ ...p, [f]: null })); };

    if (loading) return <Layout><LoadingSpinner size="lg" /></Layout>;

    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' };
    const errStyle = { marginTop: '4px', fontSize: '12px', color: '#f87171' };

    return (
        <Layout>
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="animate-fade-in">
                <button onClick={() => navigate('/hr-management')} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px' }}>
                    <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
                    Back to HR Contacts
                </button>

                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '8px' }}>
                    {isEdit ? 'Edit HR Contact' : 'Add New HR Contact'}
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
                    {isEdit ? 'Update the contact details below' : 'Fill in the HR contact details to add to your outreach list'}
                </p>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={labelStyle}>HR Name <span style={{ color: '#f87171' }}>*</span></label>
                            <input type="text" value={form.hrName} onChange={(e) => handleChange('hrName', e.target.value)} placeholder="Jane Smith" className="input-dark" />
                            {errors.hrName && <p style={errStyle}>{errors.hrName}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
                            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="jane@company.com" className="input-dark" />
                            {errors.email && <p style={errStyle}>{errors.email}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Mobile Number</label>
                            <input type="tel" value={form.mobileNumber} onChange={(e) => handleChange('mobileNumber', e.target.value)} placeholder="+91 9876543210" className="input-dark" />
                        </div>
                        <div>
                            <label style={labelStyle}>Company Name <span style={{ color: '#f87171' }}>*</span></label>
                            <input type="text" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="Google" className="input-dark" />
                            {errors.companyName && <p style={errStyle}>{errors.companyName}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Job Role Hiring For</label>
                        <input type="text" value={form.jobRole} onChange={(e) => handleChange('jobRole', e.target.value)} placeholder="Senior Software Engineer" className="input-dark" />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Notes</label>
                        <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} placeholder="Any additional notes..." className="input-dark" style={{ resize: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={() => navigate('/hr-management')} className="btn-ghost">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {saving ? (
                                <><span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />{isEdit ? 'Updating...' : 'Adding...'}</>
                            ) : (isEdit ? 'Update Contact' : 'Add Contact')}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
