import React, { useState } from 'react';

const ProofFooter = () => {
    const [checks, setChecks] = useState({
        ui: false,
        logic: false,
        test: false,
        deployed: false
    });

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            fontFamily: 'var(--font-sans)',
            zIndex: 100
        }}>
            {Object.entries(checks).map(([key, value]) => (
                <label key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '8px',
                    userSelect: 'none'
                }}>
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleCheck(key)}
                        style={{
                            width: '18px',
                            height: '18px',
                            accentColor: 'var(--color-success)',
                            cursor: 'pointer',
                            border: '1px solid var(--color-border)'
                        }}
                    />
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        transition: 'color 0.2s ease'
                    }}>
                        {key === 'ui' && 'UI Built'}
                        {key === 'logic' && 'Logic Working'}
                        {key === 'test' && 'Test Passed'}
                        {key === 'deployed' && 'Deployed'}
                    </span>
                </label>
            ))}
        </div>
    );
};

export default ProofFooter;
