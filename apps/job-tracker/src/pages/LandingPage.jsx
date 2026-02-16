import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)',
            textAlign: 'center',
            padding: 'var(--spacing-5) var(--spacing-3)'
        }}>
            <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-2)',
                maxWidth: '800px',
                letterSpacing: '-1px'
            }}>
                Premium Career Management
            </h1>

            <p style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-4)',
                maxWidth: '700px',
                lineHeight: '1.6'
            }}>
                A suite of precision tools for the modern professional. Track opportunities or build your legacy.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                maxWidth: '900px',
                width: '100%',
                marginTop: '16px'
            }}>
                {/* Job Tracker Card */}
                <div className="card" style={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                }} onClick={() => navigate('/dashboard')}>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Project 2</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Job Notification Tracker</h2>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                        Streamline your job search with intelligent matching, real-time tracking, and automated status management.
                    </p>
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}>Open Dashboard</button>
                </div>

                {/* AI Resume Builder Card */}
                <div className="card" style={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                }} onClick={() => navigate('/builder')}>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Project 3</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>AI Resume Builder</h2>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                        Create ATS-optimized, high-impact resumes using AI precision and premium design layouts.
                    </p>
                    <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); navigate('/builder'); }}>Start Building</button>
                </div>
            </div>
        </div>
    );
};


export default LandingPage;
