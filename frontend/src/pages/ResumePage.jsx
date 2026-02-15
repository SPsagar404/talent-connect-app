import Layout from '../components/Layout';
import ResumeUpload from '../components/ResumeUpload';

export default function ResumePage() {
    return (
        <Layout>
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="animate-fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '8px' }}>Resume</h1>
                <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
                    Upload your resume here. It will be automatically attached to all outreach emails you send.
                </p>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Upload Resume</h2>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
                        Supported formats: PDF, DOC, DOCX. Maximum file size: 10MB.
                    </p>
                    <ResumeUpload />
                </div>
            </div>
        </Layout>
    );
}
