import React from 'react';

const Placeholder = ({ title }) => {
    return (
        <div style={{
            padding: 'var(--spacing-5)',
            maxWidth: '1200px',
            margin: '0 auto',
            marginTop: 'var(--spacing-4)',
        }}>
            <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-3)',
                letterSpacing: '-1px'
            }}>
                {title}
            </h1>
            <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                maxWidth: '720px'
            }}>
                This section will be built in the next step.
            </p>
        </div>
    );
};

export default Placeholder;
