import React from 'react';

const SecondaryPanel = () => {
    return (
        <aside style={{
            width: '30%',
            minWidth: '320px',
            borderLeft: '1px solid var(--color-border)',
            padding: 'var(--spacing-3)',
            backgroundColor: '#FAFAFA',
            height: 'calc(100vh - 128px)', // TopBar + Footer height
            overflowY: 'auto',
            position: 'fixed',
            right: 0,
            top: '64px',
            zIndex: 90
        }}>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h3 style={{
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-1)'
                }}>
                    Step Guide
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                    Follow these instructions to configure the build system correctly.
                </p>
            </div>

            <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: 'var(--spacing-2)',
                marginBottom: 'var(--spacing-3)'
            }}>
                <div style={{
                    fontSize: '10px',
                    color: '#999',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600
                }}>
                    System Prompt
                </div>
                <code style={{
                    fontSize: '12px',
                    display: 'block',
                    backgroundColor: '#F7F6F3',
                    padding: '12px',
                    borderRadius: '4px',
                    color: '#333',
                    fontFamily: 'monospace',
                    border: '1px solid #eee'
                }}>
                    Initialize build sequence --target=prod --region=us-east-1
                </code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                    Copy Prompt
                </button>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                    Build in Lovable
                </button>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, borderColor: '#e0e0e0', color: '#555' }}>
                        It Worked
                    </button>
                    <button className="btn btn-secondary" style={{ flex: 1, borderColor: '#e0e0e0', color: '#555' }}>
                        Error
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default SecondaryPanel;
