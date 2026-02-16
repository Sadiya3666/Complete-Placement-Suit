import React from 'react';

const ResumeProofPage = () => {
    return (
        <div className="container" style={{ padding: '60px var(--spacing-4)', maxWidth: '800px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)', marginBottom: '16px' }}>Project Artifacts</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
                Secure your implementation results here. Each step requires a confirmed artifact to maintain progress.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                    '01 Problem Definition',
                    '02 Market Research',
                    '03 System Architecture',
                    '04 High-Level Design',
                    '05 Low-Level Design',
                    '06 Core Implementation',
                    '07 Verification & Testing',
                    '08 Final Shipment'
                ].map((step, i) => (
                    <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>{step}</h3>
                            <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px', color: '#666' }}>Pending Verification</span>
                        </div>
                        <textarea placeholder={`Paste artifact for ${step}...`} style={{ minHeight: '80px' }} />
                        <button className="btn btn-secondary" style={{ alignSelf: 'flex-end', fontSize: '12px' }}>Save Artifact</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeProofPage;
