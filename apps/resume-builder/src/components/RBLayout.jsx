import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RBLayout = ({ children, step, totalSteps = 8, title, subtitle, prompt, artifactKey }) => {
    const navigate = useNavigate();
    const [artifact, setArtifact] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [status, setStatus] = useState('In Progress');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const savedArtifact = localStorage.getItem(artifactKey);
        if (savedArtifact) {
            setArtifact(savedArtifact);
            setIsUploaded(true);
            setStatus('Completed');
        } else {
            setArtifact('');
            setIsUploaded(false);
            setStatus('In Progress');
        }
    }, [artifactKey]);

    const handleUpload = () => {
        if (artifact.trim()) {
            localStorage.setItem(artifactKey, artifact);
            setIsUploaded(true);
            setStatus('Completed');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const nextStepPath = () => {
        const currentStepNum = parseInt(step.split('-')[0]);
        if (currentStepNum < totalSteps) {
            const nextNum = currentStepNum + 1;
            const nextStep = nextNum.toString().padStart(2, '0');
            // We need a way to find the ID, but for now we follow the pattern /rb/XX-...
            // A better way is to pass the next path as a prop or find it from data
            return `/rb/${nextStep}`; // This is simplified, needs to match actual routes
        }
        return '/rb/proof';
    };

    // Find next route from path logic - actually easier to just use the step index
    const steps = [
        '01-problem', '02-market', '03-architecture', '04-hld',
        '05-lld', '06-build', '07-test', '08-ship'
    ];
    const currentIndex = steps.indexOf(step);
    const nextPath = currentIndex < steps.length - 1
        ? `/rb/${steps[currentIndex + 1]}`
        : '/rb/proof';

    return (
        <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <div style={{
                height: '64px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                backgroundColor: '#FFFFFF',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 100
            }}>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--color-accent)' }}>
                    AI Resume Builder
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>
                    Project 3 — Step {currentIndex + 1} of {totalSteps}
                </div>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: isUploaded ? '#E8F5E9' : '#F5F5F5',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: isUploaded ? 'var(--color-success)' : '#666',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    border: `1px solid ${isUploaded ? 'var(--color-success)33' : '#ddd'}`
                }}>
                    {status}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', marginTop: '64px', height: 'calc(100vh - 128px)' }}>
                {/* Workspace (70%) */}
                <main style={{ width: '70%', padding: 'var(--spacing-4) var(--spacing-5)', overflowY: 'auto' }}>
                    <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>{title}</h1>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>{subtitle}</p>
                    </div>

                    <div className="card" style={{ minHeight: '300px' }}>
                        {children}

                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: '16px' }}>Upload Artifact (Paste Output or Link)</h3>
                            <textarea
                                value={artifact}
                                onChange={(e) => setArtifact(e.target.value)}
                                placeholder="Paste the result or a link to the artifact here..."
                                style={{ minHeight: '120px', marginBottom: '16px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                    {isUploaded ? '✓ Artifact saved' : '⚠ Artifact required to proceed'}
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                    disabled={!artifact.trim()}
                                >
                                    {isUploaded ? 'Update Artifact' : 'Secure Artifact'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Build Panel (30%) */}
                <aside style={{
                    width: '30%',
                    borderLeft: '1px solid var(--color-border)',
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Copy This Into Lovable
                        </h3>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                readOnly
                                value={prompt}
                                style={{
                                    fontSize: '13px',
                                    backgroundColor: '#F9F9F9',
                                    minHeight: '180px',
                                    fontFamily: 'monospace',
                                    padding: '12px'
                                }}
                            />
                            <button
                                onClick={handleCopy}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    backgroundColor: copySuccess ? 'var(--color-success)' : '#eee',
                                    color: copySuccess ? 'white' : '#666',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer'
                                }}
                            >
                                {copySuccess ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                        Build in Lovable
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px' }}>It Worked</button>
                        <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px' }}>Error</button>
                    </div>

                    <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px', marginTop: '-8px' }}>
                        + Add Screenshot
                    </button>
                </aside>
            </div>

            {/* Proof Footer */}
            <footer style={{
                height: '64px',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isUploaded ? 'var(--color-success)' : '#ddd' }}></div>
                        Artifact Ready
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ddd' }}></div>
                        Prompt Copied
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(nextPath)}
                        disabled={!isUploaded}
                        style={{ opacity: isUploaded ? 1 : 0.5 }}
                    >
                        {currentIndex === totalSteps - 1 ? 'Finish to Proof' : 'Next Step'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default RBLayout;
