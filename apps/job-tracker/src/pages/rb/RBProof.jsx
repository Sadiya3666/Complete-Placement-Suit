import React, { useState, useEffect } from 'react';
import { RB_STEPS } from '../../data/rb_steps';

const RBProof = () => {
    const [stats, setStats] = useState([]);
    const [testsPassed, setTestsPassed] = useState(false);
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        // Load Build Steps
        const stepStats = RB_STEPS.map(step => ({
            ...step,
            completed: !!localStorage.getItem(step.artifactKey)
        }));
        setStats(stepStats);

        // Load QA Checklist status
        const checklist = JSON.parse(localStorage.getItem('rb_checklist_data')) || {};
        const passedCount = Object.values(checklist).filter(Boolean).length;
        setTestsPassed(passedCount === 10);

        // Load Submission Links
        const savedLinks = JSON.parse(localStorage.getItem('rb_final_submission')) || {
            lovable: '',
            github: '',
            deploy: ''
        };
        setLinks(savedLinks);
    }, []);

    const isValidUrl = (url) => {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleLinkChange = (field, value) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);
        localStorage.setItem('rb_final_submission', JSON.stringify(newLinks));
    };

    const isAllStepsCompleted = stats.every(s => s.completed);
    const areLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
    const isShipped = isAllStepsCompleted && testsPassed && areLinksValid;

    const handleCopySubmission = () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;

        navigator.clipboard.writeText(text);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
    };

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Final Confirmation</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>Project 3: AI Resume Builder Deployment Proof</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '32px',
                        backgroundColor: isShipped ? '#E8F5E9' : '#FFF5F5',
                        border: `1px solid ${isShipped ? '#C8E6C9' : '#FFDADA'}`,
                        color: isShipped ? '#2E7D32' : '#C62828',
                        fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isShipped ? '#2E7D32' : '#C62828' }} />
                        Status: {isShipped ? 'Shipped' : 'In Progress'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '64px' }}>
                {/* Build Track & Verification */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <section>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '24px', color: 'var(--color-text-primary)' }}>1. Build Track Progress</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {stats.map(step => (
                                <div key={step.id} style={{
                                    padding: '16px', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{step.number}. {step.title}</span>
                                    {step.completed ?
                                        <span style={{ color: '#2E7D32', fontSize: '12px', fontWeight: 700 }}>✓</span> :
                                        <span style={{ color: '#D32F2F', fontSize: '10px', textTransform: 'uppercase' }}>Pending</span>
                                    }
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '16px', color: 'var(--color-text-primary)' }}>2. QA Integrity Check</h2>
                        <div style={{
                            padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: testsPassed ? '#F9FBF9' : '#FFFBFB',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>Project Checklist (10 Items)</h4>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                    {testsPassed ? 'All 10 quality tests verified.' : 'Resolve remaining items in the project checklist.'}
                                </p>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: testsPassed ? '#2E7D32' : '#D32F2F' }}>
                                {testsPassed ? '10/10' : 'Incomplete'}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Proof Submission */}
                <aside>
                    <section style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '24px', color: 'var(--color-text-primary)' }}>3. Live Artifacts</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>Lovable Project Link</label>
                                <input
                                    type="url"
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                    placeholder="https://lovable.dev/projects/..."
                                    style={{ borderColor: links.lovable && !isValidUrl(links.lovable) ? '#D32F2F' : 'var(--color-border)' }}
                                />
                                {links.lovable && !isValidUrl(links.lovable) && <p style={{ color: '#D32F2F', fontSize: '11px', marginTop: '4px' }}>Invalid URL format</p>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>GitHub Repository</label>
                                <input
                                    type="url"
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                    placeholder="https://github.com/..."
                                    style={{ borderColor: links.github && !isValidUrl(links.github) ? '#D32F2F' : 'var(--color-border)' }}
                                />
                                {links.github && !isValidUrl(links.github) && <p style={{ color: '#D32F2F', fontSize: '11px', marginTop: '4px' }}>Invalid URL format</p>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>Deployed URL</label>
                                <input
                                    type="url"
                                    value={links.deploy}
                                    onChange={(e) => handleLinkChange('deploy', e.target.value)}
                                    placeholder="https://yourapp.vercel.app"
                                    style={{ borderColor: links.deploy && !isValidUrl(links.deploy) ? '#D32F2F' : 'var(--color-border)' }}
                                />
                                {links.deploy && !isValidUrl(links.deploy) && <p style={{ color: '#D32F2F', fontSize: '11px', marginTop: '4px' }}>Invalid URL format</p>}
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <button
                                    className="btn btn-primary"
                                    disabled={!isShipped}
                                    onClick={handleCopySubmission}
                                    style={{ width: '100%', padding: '18px', fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px' }}
                                >
                                    {copyStatus ? '✓ Submission Copied' : 'Copy Final Submission'}
                                </button>

                                {!isShipped && (
                                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {!isAllStepsCompleted && <div style={{ fontSize: '12px', color: '#D32F2F' }}>• 8 Build Steps not verified</div>}
                                        {!testsPassed && <div style={{ fontSize: '12px', color: '#D32F2F' }}>• 10 Checklist items not passed</div>}
                                        {!areLinksValid && <div style={{ fontSize: '12px', color: '#D32F2F' }}>• Valid artifact links required</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {isShipped && (
                        <div style={{ marginTop: '40px', textAlign: 'center', animation: 'fadeIn 1s ease' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#2E7D32' }}>Project 3 Shipped Successfully.</p>
                            <div style={{ width: '40px', height: '1px', backgroundColor: '#C8E6C9', margin: '16px auto' }} />
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default RBProof;
