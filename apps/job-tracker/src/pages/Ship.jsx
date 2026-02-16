import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Ship = () => {
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('jobTrackerTestChecklist')) || {};
        const TEST_ITEM_COUNT = 10; // Number of items in TestChecklist.jsx

        // Simple count check
        const passedCount = Object.values(saved).filter(Boolean).length;

        if (passedCount < TEST_ITEM_COUNT) {
            navigate('/jt/07-test');
        } else {
            setIsComplete(true);
        }
    }, [navigate]);

    if (!isComplete) {
        return null; // Will redirect in useEffect
    }

    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#FAFAFA',
            padding: '24px'
        }}>
            <div style={{
                fontSize: '64px',
                marginBottom: '24px',
                animation: 'pulse 1.5s infinite'
            }}>
                🚀
            </div>

            <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '48px',
                color: '#2E7D32',
                marginBottom: '16px'
            }}>
                Ready for Liftoff.
            </h1>

            <p style={{
                fontSize: '20px',
                color: '#555',
                maxWidth: '600px',
                lineHeight: '1.6'
            }}>
                All systems verified. Your Job Notification Tracker is ready to ship.
                <br />
                Deploy to production with confidence.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                <a href="/dashboard" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                    Return to Dashboard
                </a>
                <button
                    onClick={() => {
                        window.open('https://vercel.com/new', '_blank');
                    }}
                    className="btn btn-secondary"
                >
                    Deploy Now
                </button>
            </div>
        </div>
    );
};

export default Ship;
