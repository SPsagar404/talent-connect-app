import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    TrashIcon,
    EnvelopeIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { hrService } from '../services/hrService';
import { emailService } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function HrManagementPage() {
    const { user } = useAuth();
    const [hrList, setHrList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState({ status: '', companyName: '', startDate: '', endDate: '' });
    const [emailModal, setEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({ subject: '', body: '' });
    const [sending, setSending] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchHrList = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, size: 10 };
            if (filters.status) params.status = filters.status;
            if (filters.companyName) params.companyName = filters.companyName;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            const res = await hrService.getAll(params);
            const data = res.data.data;
            setHrList(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch { toast.error('Failed to load HR contacts'); }
        finally { setLoading(false); }
    }, [page, filters]);

    useEffect(() => { fetchHrList(); }, [fetchHrList]);

    const toggleSelect = (id) => {
        setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    };
    const toggleSelectAll = () => {
        setSelected(selected.size === hrList.length ? new Set() : new Set(hrList.map(h => h.id)));
    };
    const handleFilterChange = (key, value) => { setFilters(p => ({ ...p, [key]: value })); setPage(0); };
    const clearFilters = () => { setFilters({ status: '', companyName: '', startDate: '', endDate: '' }); setPage(0); };

    const handleDelete = async () => {
        if (!deleteId) return;
        try { await hrService.delete(deleteId); toast.success('HR contact deleted'); setDeleteId(null); fetchHrList(); }
        catch { toast.error('Failed to delete'); }
    };

    const handleSendEmails = async () => {
        if (!emailForm.subject.trim() || !emailForm.body.trim()) { toast.error('Please fill in both subject and body'); return; }
        if (!user?.hasResume) { toast.error('Please upload your resume first from the Dashboard'); return; }
        setSending(true);
        try {
            const res = await emailService.send({ hrDetailIds: Array.from(selected), subject: emailForm.subject, body: emailForm.body });
            const r = res.data.data;
            toast.success(`Sent: ${r.successCount}, Failed: ${r.failCount}`);
            setEmailModal(false); setEmailForm({ subject: '', body: '' }); setSelected(new Set()); fetchHrList();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to send emails'); }
        finally { setSending(false); }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

    const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' };
    const tdStyle = { padding: '12px 16px', fontSize: '13px' };
    const actionBtn = (color, hoverBg) => ({
        padding: '6px', borderRadius: '8px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s', display: 'inline-flex',
    });

    return (
        <Layout>
            <div className="animate-fade-in">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>HR Contacts</h1>
                        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>Manage your outreach contacts</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {selected.size > 0 && (
                            <button onClick={() => setEmailModal(true)} className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <PaperAirplaneIcon style={{ width: '16px', height: '16px' }} />
                                Send Email ({selected.size})
                            </button>
                        )}
                        <Link to="/hr-management/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                            <PlusIcon style={{ width: '16px', height: '16px' }} />
                            Add Contact
                        </Link>
                    </div>
                </div>

                <FilterBar filters={filters} onFilterChange={handleFilterChange} onClear={clearFilters} />

                {/* Table or empty state */}
                {loading ? (
                    <LoadingSpinner size="lg" />
                ) : hrList.length === 0 ? (
                    <div className="glass-card" style={{ padding: '64px', textAlign: 'center' }}>
                        <UserGroupIcon style={{ width: '64px', height: '64px', color: '#475569', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>No HR contacts found</h3>
                        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Add your first HR contact to start outreach</p>
                        <Link to="/hr-management/add" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                            <PlusIcon style={{ width: '16px', height: '16px' }} />
                            Add Contact
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #334155' }}>
                                        <th style={{ ...thStyle, width: '40px' }}>
                                            <input type="checkbox" checked={selected.size === hrList.length && hrList.length > 0} onChange={toggleSelectAll} />
                                        </th>
                                        <th style={thStyle}>HR Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Company</th>
                                        <th style={thStyle}>Job Role</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Date Added</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hrList.map((hr) => (
                                        <tr key={hr.id} style={{ borderBottom: '1px solid #1e293b', background: selected.has(hr.id) ? 'rgba(79,70,229,0.08)' : 'transparent', transition: 'background 0.15s' }}>
                                            <td style={tdStyle}><input type="checkbox" checked={selected.has(hr.id)} onChange={() => toggleSelect(hr.id)} /></td>
                                            <td style={tdStyle}><span style={{ fontWeight: 500, color: '#e2e8f0' }}>{hr.hrName}</span></td>
                                            <td style={tdStyle}><span style={{ color: '#94a3b8' }}>{hr.email}</span></td>
                                            <td style={tdStyle}><span style={{ color: '#cbd5e1' }}>{hr.companyName}</span></td>
                                            <td style={tdStyle}><span style={{ color: '#94a3b8' }}>{hr.jobRole || '—'}</span></td>
                                            <td style={tdStyle}><StatusBadge status={hr.emailStatus} /></td>
                                            <td style={tdStyle}><span style={{ color: '#94a3b8' }}>{formatDate(hr.dateAdded)}</span></td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                    <button onClick={() => { setSelected(new Set([hr.id])); setEmailModal(true); }} title="Send email" style={actionBtn()}>
                                                        <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                                                    </button>
                                                    <Link to={`/hr-management/edit/${hr.id}`} title="Edit" style={{ ...actionBtn(), textDecoration: 'none', color: '#94a3b8' }}>
                                                        <PencilSquareIcon style={{ width: '16px', height: '16px' }} />
                                                    </Link>
                                                    <button onClick={() => setDeleteId(hr.id)} title="Delete" style={actionBtn()}>
                                                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '12px 16px' }}>
                            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />
                        </div>
                    </div>
                )}

                {/* Email compose modal */}
                <Modal isOpen={emailModal} onClose={() => { setEmailModal(false); setEmailForm({ subject: '', body: '' }); }}
                    title={`Send Email to ${selected.size} contact${selected.size !== 1 ? 's' : ''}`} maxWidth="max-w-xl">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>Subject</label>
                            <input type="text" value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} placeholder="Application for Software Engineer position" className="input-dark" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '6px' }}>Body</label>
                            <textarea value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} rows={6}
                                placeholder="Dear HR Manager,&#10;&#10;I am writing to express my interest in..."
                                className="input-dark" style={{ resize: 'none' }} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>📎 Your resume will be automatically attached to the email.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
                            <button onClick={() => { setEmailModal(false); setEmailForm({ subject: '', body: '' }); }} className="btn-ghost">Cancel</button>
                            <button onClick={handleSendEmails} disabled={sending} className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {sending ? (
                                    <><span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />Sending...</>
                                ) : (<><PaperAirplaneIcon style={{ width: '16px', height: '16px' }} />Send</>)}
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Delete modal */}
                <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Contact">
                    <p style={{ color: '#cbd5e1', marginBottom: '24px', fontSize: '14px' }}>Are you sure you want to delete this HR contact? This action cannot be undone.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
                        <button onClick={handleDelete} className="btn-danger">Delete</button>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}
