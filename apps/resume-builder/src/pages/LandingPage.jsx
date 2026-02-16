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
                Build a Resume That Gets Read.
            </h1>

            <p style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-4)',
                maxWidth: '600px',
                lineHeight: '1.6'
            }}>
                Precision-matched, ATS-optimized, and premium designed resumes for modern careers.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={() => navigate('/builder')}
                    className="btn btn-primary"
                    style={{
                        fontSize: 'var(--text-lg)',
                        padding: '16px 32px'
                    }}
                >
                    Start Building
                </button>
                <button
                    onClick={() => navigate('/rb/01-problem')}
                    className="btn btn-secondary"
                    style={{
                        fontSize: 'var(--text-lg)',
                        padding: '16px 32px'
                    }}
                >
                    Explore Build Track
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
