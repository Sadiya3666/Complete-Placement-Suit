import React from 'react';

const PrimaryWorkspace = () => {
    return (
        <main style={{
            width: '70%',
            padding: 'var(--spacing-5)',
            height: 'calc(100vh - 128px)', // TopBar + Footer height
            overflowY: 'auto',
            backgroundColor: 'var(--color-bg)',
            marginTop: '64px',
            marginRight: '30%', // Space for SecondaryPanel
            marginBottom: '64px'
        }}>
            <div style={{ marginBottom: 'var(--spacing-5)' }}>
                <h1 style={{
                    fontSize: 'var(--text-3xl)',
                    marginBottom: 'var(--spacing-2)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-1px'
                }}>
                    Configure Build
                </h1>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                    Set up the foundational parameters for your new project.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                {/* Card Component Simulation */}
                <div className="card">
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-3)' }}>Project Identity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Project Name</label>
                            <input type="text" placeholder="e.g. Acme Corp SaaS" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Domain</label>
                            <input type="text" placeholder="e.g. acme.com" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-3)' }}>Deployment Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Region</label>
                            <select style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px',
                                backgroundColor: '#fff',
                                fontFamily: 'var(--font-sans)',
                                fontSize: 'var(--text-base)'
                            }}>
                                <option>US East (N. Virginia)</option>
                                <option>EU West (Ireland)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Environment</label>
                            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="env" defaultChecked style={{ accentColor: 'var(--color-accent)' }} /> Production
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="env" style={{ accentColor: 'var(--color-accent)' }} /> Staging
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-3)' }}>Advanced Configuration</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Notes</label>
                            <textarea rows="4" placeholder="Any additional build instructions..."></textarea>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--spacing-2)' }}>
                            <button className="btn btn-primary">Save Configuration</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrimaryWorkspace;
