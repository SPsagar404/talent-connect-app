import { useState, useRef } from 'react';
import { ArrowUpTrayIcon, CheckCircleIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { resumeService } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ResumeUpload() {
    const { user, updateResumeStatus } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(ext)) { toast.error('Only PDF/DOC/DOCX'); return; }
        if (file.size > 10 * 1024 * 1024) { toast.error('Max 10MB'); return; }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            await resumeService.upload(formData);
            updateResumeStatus(true, file.name);
            toast.success('Resume uploaded!');
        } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
        finally { setUploading(false); }
    };

    const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

    if (user?.hasResume) {
        return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <CheckCircleIcon style={{ width: '40px', height: '40px', color: '#10b981', margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>Resume uploaded</p>
                {user.resumeName && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(30,41,59,0.6)', fontSize: '13px', color: '#94a3b8', margin: '8px 0' }}>
                        <DocumentIcon style={{ width: '14px', height: '14px' }} />
                        {user.resumeName}
                    </div>
                )}
                <br />
                <button
                    onClick={() => fileRef.current?.click()}
                    style={{ marginTop: '8px', fontSize: '13px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Click to replace
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>
        );
    }

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
                padding: '40px 24px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                border: `2px dashed ${dragOver ? '#6366f1' : '#334155'}`,
                background: dragOver ? 'rgba(79,70,229,0.08)' : 'transparent',
            }}
        >
            {uploading ? (
                <div>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #334155', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>Uploading...</p>
                </div>
            ) : (
                <>
                    <ArrowUpTrayIcon style={{ width: '36px', height: '36px', color: '#64748b', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>
                        Drag & drop your resume here, or <span style={{ color: '#818cf8' }}>browse</span>
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>PDF, DOC, DOCX • Max 10MB</p>
                </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
