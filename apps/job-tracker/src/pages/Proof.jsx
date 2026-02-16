import React, { useState, useEffect } from 'react';

const Proof = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployment: ''
    });
    const [testStats, setTestStats] = useState({ passed: 0, total: 10 });
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        // Load links from localStorage
        const savedLinks = JSON.parse(localStorage.getItem('jobTrackerProjectLinks')) || {
            lovable: '',
            github: '',
            deployment: ''
        };
        setLinks(savedLinks);

        // Load test stats
        const savedTests = JSON.parse(localStorage.getItem('jobTrackerTestChecklist')) || {};
        const passedCount = Object.values(savedTests).filter(Boolean).length;
        setTestStats({ passed: passedCount, total: 10 });
    }, []);

    const handleChange = (field, value) => {
        const updatedLinks = { ...links, [field]: value };
        setLinks(updatedLinks);
        localStorage.setItem('jobTrackerProjectLinks', JSON.stringify(updatedLinks));
    };

    const isValidUrl = (url) => {
        if (!url) return false;
        try {
            // Simple but effective regex for URL format
            return /^https?:\/\/.+\..+/.test(url);
        } catch (e) {
            return false;
        }
    };

    const isAllLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployment);
    const isTestsPassed = testStats.passed === testStats.total;
    const isShipped = isAllLinksValid && isTestsPassed;

    const steps = [
        { id: 1, name: 'Foundation & Layout', status: 'Completed' },
        { id: 2, name: 'Core Interaction Logic', status: 'Completed' },
        { id: 3, name: 'Real Data Integration', status: 'Completed' },
        { id: 4, name: 'Match Scoring Engine', status: 'Completed' },
        { id: 5, name: 'Daily Digest Implementation', status: 'Completed' },
        { id: 6, name: 'Persistent Status Tracking', status: 'Completed' },
        { id: 7, name: 'Test Checklist System', status: 'Completed' },
        { id: 8, name: 'Final Proof & Submission', status: isShipped ? 'Completed' : 'Pending' }
    ];

    const getStatusText = () => {
        if (isShipped) return 'Shipped';
        if (isAllLinksValid || testStats.passed > 0) return 'In Progress';
        return 'Not Started';
    };

    const getStatusColor = () => {
        const text = getStatusText();
        if (text === 'Shipped') return '#E8F5E9'; // Light success
        if (text === 'In Progress') return '#E3F2FD'; // Light info
        return '#F5F5F5';
    };

    const getStatusTextColor = () => {
        const text = getStatusText();
        if (text === 'Shipped') return 'var(--color-success)';
        if (text === 'In Progress') return '#1976D2';
        return 'var(--color-text-secondary)';
    };

    const handleCopySubmission = () => {
        const text = `Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable}

GitHub Repository:
${links.github}

Live Deployment:
${links.deployment}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;

        navigator.clipboard.writeText(text);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)', maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div style={{ animation: 'slideInLeft 0.5s ease-out' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                        Project 1 — Job Notification Tracker
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>Final Build Confirmation & Artifacts</p>
                </div>
                <div style={{
                    padding: '8px 20px',
                    borderRadius: '24px',
                    backgroundColor: getStatusColor(),
                    color: getStatusTextColor(),
                    fontWeight: 600,
                    fontSize: '14px',
                    border: `1px solid ${getStatusTextColor()}33`,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    {getStatusText()}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* Section A: Step Completion Summary */}
                <section style={{ animation: 'fadeIn 0.6s ease-out' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
                        A) Step Completion Summary
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {steps.map(step => (
                            <div key={step.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '14px 18px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}>
                                <span style={{ fontSize: '15px', fontWeight: 500 }}>{step.id}. {step.name}</span>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: step.status === 'Completed' ? 'var(--color-success)' : 'var(--color-warning)'
                                }}>{step.status}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section B: Artifact Collection */}
                <section style={{ animation: 'fadeIn 0.8s ease-out' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
                        B) Artifact Collection Inputs
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
                                Lovable Project Link
                            </label>
                            <input
                                type="url"
                                value={links.lovable}
                                onChange={(e) => handleChange('lovable', e.target.value)}
                                placeholder="https://lovable.dev/projects/..."
                                style={{
                                    borderColor: links.lovable && !isValidUrl(links.lovable) ? '#D32F2F' : 'var(--color-border)',
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
                                GitHub Repository Link
                            </label>
                            <input
                                type="url"
                                value={links.github}
                                onChange={(e) => handleChange('github', e.target.value)}
                                placeholder="https://github.com/user/repo"
                                style={{
                                    borderColor: links.github && !isValidUrl(links.github) ? '#D32F2F' : 'var(--color-border)',
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--color-text-primary)' }}>
                                Deployed URL (Vercel/Netlify)
                            </label>
                            <input
                                type="url"
                                value={links.deployment}
                                onChange={(e) => handleChange('deployment', e.target.value)}
                                placeholder="https://project.vercel.app"
                                style={{
                                    borderColor: links.deployment && !isValidUrl(links.deployment) ? '#D32F2F' : 'var(--color-border)',
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button
                            onClick={handleCopySubmission}
                            disabled={!isAllLinksValid}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                opacity: isAllLinksValid ? 1 : 0.6,
                                cursor: isAllLinksValid ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {copyStatus ? 'Copied to Clipboard!' : 'Copy Final Submission'}
                        </button>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '16px', textAlign: 'center', fontStyle: 'italic' }}>
                            {!isAllLinksValid ? 'Provide all 3 valid URLs to enable final export.' : 'Links validated. Ready for submission.'}
                        </p>
                    </div>
                </section>
            </div>

            {/* Validation & Polish Section */}
            <div style={{
                marginTop: '64px',
                padding: '40px',
                borderRadius: '16px',
                backgroundColor: isShipped ? '#F9FBF9' : '#FAFAFA',
                border: `1px solid ${isShipped ? 'var(--color-success)' : 'var(--color-border)'}55`,
                textAlign: 'center',
                boxShadow: isShipped ? '0 10px 30px rgba(74, 124, 89, 0.05)' : 'none',
                animation: 'fadeInUp 1s ease-out'
            }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginBottom: '24px', color: 'var(--color-text-primary)' }}>
                    Shipment Readiness
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '32px' }}>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: testStats.passed === 10 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                            {testStats.passed}/10
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 500 }}>Tests Passed</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: isAllLinksValid ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                            {Object.values(links).filter(isValidUrl).length}/3
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 500 }}>Artifacts Linked</div>
                    </div>
                </div>

                {isShipped ? (
                    <div style={{
                        color: 'var(--color-success)',
                        fontWeight: 600,
                        fontSize: '20px',
                        animation: 'fadeIn 1s'
                    }}>
                        Project 1 Shipped Successfully.
                    </div>
                ) : (
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                        Mark Project 1 as shipped by completing all 10 checklist items and providing 3 valid artifact URLs.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proof;
