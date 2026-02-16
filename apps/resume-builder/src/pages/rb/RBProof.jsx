import React, { useState, useEffect } from 'react';
import { RB_STEPS } from '../../data/rb_steps';

const RBProof = () => {
    const [stats, setStats] = useState([]);
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        const stepStats = RB_STEPS.map(step => ({
            ...step,
            completed: !!localStorage.getItem(step.artifactKey)
        }));
        setStats(stepStats);

        const savedLinks = JSON.parse(localStorage.getItem('rb_project_links')) || {
            lovable: '',
            github: '',
            deploy: ''
        };
        setLinks(savedLinks);
    }, []);

    const handleLinkChange = (field, value) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);
        localStorage.setItem('rb_project_links', JSON.stringify(newLinks));
    };

    const isAllStepsCompleted = stats.every(s => s.completed);
    const isAllLinksProvided = links.lovable && links.github && links.deploy;

    const handleCopySubmission = () => {
        const text = `AI Resume Builder — Project 3 Final Submission

Steps Completed: ${stats.filter(s => s.completed).length}/8

Lovable Link: ${links.lovable}
GitHub Link: ${links.github}
Deploy Link: ${links.deploy}

Built with KodNest Premium Build System.`;

        navigator.clipboard.writeText(text);
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)', maxWidth: '1000px' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', marginBottom: '8px' }}>Project 3 Submission</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>AI Resume Builder — Build Track Confirmation</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
                {/* Step Status */}
                <section>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                        1. Build Track Progress
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.map(step => (
                            <div key={step.id} style={{
                                padding: '16px 20px',
                                backgroundColor: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '15px' }}>Step {step.number}</span>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{step.title}</div>
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: step.completed ? 'var(--color-success)' : 'var(--color-accent)',
                                    backgroundColor: step.completed ? '#E8F5E9' : '#FFF5F5',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: `1px solid ${step.completed ? 'var(--color-success)33' : 'var(--color-accent)33'}`
                                }}>
                                    {step.completed ? '✓ Verified' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Artifact Links */}
                <section>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                        2. Deployment Artifacts
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Lovable Link</label>
                            <input
                                type="url"
                                value={links.lovable}
                                onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                placeholder="https://lovable.dev/projects/..."
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>GitHub Link</label>
                            <input
                                type="url"
                                value={links.github}
                                onChange={(e) => handleLinkChange('github', e.target.value)}
                                placeholder="https://github.com/user/repo"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Live Deploy Link</label>
                            <input
                                type="url"
                                value={links.deploy}
                                onChange={(e) => handleLinkChange('deploy', e.target.value)}
                                placeholder="https://my-resume-builder.vercel.app"
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                                disabled={!isAllStepsCompleted || !isAllLinksProvided}
                                onClick={handleCopySubmission}
                            >
                                {copyStatus ? 'Copied Final Submission!' : 'Copy Final Submission'}
                            </button>
                            {!isAllStepsCompleted && (
                                <p style={{ fontSize: '12px', color: 'var(--color-accent)', marginTop: '12px', textAlign: 'center' }}>
                                    ⚠ All 8 build steps must be verified before submission.
                                </p>
                            )}
                            {isAllStepsCompleted && !isAllLinksProvided && (
                                <p style={{ fontSize: '12px', color: 'var(--color-warning)', marginTop: '12px', textAlign: 'center' }}>
                                    ⚠ Provide all 3 artifact links to enable submission.
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#F9FBF9', border: '1px solid var(--color-success)33', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-success)' }}>Ready to Ship?</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                            Once links are verified and steps are green, copy your submission and send it to your project lead.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RBProof;
